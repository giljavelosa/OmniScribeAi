/**
 * PCM Capture AudioWorklet Processor
 *
 * Runs on the Web Audio rendering thread. Captures raw PCM audio frames
 * and posts them to the main thread for accumulation and WAV encoding.
 *
 * Usage:
 *   await audioContext.audioWorklet.addModule('/pcm-capture-processor.js');
 *   const node = new AudioWorkletNode(audioContext, 'pcm-capture-processor');
 *   sourceNode.connect(node);
 *   node.port.onmessage = (e) => { /* e.data.samples: Float32Array */ };
 */
class PCMCaptureProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const channel = inputs[0]?.[0]; // mono: first input, first channel
    if (channel && channel.length > 0) {
      // Copy the samples — the input buffer is reused by the audio thread
      this.port.postMessage({ samples: new Float32Array(channel) });
    }
    return true; // keep processor alive
  }
}

registerProcessor('pcm-capture-processor', PCMCaptureProcessor);
