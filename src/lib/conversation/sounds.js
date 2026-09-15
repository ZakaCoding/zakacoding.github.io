const SOUND_PREFERENCE_KEY = 'zakacoding.chat.sound.v1';

let audioContext;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  audioContext ||= new AudioContext();
  return audioContext;
};

export const readChatSoundEnabled = () => {
  try {
    return window.localStorage.getItem(SOUND_PREFERENCE_KEY) !== 'off';
  } catch {
    return true;
  }
};

export const saveChatSoundEnabled = (enabled) => {
  try {
    window.localStorage.setItem(SOUND_PREFERENCE_KEY, enabled ? 'on' : 'off');
  } catch {
    // Sound should remain usable when storage is blocked.
  }
};

// Call this from a user gesture so Safari/iOS can unlock the audio context.
export const primeChatSounds = () => {
  const context = getAudioContext();
  if (context?.state === 'suspended') context.resume().catch(() => {});
};

const playTone = ({ frequency, endFrequency, duration, type = 'sine', volume }) => {
  if (!readChatSoundEnabled()) return;
  const context = getAudioContext();
  if (!context || context.state !== 'running') return;

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
};

export const playChatSound = (sound) => {
  if (sound === 'send') {
    playTone({ frequency: 520, endFrequency: 760, duration: 0.1, type: 'triangle', volume: 0.045 });
    return;
  }

  if (sound === 'receive') {
    playTone({ frequency: 660, endFrequency: 850, duration: 0.14, type: 'sine', volume: 0.035 });
  }
};
