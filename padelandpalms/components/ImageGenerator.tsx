import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Loader2, Wand2, Lock, Download, Calendar, Clock } from 'lucide-react';
import { generateMarketingImage } from '../services/geminiService';

export const ImageGenerator: React.FC = () => {
  // Event details form
  const [eventName, setEventName] = useState('Sunset Padel Social');
  const [subSubject, setSubSubject] = useState(''); // Optional sub-subject line
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('17:00');
  const [eventType, setEventType] = useState('social');
  const [photoStyle, setPhotoStyle] = useState('action');

  const [size, setSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    checkKeyStatus();
  }, []);

  const checkKeyStatus = async () => {
    // Check if we have a valid API key from environment
    const apiKey = import.meta.env.VITE_API_KEY;
    setHasKey(!!apiKey && apiKey !== 'YOUR_ACTUAL_API_KEY_HERE');
  };

  const handleSelectKey = async () => {
    const aistudio = (window as any).aistudio;
    if (aistudio?.openSelectKey) {
      await aistudio.openSelectKey();
      await checkKeyStatus();
    }
  };

  const handleGenerate = async () => {
    if (!eventName) return;
    setIsGenerating(true);
    setGeneratedImage(null);

    // Build prompt from event details
    const prompt = buildPromptFromEventDetails();

    // Pass event details for text overlay (including optional sub-subject)
    const eventDetailsForOverlay = {
      name: eventName,
      subSubject: subSubject, // Optional sub-subject line
      date: eventDate,
      time: eventTime
    };

    const result = await generateMarketingImage(prompt, size, eventDetailsForOverlay);

    if (result) {
      setGeneratedImage(result);
    } else {
      alert("Failed to generate image. Please ensure you have a valid API key with access to gemini-3-pro-image-preview.");
    }
    setIsGenerating(false);
  };

  // Build AI prompt from event form data - MOVIE-STYLE CINEMATOGRAPHY
  const buildPromptFromEventDetails = (): string => {
    // Photo style descriptions - CINEMATIC, DRAMATIC, MOVIE-POSTER STYLE
    const styleDescriptions: Record<string, string> = {
      action: "CINEMATIC action shot, 2-3 players at PEAK DRAMATIC MOMENT mid-rally, STRONG SUN FLARE in background, atmospheric glow, dynamic shadows, dramatic lighting with high contrast, movie poster style, shallow depth of field, epic sports photography",
      lifestyle: "MOVIE-STYLE lifestyle shot, 2-3 players in golden hour DRAMATIC LIGHTING, atmospheric sun rays, warm glow effects, cinematic depth, premium leisure aesthetic, high-end commercial photography with visual impact",
      aerial: "DRAMATIC overhead drone shot, pink court from above with STRIKING VISUAL COMPOSITION, strong shadows creating depth, 2-3 players visible, atmospheric lighting, cinematic color grading, movie poster aesthetic",
      sunset: "EPIC sunset shot with INTENSE SUN FLARE, 1-2 players silhouetted against VIBRANT orange/pink sky, dramatic atmospheric effects, cinematic lighting with lens flares, movie-quality golden hour photography",
      celebration: "DYNAMIC celebration moment, 2-3 players mid-celebration with DRAMATIC LIGHTING, strong sun rays, atmospheric glow, high energy, cinematic sports photography, movie poster intensity",
      courtside: "CINEMATIC courtside perspective, dramatic depth of field, STRONG BACKLIGHTING with sun flares, equipment/refreshments in artistic focus, movie-style visual storytelling, premium commercial aesthetic"
    };

    // Event type context
    const eventDescriptions: Record<string, string> = {
      tournament: "competitive tournament match, 2-3 focused athletes",
      ladies: "women's padel event, 2-3 female players",
      social: "friendly social match, 2-3 mixed players",
      training: "padel coaching session, 1-2 players with instructor",
      corporate: "corporate team event, 2-3 professional players",
      kids: "junior padel session, 2-3 young players"
    };

    const eventContext = eventDescriptions[eventType] || "padel event with 2-3 players";
    const styleContext = styleDescriptions[photoStyle] || "professional close-up photography";

    return `${eventContext}, ${styleContext}, VIBRANT HOT PINK padel court surface prominently visible, DRAMATIC CINEMATIC LIGHTING with sun flares and atmospheric effects, lush tropical environment (palm trees, dramatic skies), MOVIE POSTER aesthetic, high-impact visual with depth and excitement, premium leisure resort vibe, professional cinematic photography, dynamic composition`;
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-pp-teal/20 overflow-hidden w-full max-w-full">
      <div className="bg-pp-green text-white p-3 sm:p-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-pp-pink flex-shrink-0" />
          <h3 className="font-bold font-serif text-sm sm:text-base md:text-lg">Calendar Event Post Generator</h3>
        </div>
        <span className="text-xs uppercase tracking-wider bg-white/10 px-2 py-1 rounded whitespace-nowrap">Auto-Branded</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
        {!hasKey ? (
          <div className="lg:col-span-2 text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800">Unlock Creative Power</h4>
              <p className="text-sm text-gray-500 max-w-xs mx-auto mt-2">
                To generate high-quality marketing visuals, please select your paid API key.
              </p>
            </div>
            <button
              onClick={handleSelectKey}
              className="bg-pp-teal text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-teal-600 transition-colors"
            >
              Select API Key
            </button>
            <p className="text-xs text-gray-400">
              <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="underline hover:text-pp-teal">
                View billing documentation
              </a>
            </p>
          </div>
        ) : (
          <>
            {/* Left side - Form */}
            <div className="space-y-4">
              <div className="bg-pp-teal/5 border border-pp-teal/20 rounded-xl p-4">
                <p className="text-sm text-gray-600">
                  <span className="font-bold text-pp-green">Demo:</span> Fill in event details and watch AI create branded content!
                </p>
              </div>
              {/* Event Name */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Event Name</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pp-teal focus:border-transparent outline-none text-sm"
                  placeholder="e.g., Sunset Padel Social"
                />
              </div>

              {/* Optional Sub-Subject Line */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  Sub-Subject Line <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={subSubject}
                  onChange={(e) => setSubSubject(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pp-teal focus:border-transparent outline-none text-sm"
                  placeholder="e.g., Every Wednesday, Open to All..."
                />
              </div>

              {/* Date and Time Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pp-teal focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Time
                  </label>
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pp-teal focus:border-transparent outline-none text-sm"
                  />
                </div>
              </div>

              {/* Event Type */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Event Type</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pp-teal focus:border-transparent outline-none text-sm"
                >
                  <option value="tournament">Tournament</option>
                  <option value="ladies">Ladies Event</option>
                  <option value="social">Social / Mix</option>
                  <option value="training">Training Session</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="kids">Kids Program</option>
                </select>
              </div>

              {/* Photo Style */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Photo Style</label>
                <select
                  value={photoStyle}
                  onChange={(e) => setPhotoStyle(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pp-teal focus:border-transparent outline-none text-sm"
                >
                  <option value="action">Action Shot - Players in Motion</option>
                  <option value="lifestyle">Lifestyle - Social & Fun</option>
                  <option value="sunset">Sunset - Golden Hour</option>
                  <option value="celebration">Celebration - Team Spirit</option>
                  <option value="aerial">Aerial - Court Overview</option>
                  <option value="courtside">Courtside - Close-up Details</option>
                </select>
              </div>

              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quality</label>
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                    {(['1K', '2K', '4K'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
                          size === s
                            ? 'bg-white text-pp-green shadow-sm'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !eventName}
                  className="flex-1 bg-pp-pink text-white py-3 rounded-xl font-bold shadow-md hover:bg-pink-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Generate
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right side - Preview Area */}
            <div className="flex items-center justify-center">
              {isGenerating ? (
                <div className="w-full aspect-square bg-gradient-to-br from-pp-green/10 to-pp-pink/10 rounded-xl border-2 border-dashed border-pp-teal/30 flex flex-col items-center justify-center gap-6 p-8">
                  {/* Padel Racket Loader Animation */}
                  <div className="relative w-40 h-40">
                    <style>{`
                      @keyframes fillRacket {
                        0% {
                          stop-color: #ec4899;
                        }
                        100% {
                          stop-color: #2d5f3f;
                        }
                      }
                      @keyframes progressFill {
                        0% {
                          height: 0%;
                        }
                        100% {
                          height: 100%;
                        }
                      }
                      @keyframes rotate {
                        0%, 100% {
                          transform: rotate(-5deg);
                        }
                        50% {
                          transform: rotate(5deg);
                        }
                      }
                    `}</style>
                    {/* Padel Racket SVG */}
                    <svg
                      viewBox="0 0 100 200"
                      className="w-full h-full"
                      style={{ animation: 'rotate 2s ease-in-out infinite' }}
                    >
                      <defs>
                        <linearGradient id="racketGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                          <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 1 }}>
                            <animate
                              attributeName="offset"
                              values="0%;100%;0%"
                              dur="3s"
                              repeatCount="indefinite"
                            />
                          </stop>
                          <stop offset="0%" style={{ stopColor: '#2d5f3f', stopOpacity: 1 }}>
                            <animate
                              attributeName="offset"
                              values="0%;100%;0%"
                              dur="3s"
                              repeatCount="indefinite"
                            />
                          </stop>
                        </linearGradient>
                        <mask id="racketMask">
                          {/* Racket head (oval) */}
                          <ellipse cx="50" cy="35" rx="28" ry="32" fill="white" stroke="white" strokeWidth="3"/>
                          {/* Grid pattern */}
                          <line x1="50" y1="5" x2="50" y2="65" stroke="black" strokeWidth="1.5"/>
                          <line x1="35" y1="35" x2="65" y2="35" stroke="black" strokeWidth="1.5"/>
                          <line x1="42" y1="10" x2="42" y2="60" stroke="black" strokeWidth="1"/>
                          <line x1="58" y1="10" x2="58" y2="60" stroke="black" strokeWidth="1"/>
                          <line x1="30" y1="22" x2="70" y2="22" stroke="black" strokeWidth="1"/>
                          <line x1="30" y1="48" x2="70" y2="48" stroke="black" strokeWidth="1"/>
                          {/* Handle */}
                          <rect x="45" y="65" width="10" height="60" fill="white" rx="5"/>
                        </mask>
                      </defs>

                      {/* Base racket (gray) */}
                      <ellipse cx="50" cy="35" rx="28" ry="32" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="3"/>
                      <line x1="50" y1="5" x2="50" y2="65" stroke="#9ca3af" strokeWidth="1.5"/>
                      <line x1="35" y1="35" x2="65" y2="35" stroke="#9ca3af" strokeWidth="1.5"/>
                      <line x1="42" y1="10" x2="42" y2="60" stroke="#9ca3af" strokeWidth="1"/>
                      <line x1="58" y1="10" x2="58" y2="60" stroke="#9ca3af" strokeWidth="1"/>
                      <line x1="30" y1="22" x2="70" y2="22" stroke="#9ca3af" strokeWidth="1"/>
                      <line x1="30" y1="48" x2="70" y2="48" stroke="#9ca3af" strokeWidth="1"/>
                      <rect x="45" y="65" width="10" height="60" fill="#d1d5db" stroke="#9ca3af" strokeWidth="2" rx="5"/>

                      {/* Animated color fill */}
                      <rect x="0" y="0" width="100" height="200" fill="url(#racketGradient)" mask="url(#racketMask)"/>

                      {/* Grip texture */}
                      <line x1="45" y1="70" x2="55" y2="70" stroke="#6b7280" strokeWidth="0.5" opacity="0.5"/>
                      <line x1="45" y1="80" x2="55" y2="80" stroke="#6b7280" strokeWidth="0.5" opacity="0.5"/>
                      <line x1="45" y1="90" x2="55" y2="90" stroke="#6b7280" strokeWidth="0.5" opacity="0.5"/>
                      <line x1="45" y1="100" x2="55" y2="100" stroke="#6b7280" strokeWidth="0.5" opacity="0.5"/>
                      <line x1="45" y1="110" x2="55" y2="110" stroke="#6b7280" strokeWidth="0.5" opacity="0.5"/>
                      <line x1="45" y1="120" x2="55" y2="120" stroke="#6b7280" strokeWidth="0.5" opacity="0.5"/>
                    </svg>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-pp-green font-bold text-lg">Creating Your Event Post...</p>
                    <p className="text-gray-500 text-sm">Adding P&P branding, pink courts & tropical vibes</p>
                  </div>
                </div>
              ) : generatedImage ? (
                <div className="space-y-3 animate-fade-in-up w-full">
                  {/* Event Details Preview */}
                  <div className="bg-pp-green/5 border border-pp-green/20 rounded-lg p-4">
                    <h4 className="font-bold text-pp-green text-sm mb-2">Event Post Ready:</h4>
                    <div className="space-y-1 text-xs text-gray-600">
                      <p><span className="font-semibold">Event:</span> {eventName}</p>
                      {eventDate && <p><span className="font-semibold">Date:</span> {new Date(eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>}
                      {eventTime && <p><span className="font-semibold">Time:</span> {eventTime}</p>}
                    </div>
                  </div>

                  <div className="relative group rounded-xl overflow-hidden border-4 border-pp-green shadow-lg">
                    <img src={generatedImage} alt={`${eventName} social media post`} className="w-full h-auto" />
                    <a
                      href={generatedImage}
                      download={`padel-palms-${eventName.toLowerCase().replace(/\s+/g, '-')}.png`}
                      className="absolute top-4 right-4 bg-white text-pp-green p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                  <p className="text-center text-xs text-gray-400 italic">✨ Automatically branded with P&P logo, pink courts, and tropical aesthetic</p>
                </div>
              ) : (
                <div className="w-full aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-4 p-8">
                  <ImageIcon className="w-16 h-16 text-gray-300" />
                  <p className="text-gray-400 text-sm text-center">
                    Your branded event post<br />will appear here
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};