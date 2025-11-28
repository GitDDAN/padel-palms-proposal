import { GoogleGenAI, LiveServerMessage, Modality, Blob } from "@google/genai";

// Initialize the client
// We create the client inside the function to ensure we always get the freshest API key
// Vite exposes env variables prefixed with VITE_ as import.meta.env.VITE_*
const getAiClient = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  if (!apiKey || apiKey === 'YOUR_ACTUAL_API_KEY_HERE') {
    console.warn("No valid API_KEY found in environment variables. Please add your Gemini API key to .env.local");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const sendMessageToGemini = async (
  message: string,
  history: { role: 'user' | 'model'; text: string }[]
): Promise<string> => {
  const ai = getAiClient();
  
  if (!ai) {
    // Fallback response if no API key is configured
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("I'm sorry, I'm currently running in demo mode without an active API key. However, in the live version, I would check the inventory and confirm that we can bring a fresh towel to your court immediately!");
      }, 1000);
    });
  }

  try {
    const validHistory = history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }));

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: "You are the smart AI Receptionist for 'Padel & Palms', a luxury padel resort. You are helpful, energetic, and concise. Your goal is to assist guests with bookings, amenities, and requests like towels or drinks. If a user asks for a towel, confirm it will be sent. Keep answers short and friendly."
      },
      history: validHistory
    });

    const result = await chat.sendMessage({ message });
    return result.text || "";
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "I'm having trouble connecting to the reception desk right now. Please try again in a moment.";
  }
};

