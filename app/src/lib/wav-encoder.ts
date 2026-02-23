/**
 * WAV Encoder — converts raw PCM Float32 samples to a 16-bit WAV Blob.
 *
 * No dependencies. Pure ArrayBuffer manipulation.
 */

/**
 * Encode Float32 PCM samples into a 16-bit mono WAV file.
 *
 * @param samples - Raw audio samples in [-1, 1] range
 * @param sampleRate - Sample rate in Hz (e.g., 16000)
 * @returns WAV Blob ready for upload
 */
export function encodeWAV(samples: Float32Array, sampleRate: number): Blob {
  const numChannels = 1;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * bytesPerSample;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, totalSize - 8, true);    // file size - 8
  writeString(view, 8, 'WAVE');

  // fmt subchunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);              // subchunk size (PCM = 16)
  view.setUint16(20, 1, true);               // audio format (PCM = 1)
  view.setUint16(22, numChannels, true);     // mono
  view.setUint32(24, sampleRate, true);      // sample rate
  view.setUint32(28, byteRate, true);        // byte rate
  view.setUint16(32, blockAlign, true);      // block align
  view.setUint16(34, bitsPerSample, true);   // bits per sample

  // data subchunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);        // data size

  // Convert Float32 [-1, 1] → Int16 [-32768, 32767]
  let offset = headerSize;
  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    const int16 = clamped < 0 ? clamped * 0x8000 : clamped * 0x7FFF;
    view.setInt16(offset, int16, true);
    offset += 2;
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

/**
 * Concatenate multiple Float32Array chunks into one.
 */
export function concatFloat32Arrays(arrays: Float32Array[]): Float32Array {
  let totalLength = 0;
  for (const arr of arrays) {
    totalLength += arr.length;
  }
  const result = new Float32Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

/**
 * Extract a slice of PCM samples from an array of chunks.
 *
 * @param chunks - Array of Float32Array PCM frames
 * @param startSample - Global start sample index
 * @param endSample - Global end sample index
 * @returns Float32Array of the requested range
 */
export function extractPCMSlice(
  chunks: Float32Array[],
  startSample: number,
  endSample: number,
): Float32Array {
  const length = endSample - startSample;
  if (length <= 0) return new Float32Array(0);

  const result = new Float32Array(length);
  let globalOffset = 0;
  let resultOffset = 0;

  for (const chunk of chunks) {
    const chunkEnd = globalOffset + chunk.length;

    if (chunkEnd > startSample && globalOffset < endSample) {
      const copyStart = Math.max(0, startSample - globalOffset);
      const copyEnd = Math.min(chunk.length, endSample - globalOffset);
      const slice = chunk.subarray(copyStart, copyEnd);
      result.set(slice, resultOffset);
      resultOffset += slice.length;
    }

    globalOffset = chunkEnd;
    if (globalOffset >= endSample) break;
  }

  return result;
}

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}
