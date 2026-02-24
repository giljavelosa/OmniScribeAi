import { describe, it, expect } from 'vitest';
import {
  isWavFile,
  parseWavHeader,
  splitWavFile,
  createWavBuffer,
  type WavHeader,
} from '@/lib/audio-chunker';

// ── Helpers: build in-memory WAV buffers for testing ──

/** Create a minimal valid PCM WAV buffer with the given PCM data size (zeros). */
function makeWav(opts: {
  pcmBytes: number;
  sampleRate?: number;
  channels?: number;
  bitsPerSample?: number;
}): ArrayBuffer {
  const { pcmBytes, sampleRate = 16000, channels = 1, bitsPerSample = 16 } = opts;
  const blockAlign = channels * (bitsPerSample / 8);
  const byteRate = sampleRate * blockAlign;
  const buf = new ArrayBuffer(44 + pcmBytes);
  const v = new DataView(buf);

  // RIFF header
  writeStr(v, 0, 'RIFF');
  v.setUint32(4, 36 + pcmBytes, true);
  writeStr(v, 8, 'WAVE');

  // fmt
  writeStr(v, 12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);  // PCM
  v.setUint16(22, channels, true);
  v.setUint32(24, sampleRate, true);
  v.setUint32(28, byteRate, true);
  v.setUint16(32, blockAlign, true);
  v.setUint16(34, bitsPerSample, true);

  // data
  writeStr(v, 36, 'data');
  v.setUint32(40, pcmBytes, true);

  // Fill PCM with a simple pattern (non-zero so we can verify data integrity)
  const bytes = new Uint8Array(buf, 44, pcmBytes);
  for (let i = 0; i < pcmBytes; i++) {
    bytes[i] = i % 256;
  }

  return buf;
}

/** Create a WAV with a LIST metadata chunk between fmt and data. */
function makeWavWithListChunk(pcmBytes: number): ArrayBuffer {
  const sampleRate = 16000;
  const channels = 1;
  const bitsPerSample = 16;
  const blockAlign = channels * (bitsPerSample / 8);
  const byteRate = sampleRate * blockAlign;

  // LIST chunk: 4 bytes type + some dummy content
  const listContent = 'INFOtest data here!'; // 19 chars
  const listChunkSize = listContent.length; // content size
  const listTotalSize = 8 + listChunkSize + (listChunkSize % 2); // pad to even

  const totalSize = 12 + 24 + listTotalSize + 8 + pcmBytes; // RIFF header + fmt chunk + LIST chunk + data chunk
  const buf = new ArrayBuffer(totalSize);
  const v = new DataView(buf);
  let offset = 0;

  // RIFF header
  writeStr(v, offset, 'RIFF'); offset += 4;
  v.setUint32(offset, totalSize - 8, true); offset += 4;
  writeStr(v, offset, 'WAVE'); offset += 4;

  // fmt chunk
  writeStr(v, offset, 'fmt '); offset += 4;
  v.setUint32(offset, 16, true); offset += 4;
  v.setUint16(offset, 1, true); offset += 2; // PCM
  v.setUint16(offset, channels, true); offset += 2;
  v.setUint32(offset, sampleRate, true); offset += 4;
  v.setUint32(offset, byteRate, true); offset += 4;
  v.setUint16(offset, blockAlign, true); offset += 2;
  v.setUint16(offset, bitsPerSample, true); offset += 2;

  // LIST chunk
  writeStr(v, offset, 'LIST'); offset += 4;
  v.setUint32(offset, listChunkSize, true); offset += 4;
  for (let i = 0; i < listContent.length; i++) {
    v.setUint8(offset++, listContent.charCodeAt(i));
  }
  if (listChunkSize % 2 !== 0) offset += 1; // pad byte

  // data chunk
  writeStr(v, offset, 'data'); offset += 4;
  v.setUint32(offset, pcmBytes, true); offset += 4;

  const bytes = new Uint8Array(buf, offset, pcmBytes);
  for (let i = 0; i < pcmBytes; i++) {
    bytes[i] = i % 256;
  }

  return buf;
}

