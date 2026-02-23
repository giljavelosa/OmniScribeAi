/**
 * Voice Activity Detection (VAD) via Web Audio API
 *
 * Uses the existing AnalyserNode (fftSize=256, 128 frequency bins) to detect
 * whether voice is present in the audio stream.
 *
 * Energy ranges (approximate):
 *   Silence:          0–2
 *   Background noise: 3–10
 *   Speech:           20–80+
 *
 * Default threshold: 5 (above ambient noise, below speech)
 */

const DEFAULT_THRESHOLD = 5;

/**
 * Returns true if the average frequency energy exceeds the threshold,
 * indicating voice activity in the current audio frame.
 */
export function isVoiceActive(
  analyser: AnalyserNode,
  threshold: number = DEFAULT_THRESHOLD,
): boolean {
  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);

  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i];
  }
  const average = sum / data.length;

  return average > threshold;
}
