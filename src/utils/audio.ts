export type SpeechSpeed = 'Slow' | 'Normal' | 'Fast';

export const SPEECH_SPEED_SAMPLE = '你好吗';

export const SPEECH_SPEED_RATES: Record<SpeechSpeed, number> = {
  Slow: 0.72,
  Normal: 0.9,
  Fast: 1.08,
};

export function speechRateForSpeed(speed: SpeechSpeed) {
  return SPEECH_SPEED_RATES[speed] ?? SPEECH_SPEED_RATES.Normal;
}

export function speakMandarin(text: string, rate = SPEECH_SPEED_RATES.Normal) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = rate;
    utterance.pitch = 1;

    utterance.onend = () => resolve();
    utterance.onerror = () => reject(new Error('Speech synthesis failed.'));

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  });
}