function writeStr(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

// ── Tests ──

describe('isWavFile', () => {
  it('returns true for a valid WAV buffer', () => {
    const wav = makeWav({ pcmBytes: 100 });
    expect(isWavFile(wav)).toBe(true);
  });

  it('returns false for an empty buffer', () => {
    expect(isWavFile(new ArrayBuffer(0))).toBe(false);
  });

  it('returns false for a too-small buffer', () => {
    expect(isWavFile(new ArrayBuffer(8))).toBe(false);
  });

  it('returns false for non-WAV data (MP3-like)', () => {
    const buf = new ArrayBuffer(16);
    const v = new DataView(buf);
    // ID3 tag magic bytes (MP3)
    v.setUint8(0, 0x49); // I
    v.setUint8(1, 0x44); // D
    v.setUint8(2, 0x33); // 3
    expect(isWavFile(buf)).toBe(false);
  });

  it('returns false for RIFF without WAVE format', () => {
    const buf = new ArrayBuffer(12);
    const v = new DataView(buf);
    writeStr(v, 0, 'RIFF');
    v.setUint32(4, 4, true);
    writeStr(v, 8, 'AVI '); // AVI, not WAVE
    expect(isWavFile(buf)).toBe(false);
  });
});

describe('parseWavHeader', () => {
  it('parses a standard 16kHz mono WAV', () => {
    const wav = makeWav({ pcmBytes: 1000, sampleRate: 16000, channels: 1, bitsPerSample: 16 });
    const hdr = parseWavHeader(wav);

    expect(hdr.sampleRate).toBe(16000);
    expect(hdr.channels).toBe(1);
    expect(hdr.bitsPerSample).toBe(16);
    expect(hdr.audioFormat).toBe(1);
    expect(hdr.blockAlign).toBe(2);
    expect(hdr.byteRate).toBe(32000);
    expect(hdr.dataOffset).toBe(44);
    expect(hdr.dataSize).toBe(1000);
  });

  it('parses a stereo 44.1kHz WAV', () => {
    const wav = makeWav({ pcmBytes: 4000, sampleRate: 44100, channels: 2, bitsPerSample: 16 });
    const hdr = parseWavHeader(wav);

    expect(hdr.sampleRate).toBe(44100);
    expect(hdr.channels).toBe(2);
    expect(hdr.bitsPerSample).toBe(16);
    expect(hdr.blockAlign).toBe(4);
    expect(hdr.byteRate).toBe(176400);
  });

  it('handles LIST chunk between fmt and data', () => {
    const wav = makeWavWithListChunk(500);
    const hdr = parseWavHeader(wav);

    expect(hdr.sampleRate).toBe(16000);
    expect(hdr.channels).toBe(1);
    expect(hdr.dataSize).toBe(500);
    expect(hdr.dataOffset).toBeGreaterThan(44); // LIST chunk pushes data further
  });

  it('throws for non-WAV input', () => {
    const buf = new ArrayBuffer(16);
    expect(() => parseWavHeader(buf)).toThrow('Not a valid WAV file');
  });

  it('throws for non-PCM format (e.g. mu-law)', () => {
    const wav = makeWav({ pcmBytes: 100 });
    const v = new DataView(wav);
    v.setUint16(20, 7, true); // mu-law format = 7
    expect(() => parseWavHeader(wav)).toThrow('not PCM');
  });
});

describe('createWavBuffer', () => {
  it('creates a valid WAV from raw PCM', () => {
    const pcm = new ArrayBuffer(200);
    const pcmBytes = new Uint8Array(pcm);
    for (let i = 0; i < 200; i++) pcmBytes[i] = i % 256;

    const wav = createWavBuffer(pcm, 16000, 1, 16);

    expect(isWavFile(wav)).toBe(true);
    expect(wav.byteLength).toBe(44 + 200);

    const hdr = parseWavHeader(wav);
    expect(hdr.sampleRate).toBe(16000);
    expect(hdr.channels).toBe(1);
    expect(hdr.bitsPerSample).toBe(16);
    expect(hdr.dataSize).toBe(200);

    // Verify PCM data is preserved
    const wavPcm = new Uint8Array(wav, 44, 200);
    for (let i = 0; i < 200; i++) {
      expect(wavPcm[i]).toBe(i % 256);
    }
  });
});

describe('splitWavFile', () => {
  it('returns single chunk for a small file', () => {
    const wav = makeWav({ pcmBytes: 1000 });
    const chunks = splitWavFile(wav, 2000); // max 2000 bytes per chunk

    expect(chunks).toHaveLength(1);
    expect(chunks[0].index).toBe(0);
    expect(chunks[0].startTimeSec).toBe(0);
    expect(isWavFile(chunks[0].buffer)).toBe(true);
  });

  it('splits into correct number of chunks for large file', () => {
    // 10000 bytes PCM, max chunk = 544 bytes → 500 bytes PCM per chunk (544 - 44 header)
    // 10000 / 500 = 20 chunks
    const pcmBytes = 10000;
    const maxChunk = 544; // 500 bytes PCM + 44 header
    const wav = makeWav({ pcmBytes, sampleRate: 16000, channels: 1, bitsPerSample: 16 });
    const chunks = splitWavFile(wav, maxChunk);

    // blockAlign = 2 (16-bit mono), so pcmPerChunk = floor(500/2)*2 = 500
    const expectedChunks = Math.ceil(pcmBytes / 500);
    expect(chunks).toHaveLength(expectedChunks);
  });

  it('each chunk is a valid WAV file', () => {
    const wav = makeWav({ pcmBytes: 5000 });
    const chunks = splitWavFile(wav, 544);

    for (const chunk of chunks) {
      expect(isWavFile(chunk.buffer)).toBe(true);
      const hdr = parseWavHeader(chunk.buffer);
      expect(hdr.sampleRate).toBe(16000);
      expect(hdr.channels).toBe(1);
      expect(hdr.bitsPerSample).toBe(16);
    }
  });

  it('time offsets are contiguous', () => {
    const wav = makeWav({ pcmBytes: 5000 });
    const chunks = splitWavFile(wav, 544);

    for (let i = 1; i < chunks.length; i++) {
      const prevEnd = chunks[i - 1].startTimeSec + chunks[i - 1].durationSec;
      expect(chunks[i].startTimeSec).toBeCloseTo(prevEnd, 6);
    }
  });

  it('total duration is preserved', () => {
    const pcmBytes = 6400; // 6400 bytes / (16000 * 2) = 0.2 seconds
    const wav = makeWav({ pcmBytes, sampleRate: 16000, channels: 1, bitsPerSample: 16 });
    const chunks = splitWavFile(wav, 544);

    const expectedDuration = pcmBytes / (16000 * 2);
    const totalDuration = chunks.reduce((sum, c) => sum + c.durationSec, 0);
    expect(totalDuration).toBeCloseTo(expectedDuration, 6);
  });

  it('concatenated PCM equals original (no data loss)', () => {
    const pcmBytes = 3000;
    const wav = makeWav({ pcmBytes, sampleRate: 16000, channels: 1, bitsPerSample: 16 });
    const originalPcm = new Uint8Array(wav, 44, pcmBytes);

    const chunks = splitWavFile(wav, 544);

    // Reassemble all chunk PCM
    const reassembled = new Uint8Array(pcmBytes);
    let offset = 0;
    for (const chunk of chunks) {
      const chunkHdr = parseWavHeader(chunk.buffer);
      const chunkPcm = new Uint8Array(chunk.buffer, chunkHdr.dataOffset, chunkHdr.dataSize);
      reassembled.set(chunkPcm, offset);
      offset += chunkPcm.length;
    }

    expect(offset).toBe(pcmBytes);
    for (let i = 0; i < pcmBytes; i++) {
      expect(reassembled[i]).toBe(originalPcm[i]);
    }
  });

  it('handles file that fits in exactly one chunk', () => {
    // Create a WAV where total size (44 + pcm) is under the max
    const wav = makeWav({ pcmBytes: 400 });
    const chunks = splitWavFile(wav, 500); // 500 > 44 + 400 pcm per chunk

    expect(chunks).toHaveLength(1);
    expect(chunks[0].index).toBe(0);
  });

  it('handles WAV with LIST chunk', () => {
    const wav = makeWavWithListChunk(3000);
    const chunks = splitWavFile(wav, 544);

    expect(chunks.length).toBeGreaterThan(1);

    // Each chunk should be a clean WAV
    for (const chunk of chunks) {
      expect(isWavFile(chunk.buffer)).toBe(true);
    }

    // Total PCM should match original data size
    const originalHdr = parseWavHeader(wav);
    let totalPcm = 0;
    for (const chunk of chunks) {
      const hdr = parseWavHeader(chunk.buffer);
      totalPcm += hdr.dataSize;
    }
    expect(totalPcm).toBe(originalHdr.dataSize);
  });

  it('uses default 20MB max chunk size', () => {
    // Just verify it doesn't throw with default param
    const wav = makeWav({ pcmBytes: 1000 });
    const chunks = splitWavFile(wav);
    expect(chunks).toHaveLength(1); // 1000 bytes << 20MB
  });
});
