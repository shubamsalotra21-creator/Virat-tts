
export enum Emotion {
  COMMANDING = 'Commanding Authority',
  RAGE = 'Intense Rage',
  SORROW = 'Deep Sorrow',
  SARCASTIC = 'Menacing Sarcasm',
  INSPIRATIONAL = 'Epic Inspiration',
  WHISPER = 'Husky Intimate',
  TRIUMPH = 'Roaring Triumph'
}

export interface VoiceSettings {
  emotion: Emotion;
  pacing: number; // 0.5 to 1.5
  bassBoost: boolean;
}

export interface TtsHistoryItem {
  id: string;
  text: string;
  timestamp: number;
  audioBlob: Blob;
  emotion: Emotion;
}
