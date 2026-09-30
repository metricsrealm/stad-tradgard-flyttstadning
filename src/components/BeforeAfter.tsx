import { useState } from 'react';
import { Camera, Check, Clock } from 'lucide-react';

export default function BeforeAfter() {
  const [activeTab, setActiveTab] = useState<'kitchen' | 'bathroom' | 'livingroom'>('kitchen');

  const slides = {
    kitchen: {
      title: "Kök städning",
      beforeUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=50",
      afterUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80",
      caption: "Flyttstädning, Borås — Kök, 90 min"
    },
    bathroom: {
      title: "Badrum städning",
      beforeUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=600&q=50",
      afterUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
      caption: "Flyttstädning, Värnamo — Badrum, 120 min"
    },
    livingroom: {
      title: "Vardagsrum städning",
      beforeUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=50",
      afterUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
      caption: "Flyttstädning, Gnosjö — Vardagsrum, 60 min"
    }
  };

  const activeSlide = slides[activeTab];

  return (
    <section className="py-20 bg-emerald-50/15 border-b border-gray-200" id="before-after-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-[560px] mx-auto mb-10 reveal-on-scroll">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1C2833] mb-2 font-display">
            Resultat som talar för sig självt
          </h2>
          <p className="text-[16px] text-[#5D6D7E] text-center">
            Inga filter — bara noggrann flyttstädning med besiktningsgaranti
          </p>
        </div>

        {/* Categories Tab selector (Fix 7) */}
        <div className="flex justify-center flex-wrap gap-2 mb-8 reveal-on-scroll delay-75" id="before-after-tabs">
          {(Object.keys(slides) as Array<keyof typeof slides>).map((key) => {
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`filter-tab font-medium transition-all duration-300 ease-out cursor-pointer border-[1.5px] rounded-[20px] py-[6px] px-[18px] text-[13px] hover:scale-102 active:scale-98 ${
                  isActive
                    ? 'background-[#EC4C44] bg-[#EC4C44] border-[#EC4C44] text-white shadow-xs'
                    : 'bg-transparent border-[#D5D8DC] text-[#5D6D7E] hover:bg-gray-50'
                }`}
              >
                {slides[key].title}
              </button>
            );
          })}
        </div>

        {/* Comparative Cards Container (Fix 6) */}
        <div className="max-w-4xl mx-auto bg-white p-4 md:p-6 rounded-[12px] border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.08)] reveal-on-scroll delay-150">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
            
            {/* Before Column */}
            <div className="relative rounded-[12px] overflow-hidden aspect-video shadow-xs border border-gray-200/50">
              <img
                src={activeSlide.beforeUrl}
                alt={`${activeSlide.title} Innan`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                loading="lazy"
              />
              <div className="absolute top-3 left-3 bg-gray-900/80 backdrop-blur-xs text-white text-xs font-bold px-3 py-1.5 rounded-md border border-gray-800">
                Innan städning
              </div>
            </div>

            {/* After Column */}
            <div className="relative rounded-[12px] overflow-hidden aspect-video shadow-xs border border-brand/30">
              <img
                src={activeSlide.afterUrl}
                alt={`${activeSlide.title} Efter`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                loading="lazy"
              />
              <div className="absolute top-3 right-3 bg-brand text-white text-xs font-bold px-3 py-1.5 rounded-md border border-green-600/50">
                Efter städning
              </div>
              <div className="absolute bottom-3 right-3 bg-emerald-600/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-sm flex items-center">
                <Check className="w-3 h-3 mr-1" /> SKINANDE RENT
              </div>
            </div>

          </div>

          {/* Caption Box */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-4 px-2">
            <div className="flex items-center gap-2 text-gray-650 text-sm">
              <Camera className="w-5 h-5 text-gray-400" />
              <span>Realistiska bilder från våra faktiska arbeten i regionen.</span>
            </div>
            <div className="bg-[#FAFAF8] px-4 py-2 border border-gray-200 rounded-full flex items-center gap-2 text-xs font-semibold text-gray-850">
              <Clock className="w-4 h-4 text-brand" />
              <span>{activeSlide.caption}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
