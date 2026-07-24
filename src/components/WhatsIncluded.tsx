import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

interface WhatsIncludedProps {
  onScrollToForm?: () => void;
}

export default function WhatsIncluded({ onScrollToForm }: WhatsIncludedProps) {
  const categories = [
    {
      title: "Kök",
      icon: "🍳",
      items: [
        "Ugn & spishäll (in- och utsida)",
        "Kyl & frys (ur- och invändigt)",
        "Köksfläkt, filter & ventilation",
        "Skåp, lådor & bänkskivor (in- & utsida)",
        "Disklåda, kranar & kakel"
      ]
    },
    {
      title: "Badrum & WC",
      icon: "🧼",
      items: [
        "Toalett, handfat & speglar",
        "Dusch, badkar & golvbrunn",
        "Grundlig avkalkning av kakel & kranar",
        "Rengöring av tvättmaskin/torktumlare",
        "Skåp & väggar torkas av"
      ]
    },
    {
      title: "Bostadsrum & Hall",
      icon: "🏡",
      items: [
        "Komplett fönsterputsning (alla sidor)",
        "Dammsugning & våttorkning av alla golv",
        "Golvlister, trösklar & dörrar",
        "Garderober & skåp (in- & utsida)",
        "Element, strömbrytare & vägguttag"
      ]
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-white border-b border-gray-100" id="whats-included-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 font-semibold text-xs px-3.5 py-1.5 rounded-full border border-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-slate-500" />
            <span>Komplett Checklista</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#1C2833] font-display">
            Vad ingår i flyttstädningen?
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed max-w-xl mx-auto">
            Vi städar enligt mäklarnas och hyresvärdarnas godkända checklista. Fönsterputsning och rengöring av ugn & kyl/frys ingår alltid i ditt fasta pris.
          </p>
        </div>

        {/* 3 Main Room Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-slate-50/60 border border-slate-200/80 rounded-2xl p-6 lg:p-7 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-200/80">
                <span className="text-2xl">{cat.icon}</span>
                <h3 className="text-lg font-bold text-gray-900 font-display">{cat.title}</h3>
              </div>
              <ul className="space-y-3">
                {cat.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 leading-snug">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Guarantee Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-50 text-brand rounded-2xl border border-red-100 flex-shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 text-left">
              <h4 className="text-base sm:text-lg font-bold text-gray-900 font-display">
                100% Besiktningsgaranti ingår alltid
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl">
                Om din hyresvärd eller köpare mot förmodan skulle ha någon anmärkning vid slutbesiktningen, återvänder vi och åtgärdar det kostnadsfritt. Du slipper all stress och kan tryggt lämna över nycklarna.
              </p>
            </div>
          </div>

          <button
            onClick={onScrollToForm}
            className="w-full md:w-auto whitespace-nowrap bg-brand hover:bg-brand-hover text-white text-sm font-bold px-6 py-3.5 rounded-xl shadow-md transition-all cursor-pointer flex-shrink-0"
          >
            Beräkna ditt fasta pris →
          </button>
        </div>

      </div>
    </section>
  );
}

