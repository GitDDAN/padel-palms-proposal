import React, { useState } from 'react';
import {
  Smartphone,
  Calendar,
  Globe,
  MessageCircle,
  Zap,
  TrendingUp,
  BarChart3,
  ArrowDown,
  CheckCircle2,
  Instagram,
  Facebook,
  MapPin,
  Mic,
  MessageSquare,
  HelpCircle,
  X
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GeminiChat } from './components/GeminiChat';
import { GeminiLive } from './components/GeminiLive';
import { OrderForm } from './components/OrderForm';
import { ImageGenerator } from './components/ImageGenerator';

// --- Assets & Icons ---

const PadelLogo = () => (
  <div className="relative w-28 h-28 mx-auto mb-8 group cursor-pointer hover:scale-105 transition-transform">
     {/* Main Container - Dark Green Rounded Square */}
     <div className="absolute inset-0 bg-pp-green rounded-3xl shadow-2xl"></div>
     
     <div className="relative z-10 h-full flex flex-col items-center justify-center py-2">
        {/* Abstract Icons Row */}
        <div className="flex items-center justify-center gap-3 mb-1">
          {/* Pink Floral/Star Icon */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-pp-pink drop-shadow-sm">
             <path d="M12 2v20" />
             <path d="M2 12h20" />
             <path d="m4.929 4.929 14.14 14.14" />
             <path d="m4.929 19.07 14.14-14.14" />
             <circle cx="12" cy="12" r="3" fill="currentColor" className="opacity-20" />
          </svg>
          {/* White Racket/Tree Icon */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white drop-shadow-sm">
             <path d="M12 22v-8" />
             <path d="M12 8a4 4 0 0 0-4 4v2h8v-2a4 4 0 0 0-4-4Z" />
             <path d="M12 2v6" />
             <path d="M8 5h8" />
          </svg>
        </div>
        {/* Brand Text */}
        <span className="font-serif font-black text-3xl tracking-widest text-white mt-1">P&P</span>
     </div>
  </div>
);

const BrandLogo: React.FC<{ name: string; color: string; textColor?: string }> = ({ name, color, textColor = 'text-white' }) => (
  <div className={`px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-md sm:rounded-lg font-bold text-xs sm:text-sm md:text-lg shadow-sm ${color} ${textColor} flex items-center justify-center transform hover:scale-105 transition-transform`}>
    {name}
  </div>
);

// --- Reusable Components ---

const Panel: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
  nextId?: string;
  style?: React.CSSProperties;
}> = ({ children, className = '', id, nextId, style }) => {
  const [showButton, setShowButton] = React.useState(true);
  const [playAnimation, setPlayAnimation] = React.useState(false);

  React.useEffect(() => {
    if (id === 'hero') {
      const timer = setTimeout(() => {
        setPlayAnimation(true);
        setShowButton(false);

        // Button comes back after animation (6s total animation time)
        setTimeout(() => {
          setShowButton(true);
          setPlayAnimation(false);
        }, 6000);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [id]);

  const scrollToNext = () => {
    if (nextId) {
      document.getElementById(nextId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      id={id}
      className={`min-h-screen w-full flex flex-col justify-center items-center p-4 pb-32 sm:p-6 sm:pb-36 md:p-12 md:pb-40 md:pt-20 lg:pt-12 lg:pl-64 xl:pl-72 relative border-b-4 md:border-b-0 border-pp-pink/20 ${className}`}
      style={style}
    >
      {children}
      {nextId && (
        <button
          onClick={scrollToNext}
          className={`absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex-col items-center gap-1 sm:gap-1.5 md:gap-2 group cursor-pointer z-20 transition-all duration-500 ${showButton ? 'opacity-100 scale-100' : 'opacity-0 scale-0'} ${id === 'hero' ? 'hidden md:flex' : 'flex'}`}
          aria-label="Next Slide"
        >
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-pp-green shadow-sm mb-0.5 sm:mb-1">
            Next Step
          </span>
          {/* Tennis Ball Scroll Icon */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-[#DFFF00] shadow-[0_0_10px_rgba(204,255,0,0.4)] flex items-center justify-center relative overflow-hidden transition-transform hover:scale-110 scroll-arrow border border-black/5">
            {/* Seams of the ball */}
            <div className="absolute w-14 h-14 rounded-full border-[2px] border-white/60 -top-7 -left-7 pointer-events-none"></div>
            <div className="absolute w-14 h-14 rounded-full border-[2px] border-white/60 -bottom-7 -right-7 pointer-events-none"></div>

            <ArrowDown className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-white drop-shadow-md relative z-10" />
          </div>
        </button>
      )}
      {id === 'hero' && playAnimation && <RollingBallLoop />}
    </section>
  );
};

const RollingBallLoop: React.FC = () => {
  return (
    <div className="hidden md:block absolute inset-0 pointer-events-none overflow-hidden z-50">
      <style>{`
        @keyframes ballRollLoop {
          0% {
            left: 50%;
            bottom: 2rem;
            transform: rotate(0deg);
            opacity: 1;
          }
          /* Roll off to the right */
          25% {
            left: 110%;
            bottom: 2rem;
            transform: rotate(720deg);
            opacity: 1;
          }
          /* Disappear and reappear on left */
          25.01% {
            left: -10%;
            bottom: 2rem;
            transform: rotate(720deg);
            opacity: 1;
          }
          /* Roll back to center */
          75% {
            left: 50%;
            bottom: 2rem;
            transform: rotate(1440deg);
            opacity: 1;
          }
          100% {
            left: 50%;
            bottom: 2rem;
            transform: rotate(1440deg);
            opacity: 0;
          }
        }
      `}</style>
      <div
        className="absolute w-10 h-10 rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #DFFF00, #B8D400)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset -2px -2px 4px rgba(0,0,0,0.2)',
          animation: 'ballRollLoop 6s ease-in-out forwards',
          border: '2px solid rgba(255,255,255,0.3)'
        }}
      >
        {/* Tennis ball seam lines */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div
            className="absolute w-14 h-14 rounded-full border-2 border-white/40"
            style={{ top: '-50%', left: '-50%', transform: 'rotate(45deg)' }}
          ></div>
          <div
            className="absolute w-14 h-14 rounded-full border-2 border-white/40"
            style={{ bottom: '-50%', right: '-50%', transform: 'rotate(45deg)' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const HandwrittenNote: React.FC<{ text: string; showOnMobile?: boolean; onClose?: () => void }> = ({ text }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isClosed, setIsClosed] = React.useState(false);
  const noteRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Animate both when scrolling down AND scrolling back up
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (noteRef.current) {
      observer.observe(noteRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (isClosed) return null;

  return (
    <div ref={noteRef} className="hidden lg:block absolute bottom-8 right-8 z-10 max-w-xs">
      <style>{`
        @keyframes padelSlideIn {
          0% {
            transform: translateX(150%) rotate(180deg) scale(0.3);
            opacity: 0;
          }
          60% {
            transform: translateX(-10px) rotate(5deg) scale(1.05);
            opacity: 1;
          }
          80% {
            transform: translateX(5px) rotate(1deg) scale(0.98);
          }
          100% {
            transform: translateX(0) rotate(2deg) scale(1);
            opacity: 1;
          }
        }
      `}</style>
      <div
        className={`bg-yellow-50 p-6 shadow-xl hover:rotate-0 transition-transform duration-300 relative ${isVisible ? '' : 'opacity-0'}`}
        style={{
          clipPath: 'polygon(0% 2%, 2% 0%, 98% 1%, 100% 3%, 99% 97%, 98% 100%, 2% 99%, 0% 98%)',
          fontFamily: '"Caveat", "Comic Sans MS", cursive',
          animation: isVisible ? 'padelSlideIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none'
        }}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsClosed(true)}
          className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200/50 hover:bg-gray-300/70 transition-colors z-20 group"
          aria-label="Close note"
        >
          <X className="w-4 h-4 text-gray-600 group-hover:text-gray-800" />
        </button>

        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-yellow-100/60 rounded-full blur-sm"></div>
        <p className="text-lg text-gray-700 leading-relaxed relative z-10 pr-6" style={{ fontFamily: '"Caveat", "Comic Sans MS", cursive' }}>
          {text}
        </p>
        <div className="absolute bottom-1 right-3 text-2xl text-pp-pink/40">~</div>
      </div>
    </div>
  );
};

const SlideNavigation: React.FC<{ currentSlide: string }> = ({ currentSlide }) => {
  const slides = [
    { id: 'hero', number: '🏠', title: 'Home', darkBg: true },
    { id: 'panel1', number: '01', title: 'Booking Magic', darkBg: false },
    { id: 'panel2', number: '02', title: 'Activation', darkBg: false },
    { id: 'panel3', number: '03', title: 'Calendar Sync', darkBg: false },
    { id: 'panel4', number: '04', title: 'F&B Upsell', darkBg: true },
    { id: 'panel5', number: '05', title: 'AI Receptionist', darkBg: true },
    { id: 'panel6', number: '06', title: 'Brand Engine', darkBg: false },
    { id: 'panel7', number: '07', title: 'Daily Pulse', darkBg: false },
    { id: 'panel8', number: '08', title: 'Get Started', darkBg: false },
  ];

  const handleSlideClick = (slideId: string) => {
    document.getElementById(slideId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Determine if current section has dark background
  const currentSlideData = slides.find(s => s.number === currentSlide) || slides[0];
  const isDarkBackground = currentSlideData.darkBg;

  return (
    <>
      {/* Desktop Navigation - Left side vertical */}
      <div className="hidden lg:flex fixed top-8 left-6 xl:left-12 z-50 flex-col gap-2 xl:gap-3">
      {slides.map((slide) => (
        <button
          key={slide.id}
          onClick={() => handleSlideClick(slide.id)}
          className="flex items-center gap-2 xl:gap-3 group"
          title={`Go to slide ${slide.number}`}
        >
          <div
            className={`w-10 h-10 xl:w-12 xl:h-12 rounded-full flex items-center justify-center font-bold text-xs xl:text-sm transition-all shadow-lg ${
              currentSlide === slide.number
                ? 'bg-pp-green text-white scale-110 border-2 border-pp-pink'
                : 'bg-white backdrop-blur-sm text-pp-green group-hover:bg-pp-green group-hover:text-white group-hover:scale-105 border-2 border-pp-green/30'
            }`}
          >
            {slide.number}
          </div>
          <span
            className={`text-xl xl:text-2xl transition-all whitespace-nowrap ${
              currentSlide === slide.number
                ? (isDarkBackground ? 'text-white' : 'text-pp-green') + ' font-extrabold scale-105'
                : (isDarkBackground ? 'text-white' : 'text-gray-700') + ' font-bold group-hover:text-pp-pink group-hover:scale-105'
            }`}
            style={{
              fontFamily: '"Caveat", "Comic Sans MS", cursive',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale'
            }}
          >
            {slide.title}
          </span>
        </button>
      ))}
      </div>

      {/* Tablet Navigation - Top bar horizontal */}
      <div className="hidden md:flex lg:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b-2 border-pp-pink/30 z-50 shadow-lg">
        <div className="flex justify-center items-center py-3 px-4 gap-3 overflow-x-auto w-full">
          {slides.map((slide) => (
            <button
              key={slide.id}
              onClick={() => handleSlideClick(slide.id)}
              className="flex items-center gap-2 group flex-shrink-0"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                  currentSlide === slide.number
                    ? 'bg-pp-green text-white scale-110 border-2 border-pp-pink'
                    : 'bg-white text-pp-green group-hover:bg-pp-green group-hover:text-white border-2 border-pp-green/30'
                }`}
              >
                {slide.number}
              </div>
              <span
                className={`text-sm font-bold transition-all whitespace-nowrap ${
                  currentSlide === slide.number
                    ? 'text-pp-green scale-105'
                    : 'text-gray-700 group-hover:text-pp-pink'
                }`}
              >
                {slide.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Navigation - Bottom bar horizontal with improved touch targets */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-pp-pink/30 z-50 shadow-2xl">
        <div className="flex justify-start items-center py-2.5 px-2 gap-1 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {slides.map((slide) => (
            <button
              key={slide.id}
              onClick={() => handleSlideClick(slide.id)}
              className="flex flex-col items-center justify-center gap-1 min-w-[60px] px-2 py-1 group flex-shrink-0 active:scale-95 transition-transform"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all shadow-md ${
                  currentSlide === slide.number
                    ? 'bg-pp-green text-white scale-110 border-2 border-pp-pink'
                    : 'bg-white text-pp-green active:bg-pp-green active:text-white border-2 border-pp-green/30'
                }`}
              >
                {slide.number}
              </div>
              <span className={`text-[9px] font-semibold truncate max-w-[56px] transition-colors ${
                currentSlide === slide.number
                  ? 'text-pp-green'
                  : 'text-gray-600'
              }`}>
                {slide.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

const TechNote: React.FC<{ text: string; light?: boolean }> = ({ text, light = false }) => (
  <div className={`mt-3 sm:mt-4 md:mt-6 ${light ? 'bg-white/10 border-white/30' : 'bg-pp-green/10 border-pp-green'} border-l-2 sm:border-l-3 md:border-l-4 p-2 sm:p-3 md:p-4 rounded-r-lg max-w-xl ${light ? 'hover:bg-white/20' : 'hover:bg-pp-green/20'} transition-colors`}>
    <div className="flex items-start gap-2 sm:gap-2.5 md:gap-3">
      <Zap className={`w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 ${light ? 'text-pp-teal' : 'text-pp-green'} shrink-0 mt-0.5 sm:mt-1`} />
      <p className={`text-xs sm:text-sm font-semibold ${light ? 'text-white' : 'text-pp-green'} leading-relaxed font-mono`}>
        {text}
      </p>
    </div>
  </div>
);

const AddToPackageButton: React.FC<{
  serviceId: string;
  isSelected: boolean;
  onToggle: () => void;
  light?: boolean;
  currency: string;
  convertPrice: (price: number, currency: string) => string;
  serviceNotes: Record<string, string>;
  onUpdateNotes: (serviceId: string, notes: string) => void;
  showPrice?: boolean;
}> = ({ serviceId, isSelected, onToggle, light = false, currency, convertPrice, serviceNotes, onUpdateNotes, showPrice = true }) => {
  // Find service - could be a regular service or a sub-service within a bundle
  let service: any = SERVICES.find(s => s.id === serviceId);

  // If not found, search in sub-services
  if (!service) {
    for (const parentService of SERVICES) {
      if (parentService.subServices) {
        const subService = parentService.subServices.find((sub: any) => sub.id === serviceId);
        if (subService) {
          service = subService;
          break;
        }
      }
    }
  }

  if (!service) return null;

  return (
    <div className="mt-3 sm:mt-4 md:mt-6">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between gap-2 sm:gap-3 md:gap-4 px-3 py-3 sm:px-4 sm:py-3.5 md:px-6 md:py-4 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg transform hover:scale-105 active:scale-95 ${
          isSelected
            ? 'bg-pp-pink text-white border-2 border-pp-pink'
            : light
            ? 'bg-white/10 text-white border-2 border-white/30 hover:bg-white/20'
            : 'bg-white text-pp-green border-2 border-pp-green/30 hover:bg-pp-green/5'
        }`}
      >
        <div className="text-left flex-1">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {isSelected ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-current" />}
            <span>{isSelected ? 'Added to Package' : 'Yes, I\'m Interested'}</span>
          </div>
          <div className={`text-[10px] sm:text-xs mt-0.5 sm:mt-1 ${isSelected ? 'text-white/80' : light ? 'text-white/60' : 'text-gray-500'}`}>
            {service.description}
          </div>
        </div>
        {showPrice && (
          <div className={`text-lg sm:text-xl md:text-2xl font-bold ${isSelected ? 'text-white' : light ? 'text-pp-teal' : 'text-pp-pink'}`}>
            {convertPrice(service.price || service.basePrice || 0, currency)}
            <span className="text-[10px] sm:text-xs font-normal">/mo</span>
          </div>
        )}
      </button>

      {/* Notes input - shows when service is selected */}
      {isSelected && (
        <div className={`mt-2 sm:mt-3 p-3 sm:p-4 rounded-lg sm:rounded-xl ${light ? 'bg-white/10 border border-white/20' : 'bg-white border-2 border-pp-pink/20'}`}>
          <label className={`block text-[10px] sm:text-xs font-semibold mb-1.5 sm:mb-2 ${light ? 'text-white/90' : 'text-gray-700'}`}>
            Add notes or special requirements:
          </label>
          <textarea
            value={serviceNotes[serviceId] || ''}
            onChange={(e) => onUpdateNotes(serviceId, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="e.g., Need integration with specific platform, custom branding requirements, timeline considerations..."
            className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm rounded-md sm:rounded-lg resize-none transition-all ${
              light
                ? 'bg-white/20 border border-white/30 text-white placeholder-white/50 focus:ring-2 focus:ring-pp-pink focus:border-transparent'
                : 'bg-white border border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-pp-pink focus:border-transparent'
            }`}
            rows={3}
          />
        </div>
      )}
    </div>
  );
};

const ComicImage: React.FC<{ src: string; alt: string; caption?: string }> = ({ src, alt, caption }) => (
  <div className="relative group perspective-1000">
    <div className="absolute inset-0 bg-pp-green rounded-md sm:rounded-lg transform translate-x-2 translate-y-2 sm:translate-x-3 sm:translate-y-3 group-hover:translate-x-4 group-hover:translate-y-4 transition-transform"></div>
    <div className="relative bg-white border-2 sm:border-3 md:border-4 border-pp-green p-1.5 sm:p-2 rounded-md sm:rounded-lg transform transition-transform group-hover:-translate-y-1 group-hover:-translate-x-1 shadow-xl">
      <div className="overflow-hidden rounded h-48 sm:h-56 md:h-80 relative bg-gray-200">
        <img src={src} alt={alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
      </div>
      {caption && (
        <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 right-2 sm:right-3 md:right-4 bg-white/95 p-2 sm:p-2.5 md:p-3 text-center border border-pp-green sm:border-2 font-comic text-xs sm:text-sm transform -rotate-1 shadow-lg text-pp-green z-20">
          {caption}
        </div>
      )}
    </div>
  </div>
);

// --- Main App Component ---

// Service offerings with pricing - now structured as bundles
const SERVICES = [
  { id: 'website', name: 'Custom Website Build', description: 'Fully branded design • Villa booking pages • Court reservations • F&B menu & bar • Photo gallery • Community & events • Blog • Location & directions • Guest reviews • Contact forms • Mobile-responsive', price: 2500, panel: null, requiresWebsite: false, isOneTime: true, isBundle: false },
  {
    id: 'booking-automation',
    name: 'Booking Automation & Sync',
    description: 'Never miss a booking. All platforms sync automatically.',
    price: 0,
    panel: 'panel1',
    requiresWebsite: true,
    isBundle: true,
    subServices: [
      { id: 'booking-villas', name: 'Villa Bookings', description: 'Sync all OTA platforms to your master system automatically', price: 299 },
      { id: 'booking-courts', name: 'Court Bookings', description: 'Real-time Playtomic & website sync. Zero double bookings.', price: 149 }
    ]
  },
  {
    id: 'guest-engagement',
    name: 'Notifications Setup',
    description: 'Engage guests before arrival. Increase pre-bookings and satisfaction.',
    price: 0,
    panel: 'panel2',
    requiresWebsite: false,
    isBundle: true,
    dynamicPricing: true,
    subServices: [
      { id: 'notification-1', name: 'Notification Flow 1', description: 'Pre-built template: Guest Pre-Arrival Engagement (customizable triggers available)', basePrice: 88.5, pricePerCount: { 1: 88.5, 2: 75, 3: 62 } },
      { id: 'notification-2', name: 'Notification Flow 2', description: 'Pre-built template: Post-Game F&B Upsell (customizable triggers available)', basePrice: 88.5, pricePerCount: { 1: 88.5, 2: 75, 3: 62 } },
      { id: 'notification-3', name: 'Notification Flow 3', description: 'Pre-built template: Custom flow for your operation (fully customizable)', basePrice: 88.5, pricePerCount: { 1: 88.5, 2: 75, 3: 62 } }
    ]
  },
  {
    id: 'ai-receptionist',
    name: 'AI Receptionist',
    description: '24/7 support without hiring night staff. Handle requests automatically.',
    price: 0,
    panel: 'panel5',
    requiresWebsite: false,
    isBundle: true,
    dynamicPricing: true,
    subServices: [
      { id: 'ai-chat', name: 'Text Chat', description: '24/7 intelligent text responses + staff notifications when needed', basePrice: 59, pricePerCount: { 1: 59, 2: 50, 3: 41 } },
      { id: 'ai-voice', name: 'Voice Calls', description: 'Real-time voice support that sounds human + staff alerts', basePrice: 177, pricePerCount: { 1: 177, 2: 150, 3: 124 } },
      { id: 'ai-email', name: 'Email Support', description: 'Automated email responses for common inquiries + escalation', basePrice: 177, pricePerCount: { 1: 177, 2: 150, 3: 124 } }
    ]
  },
  { id: 'content', name: 'Brand Content Engine', description: 'Stay top-of-mind with 40 posts/week across all platforms. Zero effort.', price: 159, panel: 'panel6', requiresWebsite: false, isBundle: false },
  { id: 'dashboard', name: 'Daily Pulse Dashboard', description: 'See your entire operation at a glance. Catch issues before they become problems.', price: 212, setupFee: 500, panel: 'panel7', requiresWebsite: false, isBundle: false },
];

// Currency exchange rates (based on USD)
const CURRENCY_RATES: Record<string, { rate: number; symbol: string; name: string }> = {
  USD: { rate: 1, symbol: '$', name: 'USD' },
  AUD: { rate: 1.52, symbol: 'A$', name: 'AUD' },
  EUR: { rate: 0.92, symbol: '€', name: 'EUR' },
  DKK: { rate: 6.87, symbol: 'kr', name: 'DKK' },
  PHP: { rate: 56.50, symbol: '₱', name: 'PHP' },
};

// Currency conversion helper
const convertPrice = (usdPrice: number, currency: string): string => {
  const rate = CURRENCY_RATES[currency]?.rate || 1;
  const converted = usdPrice * rate;
  const symbol = CURRENCY_RATES[currency]?.symbol || '$';

  // Format with appropriate decimals
  if (currency === 'PHP' || currency === 'DKK') {
    return `${symbol}${Math.round(converted).toLocaleString()}`;
  }
  return `${symbol}${converted.toFixed(0)}`;
};

const App: React.FC = () => {
  // State for toggling between Voice and Text in Panel 5
  const [useVoiceMode, setUseVoiceMode] = useState(true);
  // State for tracking current section
  const [currentSection, setCurrentSection] = useState<string>('hero');
  // State for selected services (custom package builder)
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  // State for service notes
  const [serviceNotes, setServiceNotes] = useState<Record<string, string>>({});
  // State for currency selection
  const [currency, setCurrency] = useState<string>('USD');

  // Toggle service selection
  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => {
      const service = SERVICES.find(s => s.id === serviceId);
      const hasWebsite = prev.includes('website');

      // Handle bundle parent - toggle all sub-services
      if (service?.isBundle) {
        const subServiceIds = service.subServices?.map(s => s.id) || [];
        const allSubsSelected = subServiceIds.every(id => prev.includes(id));

        if (allSubsSelected) {
          // Deselect all sub-services
          return prev.filter(id => !subServiceIds.includes(id));
        } else {
          // Auto-select website if needed
          const needsWebsite = service.requiresWebsite && !hasWebsite;
          const newServices = [...prev, ...subServiceIds.filter(id => !prev.includes(id))];
          return needsWebsite ? ['website', ...newServices] : newServices;
        }
      }

      // If trying to deselect website, also deselect services that require it
      if (serviceId === 'website' && prev.includes('website')) {
        const allSubServiceIds: string[] = [];
        SERVICES.forEach(s => {
          if (s.requiresWebsite) {
            if (s.isBundle && s.subServices) {
              allSubServiceIds.push(...s.subServices.map(sub => sub.id));
            } else {
              allSubServiceIds.push(s.id);
            }
          }
        });
        return prev.filter(id => id !== 'website' && !allSubServiceIds.includes(id));
      }

      // If service requires website and website not selected, auto-select website
      if (service?.requiresWebsite && !hasWebsite && !prev.includes(serviceId)) {
        return [...prev, 'website', serviceId];
      }

      // Normal toggle for sub-services
      return prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId];
    });
  };

  // Update notes for a service
  const updateServiceNotes = (serviceId: string, notes: string) => {
    setServiceNotes(prev => ({
      ...prev,
      [serviceId]: notes
    }));
  };

  // Calculate total price of selected services
  const calculateTotal = () => {
    let total = 0;
    SERVICES.forEach(service => {
      if (service.isBundle && service.subServices) {
        if (service.dynamicPricing) {
          // Count selected sub-services for dynamic pricing
          const selectedCount = service.subServices.filter(sub =>
            selectedServices.includes(sub.id)
          ).length;

          if (selectedCount > 0) {
            service.subServices.forEach(sub => {
              if (selectedServices.includes(sub.id)) {
                const priceForCount = sub.pricePerCount?.[selectedCount] || sub.basePrice || sub.price || 0;
                total += priceForCount;
              }
            });
          }
        } else {
          // Regular bundle pricing
          service.subServices.forEach(sub => {
            if (selectedServices.includes(sub.id)) {
              total += sub.price || 0;
            }
          });
        }
      } else if (selectedServices.includes(service.id)) {
        // Add price of regular service
        total += service.price || 0;
      }
    });
    return total;
  };

  // Mock Data for Dashboard
  const dashboardData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 5000 },
    { name: 'Thu', revenue: 4500 },
    { name: 'Fri', revenue: 8000 },
    { name: 'Sat', revenue: 9500 },
    { name: 'Sun', revenue: 8800 },
  ];

  // Track scroll position to determine current section
  React.useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'panel1', 'panel2', 'panel3', 'panel4', 'panel5', 'panel6', 'panel7', 'panel8'];
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && scrollPosition >= element.offsetTop) {
          setCurrentSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation
  React.useEffect(() => {
    const sections = ['hero', 'panel1', 'panel2', 'panel3', 'panel4', 'panel5', 'panel6', 'panel7', 'panel8'];

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only navigate if not typing in an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        // Find current section
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        let currentIndex = 0;

        for (let i = 0; i < sections.length; i++) {
          const element = document.getElementById(sections[i]);
          if (element && scrollPosition >= element.offsetTop) {
            currentIndex = i;
          }
        }

        // Go to next section
        const nextIndex = Math.min(currentIndex + 1, sections.length - 1);
        document.getElementById(sections[nextIndex])?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        // Find current section
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        let currentIndex = 0;

        for (let i = 0; i < sections.length; i++) {
          const element = document.getElementById(sections[i]);
          if (element && scrollPosition >= element.offsetTop) {
            currentIndex = i;
          }
        }

        // Go to previous section
        const prevIndex = Math.max(currentIndex - 1, 0);
        document.getElementById(sections[prevIndex])?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Map section IDs to slide numbers
  const sectionToSlide: { [key: string]: string } = {
    'hero': '🏠',
    'panel1': '01',
    'panel2': '02',
    'panel3': '03',
    'panel4': '04',
    'panel5': '05',
    'panel6': '06',
    'panel7': '07',
    'panel8': '08'
  };

  return (
    <main className="font-sans text-gray-800 bg-pp-sand selection:bg-pp-teal selection:text-white">

      {/* Global Navigation - Hidden on Hero */}
      {currentSection !== 'hero' && <SlideNavigation currentSlide={sectionToSlide[currentSection]} />}

      {/* --- HERO SECTION --- */}
      <Panel
        id="hero"
        nextId="panel1"
        className="bg-black text-white relative overflow-hidden p-0 lg:pl-0 xl:pl-0"
      >
        <style>{`
          @keyframes heroFadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes titleSlideInLeft {
            0% {
              opacity: 0;
              transform: translateX(-100px) scale(0.8);
            }
            100% {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }
          @keyframes titleSlideInRight {
            0% {
              opacity: 0;
              transform: translateX(100px) scale(0.8);
            }
            100% {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }
          @keyframes titleGlow {
            0%, 100% {
              text-shadow: 0 0 20px rgba(236, 72, 153, 0.5),
                           0 0 40px rgba(236, 72, 153, 0.3),
                           0 4px 8px rgba(0, 0, 0, 0.8);
            }
            50% {
              text-shadow: 0 0 30px rgba(236, 72, 153, 0.8),
                           0 0 60px rgba(236, 72, 153, 0.5),
                           0 4px 12px rgba(0, 0, 0, 0.9);
            }
          }
          @keyframes ampersandSpin {
            0% {
              opacity: 0;
              transform: rotate(-180deg) scale(0);
            }
            70% {
              transform: rotate(10deg) scale(1.2);
            }
            100% {
              opacity: 1;
              transform: rotate(0deg) scale(1);
            }
          }
          @keyframes titleDisappear {
            0% {
              opacity: 1;
              transform: scale(1);
            }
            100% {
              opacity: 0;
              transform: scale(1.5);
            }
          }
          @keyframes imageFadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
        `}</style>

        {/* Desktop background - standard cover */}
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-background.jpeg')" }}
        ></div>

        <div className="hidden md:block absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40"></div>

        {/* Mobile Layout */}
        <div className="md:hidden absolute inset-0 overflow-hidden">
          {/* Full screen mobile background image */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('/images/c657de4c-0eba-492b-8f34-c14290cd3e21%20(1).png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>

          {/* Content Container - Centered */}
          <div className="relative z-10 h-full flex flex-col justify-center items-center px-6 pt-16 pb-8 gap-8">
            <style>{`
              @keyframes fadeInScale {
                0% {
                  opacity: 0;
                  transform: scale(0.8) translateY(20px);
                }
                100% {
                  opacity: 1;
                  transform: scale(1) translateY(0);
                }
              }
              .animate-title-1 {
                animation: fadeInScale 0.8s ease-out 0.2s both;
              }
              .animate-title-2 {
                animation: fadeInScale 0.8s ease-out 0.6s both;
              }
              .animate-title-3 {
                animation: fadeInScale 0.8s ease-out 1s both;
              }
              .animate-content {
                animation: fadeInScale 0.8s ease-out 1.4s both;
              }
            `}</style>

            {/* Top Section: Badge */}
            <div className="absolute top-6 left-0 right-0 flex justify-center">
              <div className="inline-flex items-center justify-center gap-2 bg-black/70 backdrop-blur-md border border-white/50 px-4 py-2 rounded-full text-white font-bold tracking-wider uppercase shadow-2xl text-xs text-center">
                <MapPin className="w-4 h-4 text-pp-pink flex-shrink-0" />
                <span>Siargao Island • Philippines</span>
              </div>
            </div>

            {/* Padel & Palms Title - Top */}
            <div className="flex flex-col items-center justify-start w-full max-w-lg">
              <h1 className="font-serif font-black text-white leading-tight text-center relative animate-title-1" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 10px rgba(0,0,0,0.8)' }}>
                <div className="text-5xl flex items-center gap-2 justify-center">
                  <span>Padel</span>
                  <span className="text-3xl text-pp-pink">&</span>
                  <span>Palms</span>
                </div>
              </h1>
            </div>

            {/* Description and CTA */}
            <div className="space-y-4 w-full max-w-lg animate-content">
              <h2 className="text-xl font-bold font-sans text-white tracking-wide text-center" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.95), 0 4px 20px rgba(0,0,0,0.9)' }}>
                Your Complete Automation Solution
              </h2>

              <p className="max-w-md mx-auto text-sm font-sans text-center leading-relaxed text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.95), 0 3px 16px rgba(0,0,0,0.8)' }}>
                Seamless booking automation, guest engagement, and AI-powered support for your resort.
              </p>

              <div className="text-center pt-2">
                <button
                  onClick={() => document.getElementById('panel1')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="bg-pink-600 hover:bg-pink-500 text-white px-8 py-4 rounded-full font-bold text-base shadow-2xl transform transition-all hover:scale-105 active:scale-95 uppercase tracking-wider"
                >
                  See How It Works
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Desktop Layout - Original overlay style */}
        <div className="hidden md:block">
          {/* Badge positioned at top */}
          <div className="absolute left-1/2 transform -translate-x-1/2 z-20 top-48 md:top-60">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 md:px-6 md:py-2 rounded-full text-white font-bold tracking-wider uppercase shadow-2xl text-sm md:text-base">
              <MapPin className="w-4 h-4 text-pp-pink" />
              Siargao Island • Philippines
            </div>
          </div>

          <div className="relative z-10 text-center max-w-5xl mx-auto space-y-6 md:space-y-8 animate-fade-in-up pt-60 md:pt-80 px-4">
            <div className="h-20 md:h-32"></div>

            <h2 className="text-2xl md:text-4xl font-bold font-sans text-white tracking-wide mt-3 md:mt-4 drop-shadow-lg">
              Padel & Palms: Your Complete Automation Solution
            </h2>
            <p className="max-w-3xl mx-auto text-base md:text-xl opacity-95 font-sans text-center drop-shadow-md leading-relaxed">
              Transform your resort operations with seamless booking automation, guest engagement, and AI-powered support. From villa reservations to court bookings—all in one effortless system.
            </p>

            {/* Review Proposal CTA - Scrolls to first section */}
            <div className="mt-6 md:mt-12 text-center">
              <button
                onClick={() => document.getElementById('panel1')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="bg-pink-600 hover:bg-pink-500 text-white px-8 md:px-12 py-4 md:py-5 rounded-full font-bold text-base md:text-xl shadow-2xl transform transition-all hover:scale-105 active:scale-95 uppercase tracking-wider"
              >
                See How It Works
              </button>
              <p className="mt-4 text-sm text-gray-300 text-center">Discover the complete automation system built for Padel & Palms</p>
            </div>
          </div>
        </div>
      </Panel>

      {/* --- PANEL 1: Acquisition --- */}
      <Panel id="panel1" nextId="panel2" className="bg-white">
        <HandwrittenNote text="No more manual data entry! Every booking from Booking.com, Agoda, or Airbnb flows straight into your system. Automatically." />
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center max-w-6xl w-full px-4">
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="flex items-center gap-2 md:gap-3 mb-2">
              <Globe className="text-pp-teal w-6 h-6 md:w-8 md:h-8" />
              <h2 className="text-2xl md:text-4xl font-bold text-pp-green font-serif">All Your Bookings, One System</h2>
            </div>
            <p className="text-base md:text-xl text-gray-600 leading-relaxed">
              Every booking—from Booking.com, Airbnb, Agoda, or your P&P website—automatically syncs to your master system. No manual entry. No missed reservations. No duplicate work. Just seamless operations from day one.
            </p>

            {/* OTA Brand Badges */}
            <div className="flex flex-wrap gap-3 my-4">
              <BrandLogo name="P&P Direct" color="bg-pp-pink" />
              <BrandLogo name="Booking.com" color="bg-[#003580]" />
              <BrandLogo name="Agoda" color="bg-[#eec126]" textColor="text-black" />
              <BrandLogo name="Airbnb" color="bg-[#FF5A5F]" />
            </div>

            <TechNote text="All platforms sync instantly. Whether a guest books on the P&P website or any OTA, the data flows automatically into the Master CRM. Zero manual entry, 100% accuracy." />

            <AddToPackageButton
              serviceId="booking-villas"
              isSelected={selectedServices.includes('booking-villas')}
              onToggle={() => toggleService('booking-villas')}
              currency={currency}
              convertPrice={convertPrice}
              serviceNotes={serviceNotes}
              onUpdateNotes={updateServiceNotes}
              showPrice={false}
            />
          </div>
          <ComicImage
            src="/images/booking-illustration.png"
            alt="Person booking villa on Padel & Palms website"
            caption="Alex secures his villa in General Luna!"
          />
        </div>
      </Panel>

      {/* --- PANEL 2: Activation --- */}
      <Panel id="panel2" nextId="panel3" className="bg-pp-green/5">
        <HandwrittenNote text="Send personalized WhatsApp messages to guests BEFORE they arrive. Court bookings start before check-in!" />
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center max-w-6xl w-full px-4">
          <div className="order-2 md:order-1 relative h-64 sm:h-80 md:h-96 flex items-center justify-center">
             {/* Split Screen Visual Mockup */}
             <div className="absolute left-0 sm:left-2 top-8 sm:top-10 w-40 sm:w-48 md:w-56 bg-white border-2 sm:border-3 md:border-4 border-gray-800 rounded-2xl sm:rounded-3xl p-2 sm:p-3 md:p-4 shadow-2xl transform -rotate-6 z-20 hover:rotate-0 transition-transform duration-500">
               <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 md:mb-4 border-b pb-1.5 sm:pb-2">
                 <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">WA</div>
                 <div className="text-[10px] sm:text-xs">
                    <p className="font-bold">Padel & Palms</p>
                    <p className="text-gray-500">Online</p>
                 </div>
               </div>
               <div className="bg-green-50 p-2 sm:p-2.5 md:p-3 rounded-lg text-[10px] sm:text-xs text-gray-800 shadow-inner">
                 "Welcome to Siargao, Alex! 🌴 Your villa is ready. Want to secure a sunset court slot before they're gone?"
               </div>
               <div className="mt-1.5 sm:mt-2 bg-blue-500 text-white text-center py-1.5 sm:py-2 rounded font-bold text-[10px] sm:text-xs cursor-pointer hover:bg-blue-600">
                 Book Court 5 (Sunset)
               </div>
             </div>

             <div className="absolute right-0 sm:right-2 bottom-8 sm:bottom-10 w-40 sm:w-48 md:w-56 bg-white border-2 sm:border-3 md:border-4 border-[#005c9a] rounded-xl p-3 sm:p-4 md:p-6 shadow-2xl transform rotate-3 flex flex-col items-center justify-center gap-2 sm:gap-3 md:gap-4 z-10 hover:rotate-0 transition-transform duration-500">
               {/* Playtomic Fake Logo */}
               <div className="font-bold text-[#005c9a] text-base sm:text-xl md:text-2xl flex items-center gap-1.5 sm:gap-2">
                 <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full border-2 sm:border-3 md:border-4 border-[#005c9a]"></div>
                 Playtomic
               </div>
               <div className="w-full bg-gray-100 rounded p-1.5 sm:p-2">
                 <div className="flex justify-between text-[10px] sm:text-xs mb-1 font-bold text-gray-600">
                   <span>Court 1</span>
                   <span>17:00 - 18:30</span>
                 </div>
                 <div className="h-1.5 sm:h-2 bg-gray-300 rounded-full overflow-hidden">
                   <div className="h-full bg-green-500 w-full animate-pulse"></div>
                 </div>
               </div>
               <span className="text-xs sm:text-sm text-green-600 font-bold flex items-center"><CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1"/> Instant Sync</span>
             </div>
          </div>
          <div className="order-1 md:order-2 space-y-3 sm:space-y-4 md:space-y-6">
            <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 mb-2">
              <Smartphone className="text-pp-pink w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-pp-green font-serif">Engage Guests Before They Arrive</h2>
            </div>
            <p className="text-sm sm:text-base md:text-xl text-gray-600 leading-relaxed">
              Automatically send personalized WhatsApp messages days before check-in. Guests can book court slots, order amenities, and plan their stay—all before setting foot on the island. <span className="font-semibold text-pp-green">Result: Higher pre-arrival bookings and better guest experience.</span>
            </p>
            <TechNote text="Pre-built message templates ready to deploy: Pre-arrival welcome with court booking links • Post-booking upsells (F&B, amenities) • Check-in reminders • Activity suggestions • Repeat guest offers. All messages are customizable—alternative triggers and custom flows available on request." />

            <AddToPackageButton
              serviceId="notification-1"
              isSelected={selectedServices.includes('notification-1')}
              onToggle={() => toggleService('notification-1')}
              currency={currency}
              convertPrice={convertPrice}
              serviceNotes={serviceNotes}
              onUpdateNotes={updateServiceNotes}
              showPrice={false}
            />
          </div>
        </div>
      </Panel>

      {/* --- PANEL 3: Calendar Integrity --- */}
      <Panel id="panel3" nextId="panel4" className="bg-white">
        <HandwrittenNote text="Zero double bookings. Ever. Your court calendars sync across ALL platforms in real-time. Peace of mind guaranteed." />
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center max-w-6xl w-full px-4">
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 mb-2">
              <Calendar className="text-pp-teal w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-pp-green font-serif">Never Double-Book a Court Again</h2>
            </div>
            <p className="text-sm sm:text-base md:text-xl text-gray-600 leading-relaxed">
              Real-time sync between your P&P website and Playtomic means court availability is always accurate—automatically. Book on either platform, and both update instantly. <span className="font-semibold text-pp-green">No conflicts. No awkward conversations. No disappointed guests.</span>
            </p>
            <TechNote text="Bi-directional sync between P&P website and Playtomic ensures court availability is always accurate. Book on either platform, sync happens instantly." />

            <AddToPackageButton
              serviceId="booking-courts"
              isSelected={selectedServices.includes('booking-courts')}
              onToggle={() => toggleService('booking-courts')}
              currency={currency}
              convertPrice={convertPrice}
              serviceNotes={serviceNotes}
              onUpdateNotes={updateServiceNotes}
              showPrice={false}
            />
          </div>
          <ComicImage
            src="/images/calendar-sync-illustration.jpg"
            alt="Guest checking calendar at villa"
            caption="Master Calendar: Always perfectly synced."
          />
        </div>
      </Panel>

      {/* --- PANEL 4: THE SCREENSHOT (WhatsApp Upsell) --- */}
      <Panel id="panel4" nextId="panel5" className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <HandwrittenNote text="Game just ended? Boom! Instant F&B menu with photos sent to their phone. More revenue, zero effort." />
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-3xl md:text-5xl font-bold text-pp-pink mb-4 text-center font-serif">Turn Every Game Into Revenue</h2>
          <p className="text-center text-gray-300 mb-6 text-base md:text-lg max-w-3xl mx-auto">
            The moment a court booking ends, guests receive a perfectly-timed WhatsApp message with your F&B menu, photos, and instant ordering. They're thirsty, engaged, and one tap away from buying.
          </p>
          <p className="text-center text-pp-teal mb-12 text-sm md:text-base font-semibold">
            AI-powered contextual upsells sent at the perfect moment
          </p>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center w-full px-4">
            {/* Phone Mockup */}
            <div className="mx-auto w-full max-w-[280px] sm:max-w-[320px] md:max-w-[340px] bg-white rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem] border-4 sm:border-6 md:border-8 border-gray-950 overflow-hidden shadow-2xl relative">
              <div className="bg-[#075e54] h-12 sm:h-14 md:h-16 flex items-center px-3 sm:px-4 md:px-6 gap-2 sm:gap-2.5 md:gap-3">
                 <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center overflow-hidden">
                   <img src="/images/padel-palms-logo.png" alt="P&P" className="w-full h-full object-cover" />
                 </div>
                 <div>
                   <p className="font-bold text-white text-xs sm:text-sm">Padel & Palms</p>
                   <p className="text-white/60 text-[10px] sm:text-xs">Resort Assistant</p>
                 </div>
              </div>
              <div className="bg-[#e5ddd5] h-[400px] sm:h-[460px] md:h-[520px] p-3 sm:p-3.5 md:p-4 flex flex-col gap-3 sm:gap-3.5 md:gap-4 relative bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0icGF0dGVybiIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiPjxwYXRoIGQ9Ik0wIDUwIEwgNTAgMCBMIDEwMCA1MCBMIDUwIDEwMCBaIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMCwwLDAsMC4wMykiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]">
                {/* Message Bubble with Image */}
                <div className="self-start bg-white p-2 rounded-2xl rounded-tl-none shadow-lg max-w-[90%] text-gray-800 text-sm relative animate-fade-in-up">
                   <p className="font-bold text-pp-green text-xs mb-2 px-2 pt-1">Padel & Palms Assistant</p>
                   <p className="px-2 pb-2 leading-relaxed">Great game! 🎾 Refresh with our courtside menu:</p>

                   {/* Image in message */}
                   <div className="rounded-xl overflow-hidden mb-2">
                     <img src="/images/coconut-courtside.png" alt="Fresh Coconut Drink" className="w-full h-auto" />
                   </div>

                   <div className="px-2 pb-2 space-y-2">
                     <div className="flex items-center gap-2 text-gray-700">
                       <span>🥥</span>
                       <span className="font-semibold">Fresh Coconut - ₱120</span>
                     </div>
                     <div className="flex items-center gap-2 text-gray-700">
                       <span>🍺</span>
                       <span className="font-semibold">Ice Cold Beer - ₱150</span>
                     </div>
                     <div className="flex items-center gap-2 text-gray-700">
                       <span>🥤</span>
                       <span className="font-semibold">Smoothie Bowl - ₱180</span>
                     </div>
                   </div>

                   <a href="#" className="block bg-pp-teal text-white text-center py-3 rounded-lg font-bold mx-2 mb-2 hover:bg-teal-600 transition-colors">
                     View Full Menu
                   </a>

                   <span className="text-[10px] text-gray-400 absolute bottom-2 right-3">Just now</span>
                </div>
              </div>
              {/* Home Indicator */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full"></div>
            </div>

            <div className="space-y-6">
               <div className="p-6 bg-gradient-to-br from-pp-green to-pp-teal rounded-2xl shadow-xl">
                  <h3 className="text-2xl font-bold mb-3 flex items-center gap-2 text-white">
                    <MessageCircle className="w-7 h-7" />
                    Smart Contextual Upsells
                  </h3>
                  <p className="text-white/90 leading-relaxed">
                    The moment a court booking ends, our AI sends a perfectly-timed WhatsApp message with photos, prices, and a direct ordering link. Players are thirsty, engaged, and ready to buy.
                  </p>
               </div>

               <div className="grid grid-cols-3 gap-4">
                 <div className="bg-gray-800 p-4 rounded-xl text-center border border-gray-700">
                   <div className="text-3xl font-bold text-pp-pink">+32%</div>
                   <div className="text-xs text-gray-400 mt-1">F&B Revenue</div>
                 </div>
                 <div className="bg-gray-800 p-4 rounded-xl text-center border border-gray-700">
                   <div className="text-3xl font-bold text-pp-teal">87%</div>
                   <div className="text-xs text-gray-400 mt-1">Click Rate</div>
                 </div>
                 <div className="bg-gray-800 p-4 rounded-xl text-center border border-gray-700">
                   <div className="text-3xl font-bold text-yellow-400">⚡</div>
                   <div className="text-xs text-gray-400 mt-1">Instant</div>
                 </div>
               </div>

               <div className="p-4 bg-gray-800/50 rounded-xl border border-pp-pink/30">
                 <p className="text-sm text-gray-300 italic">
                   "We saw a 3x increase in post-game orders within the first week. Players love the convenience!"
                   <span className="block text-pp-pink mt-1 not-italic font-semibold">- Resort Manager</span>
                 </p>
               </div>

               <AddToPackageButton
                 serviceId="notification-2"
                 isSelected={selectedServices.includes('notification-2')}
                 onToggle={() => toggleService('notification-2')}
                 light
                 currency={currency}
                 convertPrice={convertPrice}
                 serviceNotes={serviceNotes}
                 onUpdateNotes={updateServiceNotes}
                 showPrice={false}
               />
            </div>
          </div>
        </div>
      </Panel>

      {/* --- PANEL 5: AI Receptionist Demo (TEXT + VOICE) --- */}
      <Panel id="panel5" nextId="panel6" className="bg-gradient-to-br from-pp-teal to-[#1a3c34] text-white">
        <HandwrittenNote text="24/7 AI receptionist that talks AND texts! Your staff can focus on real hospitality, not answering 'Where's my towel?'" />
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start lg:items-center max-w-6xl w-full px-4">
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold font-serif text-pp-sand">24/7 AI Guest Support<br/><span className="text-xl sm:text-2xl lg:text-3xl text-pp-teal">(So Your Staff Doesn't Have To)</span></h2>
            <p className="text-sm sm:text-base lg:text-xl text-blue-50 leading-relaxed">
              Guests can text, call, or email with questions—day or night—and get instant, intelligent responses. Need a towel? Want restaurant recommendations? Looking for activity bookings? The AI handles it all and notifies your staff only when needed. <span className="font-semibold text-pp-pink">Your team focuses on high-value hospitality, not repetitive requests.</span>
            </p>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex gap-2 sm:gap-3 md:gap-4 items-start">
                <div className="bg-white/20 p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl rounded-tl-none font-mono text-xs sm:text-sm flex-shrink-0">User</div>
                <p className="pt-1.5 sm:pt-2 text-sm sm:text-base">"Can I order a towel for my next game?"</p>
              </div>
              <div className="flex gap-2 sm:gap-3 md:gap-4 items-start">
                <div className="bg-pp-green p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl rounded-tr-none border border-pp-teal font-mono text-xs sm:text-sm flex-shrink-0">AI</div>
                <p className="pt-1.5 sm:pt-2 text-sm sm:text-base">Routes request to housekeeping & confirms instantly via Voice or Text.</p>
              </div>
            </div>

            {/* Mode Toggle Control */}
            <div className="bg-white/10 p-3 sm:p-4 rounded-xl border border-white/20">
               <label className="text-xs uppercase tracking-widest font-bold text-pp-teal mb-2 sm:mb-3 block">Interaction Mode</label>
               <div className="flex bg-black/20 p-1 rounded-lg">
                  <button
                    onClick={() => setUseVoiceMode(false)}
                    className={`flex-1 py-2.5 sm:py-3 rounded-md flex items-center justify-center gap-1.5 sm:gap-2 font-bold text-xs sm:text-sm transition-all ${!useVoiceMode ? 'bg-white text-pp-green shadow-lg' : 'text-white/60 hover:text-white'}`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Text Chat</span>
                    <span className="xs:hidden">Chat</span>
                  </button>
                  <button
                    onClick={() => setUseVoiceMode(true)}
                    className={`flex-1 py-2.5 sm:py-3 rounded-md flex items-center justify-center gap-1.5 sm:gap-2 font-bold text-xs sm:text-sm transition-all ${useVoiceMode ? 'bg-pp-pink text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
                  >
                    <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Voice Call</span>
                    <span className="xs:hidden">Voice</span>
                    <span className="text-[9px] sm:text-[10px] bg-white/20 px-1 rounded ml-0.5 sm:ml-1">NEW</span>
                  </button>
               </div>
            </div>

            <TechNote text="Powered by Gemini 2.5 Flash Native Audio. Real-time, low-latency voice conversations that feel natural and engaging." light />

            {/* AI Receptionist Options */}
            <div className="space-y-3">
              <AddToPackageButton
                serviceId="ai-chat"
                isSelected={selectedServices.includes('ai-chat')}
                onToggle={() => toggleService('ai-chat')}
                light
                currency={currency}
                convertPrice={convertPrice}
                serviceNotes={serviceNotes}
                onUpdateNotes={updateServiceNotes}
                showPrice={false}
              />
              <AddToPackageButton
                serviceId="ai-voice"
                isSelected={selectedServices.includes('ai-voice')}
                onToggle={() => toggleService('ai-voice')}
                light
                currency={currency}
                convertPrice={convertPrice}
                serviceNotes={serviceNotes}
                onUpdateNotes={updateServiceNotes}
                showPrice={false}
              />
            </div>
          </div>

          {/* Functional Chat/Voice Interface */}
          <div className="text-gray-800 transition-all duration-500 transform">
             {useVoiceMode ? (
               <GeminiLive />
             ) : (
               <GeminiChat />
             )}
          </div>
        </div>
      </Panel>

      {/* --- PANEL 6: Brand Engagement & Image Gen --- */}
      <Panel id="panel6" nextId="panel7" className="bg-white">
        <HandwrittenNote text="Schedule an event, get branded Instagram posts automatically. Pink courts, palm trees, P&P logo - all done for you!" />
        <div className="flex flex-col items-center max-w-6xl mx-auto w-full space-y-6">
           <div className="text-center">
             <h2 className="text-2xl md:text-3xl font-bold text-pp-green mb-2 font-serif">Stay Top-of-Mind, Automatically</h2>
             <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">40 professional posts per week across all your social media platforms. Our AI syncs with your booking calendar, villa management system, and court schedules to automatically generate branded content whenever events happen. New booking? Instantly turns into an Instagram post. Tournament scheduled? Facebook announcement ready. Zero manual work, maximum visibility.</p>
           </div>

           {/* Compact Flow - Responsive */}
           <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2 md:gap-4 text-xs sm:text-sm overflow-x-auto px-2">
              <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 border-2 border-gray-200 rounded-lg bg-gray-50 flex-shrink-0">
                 <Calendar className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-pp-pink flex-shrink-0" />
                 <span className="font-bold whitespace-nowrap text-xs sm:text-sm">Event</span>
              </div>
              <div className="text-lg sm:text-xl md:text-2xl text-gray-300 flex-shrink-0">→</div>
              <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 bg-pp-green text-white rounded-lg shadow-lg flex-shrink-0">
                 <Zap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-300 flex-shrink-0" />
                 <span className="font-bold whitespace-nowrap text-xs sm:text-sm">AI Magic</span>
              </div>
              <div className="text-lg sm:text-xl md:text-2xl text-gray-300 flex-shrink-0">→</div>
              <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 border-2 border-gray-200 rounded-lg bg-gray-50 flex-shrink-0">
                 <div className="flex gap-0.5 sm:gap-1 flex-shrink-0">
                    <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-pink-500" />
                    <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-600" />
                 </div>
                 <span className="font-bold whitespace-nowrap text-xs sm:text-sm">Socials</span>
              </div>
           </div>

           {/* Image Generator - now with built-in preview */}
           <div className="w-full">
             <ImageGenerator />
           </div>

           <div className="w-full flex justify-center mt-8">
             <AddToPackageButton
               serviceId="content"
               isSelected={selectedServices.includes('content')}
               onToggle={() => toggleService('content')}
               currency={currency}
               convertPrice={convertPrice}
               serviceNotes={serviceNotes}
               onUpdateNotes={updateServiceNotes}
               showPrice={false}
             />
           </div>
        </div>
      </Panel>

      {/* --- PANEL 7: Daily Pulse --- */}
      <Panel id="panel7" nextId="panel8" className="bg-gray-50">
        <HandwrittenNote text="One dashboard to rule them all. See Playtomic bookings, POS sales, and CRM data at a glance every morning." />
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center max-w-6xl w-full px-4">
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 mb-2">
               <TrendingUp className="text-pp-green w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
               <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-pp-green font-serif">Your Entire Operation, One Dashboard</h2>
            </div>
            <p className="text-sm sm:text-base md:text-xl text-gray-600 leading-relaxed">
              Morning coffee + morning insights. See Playtomic bookings, POS sales, and CRM data in one place. Spot trends, catch issues before they become problems, and make data-driven decisions—all before your first guest checks in.
            </p>
            <TechNote text="Business Intelligence & Anomaly Alerts. Data aggregated from Playtomic, POS, and CRM into one unified dashboard with smart notifications." />

            <AddToPackageButton
              serviceId="dashboard"
              isSelected={selectedServices.includes('dashboard')}
              onToggle={() => toggleService('dashboard')}
              currency={currency}
              convertPrice={convertPrice}
              serviceNotes={serviceNotes}
              onUpdateNotes={updateServiceNotes}
              showPrice={false}
            />
          </div>

          <div className="flex flex-col gap-6 w-full">
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 w-full h-80 hover:shadow-2xl transition-shadow">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-700 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-pp-teal" />
                  Revenue Aggregation
                </h3>
                <span className="text-green-500 text-sm font-bold">+12% vs Last Week</span>
              </div>
              <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={dashboardData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#14b8a6" fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full">
               <ComicImage
                src="/images/richie-morning-pulse.png"
                alt="Richie checking dashboard with morning coffee"
                caption="Richie checking the morning pulse."
              />
            </div>
          </div>
        </div>
      </Panel>

      {/* --- PANEL 8: Investment & Order Form --- */}
      <Panel id="panel8" className="bg-white">
        <HandwrittenNote text="Pick your package. Start your transformation. Watch your island operation run like clockwork. Let's do this!" />
        <div className="w-full max-w-6xl space-y-16">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center px-4">
             <div className="space-y-3 sm:space-y-4 md:space-y-6">
               <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-pp-green font-serif">Ready to Transform Your Operations?</h2>
               <p className="text-sm sm:text-base md:text-xl text-gray-600 leading-relaxed">
                 This isn't just software—it's your complete automation partner. Eliminate manual data entry. Increase F&B revenue by 20%. Free your staff to focus on hospitality, not admin. Start small or go all-in. Either way, you'll see results from day one.
               </p>
               <div className="flex gap-3 sm:gap-4 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
                  <div className="text-[#635BFF] font-bold text-lg sm:text-xl md:text-2xl flex items-center gap-1">
                     stripe
                  </div>
                  <div className="text-black font-bold text-lg sm:text-xl md:text-2xl flex items-center gap-1">
                     GPay
                  </div>
               </div>
             </div>
             <div className="bg-pp-green text-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl rotate-1 hover:rotate-0 transition-transform cursor-pointer">
               <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 font-comic">The ROI Blueprint</h3>
               <ul className="space-y-3 sm:space-y-4">
                 <li className="flex items-center gap-2 sm:gap-3">
                   <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm sm:text-base">1</div>
                   <span className="text-sm sm:text-base">Zero missed booking opportunities.</span>
                 </li>
                 <li className="flex items-center gap-2 sm:gap-3">
                   <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm sm:text-base">2</div>
                   <span className="text-sm sm:text-base">20% Increase in F&B via upsells.</span>
                 </li>
                 <li className="flex items-center gap-2 sm:gap-3">
                   <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm sm:text-base">3</div>
                   <span className="text-sm sm:text-base">Staff focus on guests, not data entry.</span>
                 </li>
               </ul>
             </div>
          </div>

          {/* Dynamic Order Form */}
          <OrderForm
            selectedServices={selectedServices}
            onToggleService={toggleService}
            totalPrice={calculateTotal()}
            serviceNotes={serviceNotes}
            onUpdateNotes={updateServiceNotes}
            currency={currency}
            convertPrice={convertPrice}
          />
        </div>
      </Panel>

      <footer className="bg-pp-green text-white py-12 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pp-teal to-pp-pink"></div>
        <div className="relative w-32 h-32 mx-auto mb-6">
          <img src="/images/padel-palms-logo.png" alt="Padel & Palms Logo" className="w-full h-full object-contain" />
        </div>

        {/* Currency Selector */}
        <div className="mb-6 px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm font-semibold opacity-70">Currency:</span>
            <div className="flex flex-wrap gap-2 justify-center">
              {Object.entries(CURRENCY_RATES).map(([code, data]) => (
                <button
                  key={code}
                  onClick={() => setCurrency(code)}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all duration-300 ${
                    currency === code
                      ? 'bg-pp-pink text-pp-green shadow-lg scale-105'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {data.symbol} {code}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Demo Disclaimer */}
        <div className="max-w-3xl mx-auto mb-6 px-6">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
            <p className="text-xs text-white/80 leading-relaxed text-center">
              <span className="font-bold text-pp-pink">Demo Proposal Notice:</span> This is an interactive demonstration site designed to illustrate the possibilities and potential of our automation solutions. Features such as the AI Receptionist and Image Generation are functional prototypes included to showcase capabilities. This presentation is in no way the final finished product and serves as a conceptual preview of what can be achieved for Padel & Palms.
            </p>
          </div>
        </div>

        <p className="text-sm opacity-50 font-serif italic">&copy; 2025 The Effortless Flow Proposal • Created for Padel & Palms</p>
      </footer>

    </main>
  );
};

export default App;