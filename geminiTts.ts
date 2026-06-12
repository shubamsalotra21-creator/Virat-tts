
import { GoogleGenAI, Modality } from "@google/genai";
import { Emotion } from "../types";
import { decode, decodeAudioData } from "../utils/audioUtils";

export const generateViraatVoice = async (
  text: string, 
  emotion: Emotion, 
  pacing: number
): Promise<{ audioBuffer: AudioBuffer, context: AudioContext }> => {
  // Always create a new instance right before making an API call to ensure it always uses the most up-to-date API key from the selection dialog
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Enhanced "Human-DNA" prompt to remove AI artifacts
  const prompt = `Perform as 'Viraat'—a 35-year-old Delhi-based male dubbing artist.
  
Vocal Profile: 
- Bass-heavy chest resonance (similar to Thanos/Amitabh Bachchan).
- Strong authority, physically intimidating, magnetic presence.
- Natural Delhi Hindi flow, authentic rhythmic micro-pauses.

Technical Directive:
- Add subtle throat texture and audible breathing between sentences.
- Avoid synthetic consistency; include natural pitch variance.
- Pronunciation: Crystal clear Hindi with authentic North Indian "Lehja".
- Emotion: ${emotion}.
- Style: Cinematic, wide dynamic range, studio-recorded close-mic feel.

Script:
${text}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Fenrir' }, // Fenrir is the deepest bass voice available
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      throw new Error("No audio data received. Check your script or API project.");
    }

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const rawBytes = decode(base64Audio);
    const audioBuffer = await decodeAudioData(rawBytes, audioContext, 24000, 1);

    return { audioBuffer, context: audioContext };
  } catch (error: any) {
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("ENTITY_NOT_FOUND");
    }
    throw error;
  }
};