export const generateMarketingImage = async (
  prompt: string,
  size: '1K' | '2K' | '4K',
  eventDetails?: { name: string; subSubject?: string; date?: string; time?: string }
): Promise<string | null> => {
  const ai = getAiClient();
  if (!ai) {
    console.warn("Cannot generate image without API Key");
    return null;
  }

  try {
    // Enhance prompt to match Padel & Palms aesthetic
    // CRITICAL: NO TEXT should be generated in the image - we add text overlay separately
    const brandedPrompt = `${prompt}. Professional resort photography, vibrant and energetic, suitable for social media marketing. IMPORTANT: DO NOT include any text, words, letters, or typography in the image. Pure photography only, no text overlays.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: brandedPrompt }],
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const baseImage = `data:image/png;base64,${part.inlineData.data}`;
        // Apply Padel & Palms branding overlay with event details
        return await applyBrandingOverlay(baseImage, eventDetails);
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation error:", error);
    return null;
  }
};

// Apply Padel & Palms branding overlay to generated image
const applyBrandingOverlay = async (
  imageDataUrl: string,
  eventDetails?: { name: string; subSubject?: string; date?: string; time?: string }
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imageDataUrl);
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the base image
      ctx.drawImage(img, 0, 0);

      // Brand colors - VIBRANT & HIGH SATURATION
      const padelGreen = '#2d5f3f';
      const vibrantPink = '#ec4899'; // HOT PINK/MAGENTA for titles
      const pureWhite = '#FFFFFF';

      // Add event details text overlay (top section)
      if (eventDetails?.name) {
        // INTENSIFIED OVERLAY - Robust, prominent text-safe zone for MAXIMUM readability
        // Covers entire text block with strong, consistent contrast
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.50);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0.85)'); // INTENSIFIED - Very dark at top
        gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.55)'); // Strong mid-section
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Gentle fade to transparent
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height * 0.50); // Slightly larger coverage for text safety

        let y = canvas.height * 0.06;

        // Split event name into decorative and main parts
        const words = eventDetails.name.split(' ');
        const decorativeWord = words[0]; // First word (e.g., "Sunset", "Anniversary")
        const mainWords = words.slice(1).join(' '); // Rest (e.g., "PADEL SOCIAL")

        // 1. DECORATIVE TITLE - Elegant script font (Hot Pink or White)
        const decorativeSize = canvas.width * 0.08;
        ctx.font = `italic ${decorativeSize}px Georgia, serif`; // Script-like elegant font
        ctx.fillStyle = pureWhite;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // Add subtle text shadow for better legibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        ctx.fillText(decorativeWord, canvas.width / 2, y);
        y += decorativeSize * 1.3;

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // 2. MAIN EVENT TITLE - Tall, thin, elegant serif (ALL CAPS, VIBRANT HOT PINK)
        if (mainWords) {
          const mainTitleSize = canvas.width * 0.14;
          ctx.font = `300 ${mainTitleSize}px "Times New Roman", Georgia, serif`; // Tall, thin serif
          ctx.fillStyle = vibrantPink; // VIBRANT HOT PINK for maximum impact

          // Strong text shadow for maximum contrast
          ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
          ctx.shadowBlur = 20;
          ctx.shadowOffsetX = 3;
          ctx.shadowOffsetY = 3;

          // Word wrap main title
          const maxWidth = canvas.width * 0.9;
          const titleWords = mainWords.toUpperCase().split(' ');
          let line = '';
          const lineHeight = mainTitleSize * 1.1;

          for (let i = 0; i < titleWords.length; i++) {
            const testLine = line + titleWords[i] + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && i > 0) {
              ctx.fillText(line.trim(), canvas.width / 2, y);
              line = titleWords[i] + ' ';
              y += lineHeight;
            } else {
              line = testLine;
            }
          }
          ctx.fillText(line.trim(), canvas.width / 2, y);
          y += lineHeight + canvas.height * 0.02;
        }

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // 3. OPTIONAL SUB-SUBJECT LINE - Clean sans-serif (ALL CAPS, White)
        // Appears directly below Main Event Title
        if (eventDetails.subSubject) {
          const subSubjectSize = canvas.width * 0.04;
          ctx.font = `600 ${subSubjectSize}px Arial, sans-serif`; // Clean, bold sans-serif
          ctx.fillStyle = pureWhite;

          // Add text shadow
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = 12;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;

          ctx.fillText(eventDetails.subSubject.toUpperCase(), canvas.width / 2, y);
          y += subSubjectSize * 1.8;

          // Reset shadow
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
        }

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }

      // Add DATE & TIME at BOTTOM of image (if provided)
      if (eventDetails?.date || eventDetails?.time) {
        // Dark semi-transparent bar at bottom for text readability
        const bottomBarHeight = canvas.height * 0.08;
        const gradient = ctx.createLinearGradient(0, canvas.height - bottomBarHeight, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.75)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, canvas.height - bottomBarHeight, canvas.width, bottomBarHeight);

        // Date & Time styling
        const infoSize = canvas.width * 0.04;
        ctx.font = `700 ${infoSize}px Arial, sans-serif`;
        ctx.fillStyle = pureWhite;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Strong text shadow for maximum readability
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        let bottomY = canvas.height - (bottomBarHeight / 2);

        if (eventDetails.date && eventDetails.time) {
          // Both date and time - show on same line with separator
          const dateObj = new Date(eventDetails.date);
          const formattedDate = dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }).toUpperCase();
          const combinedText = `${formattedDate}  •  ${eventDetails.time}`;
          ctx.fillText(combinedText, canvas.width / 2, bottomY);
        } else if (eventDetails.date) {
          // Only date
          const dateObj = new Date(eventDetails.date);
          const formattedDate = dateObj.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }).toUpperCase();
          ctx.fillText(formattedDate, canvas.width / 2, bottomY);
        } else if (eventDetails.time) {
          // Only time
          ctx.fillText(eventDetails.time, canvas.width / 2, bottomY);
        }

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }

      // Load and draw the WHITE P&P logo in bottom-right corner
      // CRITICAL: Logo must be PURE WHITE with 100% TRANSPARENT background
      // NO BORDER, NO OUTLINE, NO SHADOW, NO BOX - seamless integration only
      const logo = new Image();
      logo.onload = () => {
        // Calculate logo size (12% of canvas width)
        const logoSize = canvas.width * 0.12;
        const padding = canvas.width * 0.025;
        const logoX = canvas.width - logoSize - padding;
        const logoY = canvas.height - logoSize - padding;

        // Draw WHITE logo - PNG transparency is preserved automatically by canvas
        // The transparent background integrates seamlessly into the image
        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

        resolve(canvas.toDataURL('image/png'));
      };
      logo.onerror = () => {
        // Fallback - just resolve without logo if it fails to load
        resolve(canvas.toDataURL('image/png'));
      };
      logo.src = '/images/logo white.png'; // Use WHITE logo
    };
    img.src = imageDataUrl;
  });
};

// --- Live API Support ---

export const connectToLiveSession = (callbacks: {
  onopen?: () => void;
  onmessage?: (message: LiveServerMessage) => void;
  onclose?: () => void;
  onerror?: (error: unknown) => void;
}) => {
  const ai = getAiClient();
  if (!ai) throw new Error("No API Key available");

  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: "You are the energetic, friendly AI Concierge for Padel & Palms, a luxury padel resort in Siargao. Keep your responses brief, helpful, and use a relaxed, tropical tone. Help guests with towels, drinks, and court bookings.",
    }
  });
};

// --- Audio Helper Functions ---

export function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    // Clamp values to [-1, 1] range to avoid overflow/distortion
    const s = Math.max(-1, Math.min(1, data[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}