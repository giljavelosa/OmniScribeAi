/**
 * Audio Chunker — WAV file parsing and splitting for Groq Whisper's 25MB limit.
 *
 * Pure utility, no Next.js dependencies.
 *
 * WAV format reference:
 *   RIFF header (12 bytes) → subchunks (fmt, data, optional LIST/INFO/etc.)
 *   We walk subchunks to find "fmt " and "data" regardless of order or extras.
 */

export interface WavHeader {
  sampleRate: number;
  channels: number;
  bitsPerSample: number;
  audioFormat: number;
  byteRate: number;
  blockAlign: number;
  dataOffset: number; // byte offset where PCM data starts
  dataSize: number;   // byte length of PCM data
}

export interface AudioChunk {
  buffer: ArrayBuffer;
  index: number;
  startTimeSec: number;
  durationSec: number;
}

const MAX_CHUNK_BYTES = 20 * 1024 * 1024; // 20MB — 5MB headroom under Groq's 25MB limit

/**
 * Check RIFF/WAVE magic bytes.
 */
export function isWavFile(buffer: ArrayBuffer): boolean {
  if (buffer.byteLength < 12) return false;
  const view = new DataView(buffer);
  const riff = view.getUint32(0, false); // "RIFF" big-endian
  const wave = view.getUint32(8, false); // "WAVE" big-endian
  return riff === 0x52494646 && wave === 0x57415645;
}

/**
 * Parse WAV header by walking RIFF subchunks.
 * Handles extra metadata chunks (LIST, INFO, etc.) by skipping them.
 * Validates audioFormat === 1 (PCM only).
 */
export function parseWavHeader(buffer: ArrayBuffer): WavHeader {
  if (!isWavFile(buffer)) {
    throw new Error('Not a valid WAV file');
  }

  const view = new DataView(buffer);
  let offset = 12; // skip RIFF header (4 + 4 + 4)

  let fmtFound = false;
  let dataFound = false;
  let sampleRate = 0;
  let channels = 0;
  let bitsPerSample = 0;
  let audioFormat = 0;
  let byteRate = 0;
  let blockAlign = 0;
  let dataOffset = 0;
  let dataSize = 0;

  while (offset + 8 <= buffer.byteLength) {
    const chunkId = String.fromCharCode(
      view.getUint8(offset),
      view.getUint8(offset + 1),
      view.getUint8(offset + 2),
      view.getUint8(offset + 3),
    );
    const chunkSize = view.getUint32(offset + 4, true); // little-endian

    if (chunkId === 'fmt ') {
      if (offset + 8 + 16 > buffer.byteLength) {
        throw new Error('WAV fmt chunk too short');
      }
      audioFormat = view.getUint16(offset + 8, true);
      channels = view.getUint16(offset + 10, true);
      sampleRate = view.getUint32(offset + 12, true);
      byteRate = view.getUint32(offset + 16, true);
      blockAlign = view.getUint16(offset + 20, true);
      bitsPerSample = view.getUint16(offset + 22, true);
      fmtFound = true;
    } else if (chunkId === 'data') {
      dataOffset = offset + 8;
      dataSize = chunkSize;
      dataFound = true;
    }

    // Move to next chunk (chunks are word-aligned, pad odd sizes)
    offset += 8 + chunkSize;
    if (chunkSize % 2 !== 0) offset += 1;

    if (fmtFound && dataFound) break;
  }

  if (!fmtFound) throw new Error('WAV file missing fmt chunk');
  if (!dataFound) throw new Error('WAV file missing data chunk');
  if (audioFormat !== 1) {
    throw new Error(`WAV file is not PCM (audioFormat=${audioFormat}). Only uncompressed PCM WAV is supported.`);
  }

  return { sampleRate, channels, bitsPerSample, audioFormat, byteRate, blockAlign, dataOffset, dataSize };
}

/**
 * Build a complete WAV file from raw PCM data.
 */
export function createWavBuffer(
  pcmData: ArrayBuffer,
  sampleRate: number,
  channels: number,
  bitsPerSample: number,
): ArrayBuffer {
  const pcmBytes = pcmData.byteLength;
  const blockAlign = channels * (bitsPerSample / 8);
  const byteRate = sampleRate * blockAlign;
  const buffer = new ArrayBuffer(44 + pcmBytes);
  const view = new DataView(buffer);

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + pcmBytes, true);
  writeString(view, 8, 'WAVE');

  // fmt subchunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);            // subchunk size
  view.setUint16(20, 1, true);             // PCM
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // data subchunk
  writeString(view, 36, 'data');
  view.setUint32(40, pcmBytes, true);

  // PCM data
  new Uint8Array(buffer, 44).set(new Uint8Array(pcmData));

  return buffer;
}

/**
 * Split a WAV file into chunks that each fit under maxChunkBytes.
 * Each chunk gets a proper 44-byte WAV header.
 * Splits at sample-aligned boundaries (blockAlign).
 *
 * If file already fits in one chunk, returns single-element array.
 */
export function splitWavFile(
  wavBuffer: ArrayBuffer,
  maxChunkBytes: number = MAX_CHUNK_BYTES,
): AudioChunk[] {
  const header = parseWavHeader(wavBuffer);
  const { sampleRate, channels, bitsPerSample, blockAlign, dataOffset, dataSize } = header;

  // Max PCM bytes per chunk (subtract 44-byte WAV header from budget)
  const maxPcmPerChunk = maxChunkBytes - 44;
  // Align to block boundary
  const pcmPerChunk = Math.floor(maxPcmPerChunk / blockAlign) * blockAlign;

  if (pcmPerChunk <= 0) {
    throw new Error('maxChunkBytes too small to hold even one sample');
  }

  const pcmData = new Uint8Array(wavBuffer, dataOffset, dataSize);
  const chunks: AudioChunk[] = [];

  let bytesRemaining = dataSize;
  let pcmOffset = 0;
  let index = 0;

  while (bytesRemaining > 0) {
    const chunkPcmSize = Math.min(pcmPerChunk, bytesRemaining);
    const chunkPcm = pcmData.slice(pcmOffset, pcmOffset + chunkPcmSize).buffer;

    const startTimeSec = pcmOffset / (sampleRate * blockAlign);
    const durationSec = chunkPcmSize / (sampleRate * blockAlign);

    chunks.push({
      buffer: createWavBuffer(chunkPcm, sampleRate, channels, bitsPerSample),
      index,
      startTimeSec,
      durationSec,
    });

    pcmOffset += chunkPcmSize;
    bytesRemaining -= chunkPcmSize;
    index++;
  }

  return chunks;
}

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}
