
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Joke } from "./types";

const API_KEY = process.env.API_KEY || "";

export const generateJokes = async (): Promise<Joke[]> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const systemInstruction = `You are the world's most successful stand-up comedian. 
  Your jokes are legendary for being 100% laughable, clever, and fresh.
  
  CRITICAL RULES:
  1. Generate exactly 20 jokes.
  2. NO "dad jokes" or stale puns.
  3. Use observational humor, witty subversions, and surprising punchlines.
  4. Ensure a mix of short one-liners and slightly longer setups.
  5. The humor should be sharp, modern, and high-energy.
  
  Format: Return a strict JSON array of objects with "setup" and "punchline" strings.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: "Write 20 of your absolute best, most hilarious jokes that would make a whole stadium roar with laughter.",
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            setup: { type: Type.STRING },
            punchline: { type: Type.STRING }
          },
          required: ["setup", "punchline"]
        }
      }
    }
  });

  try {
    const data = JSON.parse(response.text || "[]");
    return data.map((j: any, index: number) => ({
      ...j,
      id: `joke-${Date.now()}-${index}`
    }));
  } catch (e) {
    console.error("Failed to parse jokes", e);
    return [];
  }
};

export const speakJoke = async (text: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `Perform this joke as a high-energy, hilarious, squeaky comedic character. Make it sound unstoppable and funny: ${text}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Puck' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) return;

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  };

  const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext);
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start();
};
