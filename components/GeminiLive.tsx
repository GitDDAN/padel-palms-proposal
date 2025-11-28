import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2, Phone, X, AlertCircle } from 'lucide-react';
import { connectToLiveSession, createBlob, decode, decodeAudioData } from '../services/geminiService';
import { LiveServerMessage } from '@google/genai';

export const GeminiLive: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);
  
  // Refs for audio handling
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const inputProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const sessionRef = useRef<Promise<any> | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const outputSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopSession();
    };
  }, []);

  const updateVolume = () => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setVolume(avg);
    }
    animationFrameRef.current = requestAnimationFrame(updateVolume);
  };

  const startSession = async () => {
    setError(null);
    setIsConnecting(true);

    try {
      // 1. Initialize Audio Contexts
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioContextClass({ sampleRate: 16000 });
      const outputCtx = new AudioContextClass({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      // 2. Get Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // 3. Setup Input Processing (Mic -> Live API)
      const inputSource = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      
      // Setup Analyser for visualizer
      const analyser = inputCtx.createAnalyser();
      analyser.fftSize = 256;
      inputSource.connect(analyser);
      analyserRef.current = analyser;
      updateVolume();

      inputSource.connect(processor);
      processor.connect(inputCtx.destination);
      
      inputProcessorRef.current = processor;
      sourceRef.current = inputSource;

      // 4. Connect to Gemini Live API
      const sessionPromise = connectToLiveSession({
        onopen: () => {
          setIsConnecting(false);
          setIsActive(true);
          
          // Start streaming audio data
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmBlob = createBlob(inputData);
            sessionPromise.then(session => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          };
        },
        onmessage: async (msg: LiveServerMessage) => {
          // Handle Audio Output
          const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audioData) {
            const outputCtx = audioContextRef.current;
            if (!outputCtx) return;

            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
            
            const audioBuffer = await decodeAudioData(
              decode(audioData),
              outputCtx,
              24000,
              1
            );

            const source = outputCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputCtx.destination);
            
            source.addEventListener('ended', () => {
              outputSourcesRef.current.delete(source);
            });

            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            outputSourcesRef.current.add(source);
          }
          
          // Handle Interruption
          if (msg.serverContent?.interrupted) {
            outputSourcesRef.current.forEach(src => {
              try { src.stop(); } catch(e) {}
            });
            outputSourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onclose: () => {
          stopSession();
        },
        onerror: (err) => {
          console.error("Gemini Live Error:", err);
          setError("Connection failed. Please check your API key.");
          stopSession();
        }
      });

      sessionRef.current = sessionPromise;

    } catch (err) {
      console.error("Failed to start session:", err);
      setError("Could not access microphone or connect.");
      setIsConnecting(false);
      stopSession();
    }
  };

  const stopSession = () => {
    setIsActive(false);
    setIsConnecting(false);
    setVolume(0);

    // Stop animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Close API Session
    if (sessionRef.current) {
      sessionRef.current.then(session => {
        try { session.close(); } catch(e) {}
      });
      sessionRef.current = null;
    }

    // Stop Mic Stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    // Disconnect Audio Nodes
    if (inputProcessorRef.current) {
      inputProcessorRef.current.disconnect();
      inputProcessorRef.current.onaudioprocess = null;
      inputProcessorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    
    // Clear Output Audio
    outputSourcesRef.current.forEach(src => {
      try { src.stop(); } catch(e) {}
    });
    outputSourcesRef.current.clear();
    nextStartTimeRef.current = 0;
  };

  const handleSelectKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio?.openSelectKey) {
      await aistudio.openSelectKey();
    } else {
      alert("Billing selection is not available in this environment.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-pp-green rounded-3xl shadow-2xl border-4 border-pp-teal overflow-hidden w-full max-w-md mx-auto h-[500px] flex flex-col items-center justify-center relative p-6 text-white transform rotate-1 hover:rotate-0 transition-transform duration-300">
      
      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
           <span className="text-xs font-bold uppercase tracking-widest text-pp-teal">Live Audio 2.0</span>
        </div>
        {error && (
           <div className="flex items-center gap-1 text-xs text-red-300 bg-red-900/50 px-2 py-1 rounded">
             <AlertCircle className="w-3 h-3" />
             {error}
           </div>
        )}
      </div>

      {/* Visualizer / Avatar */}
      <div className="relative mb-12">
        {/* Pulsing Rings */}
        {isActive && (
          <>
            <div className="absolute inset-0 rounded-full border border-pp-teal opacity-50 animate-ping"></div>
            <div className="absolute -inset-4 rounded-full border border-pp-pink opacity-30 animate-pulse delay-75"></div>
          </>
        )}
        
        {/* Main Circle */}
        <div 
          className={`w-32 h-32 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all duration-300 ${isActive ? 'bg-pp-teal scale-110' : 'bg-gray-800'}`}
          style={{
             transform: isActive ? `scale(${1 + volume / 100})` : 'scale(1)'
          }}
        >
          {isConnecting ? (
            <Loader2 className="w-12 h-12 animate-spin text-white" />
          ) : isActive ? (
            <div className="space-y-1 flex gap-1 items-center h-12">
               {/* Fake waveform bars */}
               {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-1 bg-white rounded-full animate-[bounce_1s_infinite]" style={{ height: `${Math.max(10, volume * Math.random() * 2)}px`, animationDelay: `${i * 0.1}s` }}></div>
               ))}
            </div>
          ) : (
            <Phone className="w-12 h-12 text-gray-400" />
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mb-10 space-y-2">
        <h3 className="text-2xl font-serif font-bold">
          {isActive ? "Listening..." : "Start Conversation"}
        </h3>
        <p className="text-white/60 text-sm max-w-[200px] mx-auto">
          {isActive ? "Speak naturally to the AI Receptionist." : "Tap below to call the front desk AI."}
        </p>
      </div>

      {/* Controls */}
      {!isActive ? (
        <button
          onClick={startSession}
          disabled={isConnecting}
          className="group relative flex items-center gap-3 bg-white text-pp-green px-8 py-4 rounded-full font-bold text-lg hover:bg-pp-teal hover:text-white transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Mic className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span>Start Call</span>
        </button>
      ) : (
        <button
          onClick={stopSession}
          className="flex items-center gap-3 bg-red-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-red-600 transition-all shadow-xl"
        >
          <Phone className="w-6 h-6 rotate-[135deg]" />
          <span>End Call</span>
        </button>
      )}

      {/* API Key Check / Helper */}
      {error && error.includes("API key") && (
        <button 
          onClick={handleSelectKey}
          className="mt-4 text-xs underline text-pp-pink hover:text-white"
        >
          Select/Update API Key
        </button>
      )}

    </div>
  );
};