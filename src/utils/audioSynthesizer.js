// Web Audio API Atmosphere Sonification & Web Speech Alert Engine

let audioCtx = null;
let currentOsc = null;
let currentGain = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays an ambient atmospheric sonic tone mapped to the real-time AQI density
 * @param {number} aqi 
 * @param {number} durationMs 
 */
export function playAtmosphereTone(aqi = 250, durationMs = 2000) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    stopAudio();

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Map AQI to Frequency & Waveform:
    // Low AQI -> High, pure, soothing sine tone (528Hz)
    // High AQI -> Low, dense, bass drone (90Hz sawtooth/triangle with lowpass filter)
    let freq = 528;
    let waveType = 'sine';

    if (aqi > 400) {
      freq = 82;
      waveType = 'sawtooth';
    } else if (aqi > 300) {
      freq = 110;
      waveType = 'sawtooth';
    } else if (aqi > 200) {
      freq = 164;
      waveType = 'triangle';
    } else if (aqi > 100) {
      freq = 280;
      waveType = 'triangle';
    } else if (aqi > 50) {
      freq = 396;
      waveType = 'sine';
    } else {
      freq = 528;
      waveType = 'sine';
    }

    osc.type = waveType;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Filter to soften any harsh high frequencies
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(1200, freq * 3.5), ctx.currentTime);

    // Gentle Attack & Decay envelope to avoid audio click
    const now = ctx.currentTime;
    const durSec = durationMs / 1000;
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.18, now + 0.15);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + durSec);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durSec);

    currentOsc = osc;
    currentGain = gainNode;
  } catch (err) {
    console.warn('Audio sonification failed or not supported:', err);
  }
}

/**
 * Stops any currently playing audio tone immediately
 */
export function stopAudio() {
  try {
    if (currentOsc) {
      currentOsc.stop();
      currentOsc.disconnect();
      currentOsc = null;
    }
    if (currentGain) {
      currentGain.disconnect();
      currentGain = null;
    }
  } catch {
    // Ignore cleanup errors
  }
}

/**
 * Web Speech API Voice Directive for citizen safety
 * @param {string} text 
 */
export function speakDirective(text) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Stop ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    return false;
  }
}
