import { useState, useEffect } from 'react';
import { Star, CheckCircle2, Phone } from 'lucide-react';
import CalculatorForm from './CalculatorForm';
import heroBgImg from '../assets/images/hero_clean_apartment_1784931370243.jpg';

interface HeroProps {
  currentCityName: string;
  currentServiceLabel: string;
  currentServiceKey: string;
  onScrollToForm: () => void;
  onSubmitSuccess: (service: string, city: string) => void;
}

export default function Hero({
  currentCityName,
  currentServiceLabel,
  currentServiceKey,
  onScrollToForm,
  onSubmitSuccess
}: HeroProps) {
  const [bgImage, setBgImage] = useState<string>(heroBgImg);

  useEffect(() => {
    // Check if there is an explicit ?hero=1/2/3 parameter
    const params = new URLSearchParams(window.location.search);
    const heroOverride = params.get('hero');
    
    if (heroOverride && ['1', '2', '3'].includes(heroOverride)) {
      setBgImage(heroBgImg);
    } else {
      setBgImage(heroBgImg);
    }
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center py-12 md:py-20 lg:py-24" id="hero-section">
      {/* Background with CSS Cover and overlay */}
      {bgImage && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700 ease-in-out"
          style={{ backgroundImage: `url('${bgImage}')` }}
        ></div>
      )}
      
      {/* Dark overlay for optimal contrast and readability */}
      <div className="absolute inset-0 z-10 bg-black/70" id="hero-overlay"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20 relative text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column (60% width desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 md:space-y-8" id="hero-content">
            {/* Trust badge with Google review summary */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full py-1.5 px-4 border border-white/20 self-start">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="ml-1 text-xs md:text-sm font-bold text-white">4.8/5 Google-betyg</span>
              </div>
            </div>

            {/* Custom Heading with dynamic parameters */}
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight font-display mb-2 text-white"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}
              id="hero-heading"
            >
              {currentCityName ? (
                <>
                  Professionell flyttstädning i <span className="relative text-white px-4 py-1 whitespace-nowrap inline-block font-black align-middle mx-1 md:mx-1.5">
                    <span data-city>{currentCityName}</span>
                    <svg 
                      className="absolute inset-0 w-full h-full text-brand fill-current -z-10 select-none pointer-events-none scale-y-110 scale-x-105" 
                      viewBox="0 0 320 80" 
                      preserveAspectRatio="none" 
                      style={{ filter: 'drop-shadow(0px 1.5px 3px rgba(0,0,0,0.15))' }}
                    >
                      <defs>
                        <filter id="paint-turb">
                          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
                          <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G" />
                        </filter>
                      </defs>
                      {/* Soft outer paint layer */}
                      <path 
                        d="M 12 38 C 45 22, 100 24, 170 18 C 235 12, 280 20, 304 32 C 312 36, 310 46, 298 54 C 265 72, 195 65, 135 71 C 82 77, 40 68, 20 56 C 10 50, 4 41, 12 38 Z" 
                        className="opacity-30" 
                        style={{ filter: 'url(#paint-turb)' }} 
                      />
                      {/* Main solid paint body */}
                      <path 
                        d="M 15 40 C 45 25, 95 28, 165 22 C 230 16, 275 25, 298 38 C 304 42, 302 50, 290 58 C 260 75, 200 68, 140 74 C 90 80, 50 70, 30 58 C 22 52, 12 45, 15 40 Z" 
                        style={{ filter: 'url(#paint-turb)' }} 
                      />
                    </svg>
                  </span> &mdash; se pris med garanti
                </>
              ) : (
                <>
                  Professionell flyttstädning med garanti &mdash; se pris online
                </>
              )}
            </h1>



            {/* Above fold trust ticks checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2" id="hero-feature-checks">
              {[
                "100% Besiktningsgaranti",
                "RUT-avdrag Direkt (Du Betalar 50%)",
                "Godkänd för besiktning",
                "Fast Pris Inkl. Fönsterputs & Ugn/Kyl"
              ].map((tick, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm font-semibold text-gray-50 bg-white/5 backdrop-blur-xs rounded-xl py-2 px-3 border border-white/10 shadow-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/10 flex-shrink-0" />
                  <span>{tick}</span>
                </div>
              ))}
            </div>

            {/* Split CTA buttons just below benefits */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={onScrollToForm}
                className="bg-brand hover:bg-brand-hover text-white text-base font-bold px-8 py-3.5 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
                id="hero-primary-cta"
              >
                <span>Räkna ut mitt pris på 60s →</span>
              </button>
              
              <a
                href="tel:0101753040"
                className="inline-flex items-center justify-center gap-2.5 text-base font-bold text-white bg-white/10 hover:bg-white/20 border border-white/60 rounded-xl px-8 py-3.5 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 min-h-[48px]"
                id="hero-secondary-cta"
              >
                <Phone className="w-5 h-5 text-white flex-shrink-0" />
                <span className="font-bold text-white tracking-tight">eller ring direkt: 010-175 30 40</span>
              </a>
            </div>
          </div>

          {/* Right Column (40% width desktop) */}
          <div className="lg:col-span-5 bg-transparent" id="hero-form-panel">
            <CalculatorForm
              initialService={currentServiceKey}
              initialCity={currentCityName}
              onSubmitSuccess={onSubmitSuccess}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
