import { Phone, ArrowUpCircle, Info } from 'lucide-react';

interface BottomCTAProps {
  onScrollToForm: () => void;
}

export default function BottomCTA({ onScrollToForm }: BottomCTAProps) {
  return (
    <section className="relative py-20 px-4 md:py-28 overflow-hidden text-white" id="bottom-cta-banner">
      {/* Background Image Container */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1600&q=80')`
        }}
      ></div>

      {/* Dark overlay with exact 42% opacity */}
      <div className="absolute inset-0 z-10 bg-gray-950/42"></div>

      {/* Content wrapper */}
      <div className="max-w-4xl mx-auto text-center relative z-20">

        <h2 className="text-3xl md:text-5xl font-black tracking-tight font-display mb-4">
          Redo för en smidig & godkänd flyttstädning?
        </h2>
        
        <p className="text-base md:text-xl text-gray-200 font-medium max-w-2xl mx-auto mb-8">
          Få ditt fasta pris på 60 sekunder &mdash; med 100% besiktningsgaranti.
        </p>

        {/* Action Button Set */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
          <button
            onClick={onScrollToForm}
            className="w-full sm:w-auto bg-brand hover:bg-brand-hover text-white text-base md:text-lg font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-2xl transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 group min-h-[48px]"
          >
            <span>Beräkna mitt fasta pris</span>
            <ArrowUpCircle className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          <a
            href="tel:0101753040"
            className="w-full sm:w-auto bg-transparent border-[1.5px] border-white/55 hover:bg-white/10 text-white text-base md:text-lg font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-2xl transition-all duration-150 flex items-center justify-center gap-2 min-h-[48px]"
          >
            <Phone className="w-5 h-5 text-white" />
            <span>Ring: 010-175 30 40</span>
          </a>
        </div>

        {/* Reassurance Ticks */}
        <div className="flex items-center justify-center gap-4 text-xs md:text-sm font-semibold text-gray-200 mb-8 flex-wrap">
          <span>✔ Fast pris</span>
          <span>✔ 100% Besiktningsgaranti</span>
          <span>✔ Sedan 1998</span>
        </div>

        {/* Dynamic trust configurations */}
        <div className="border-t border-white/20 pt-6 max-w-xl mx-auto text-[13px] text-white font-bold tracking-wide uppercase flex justify-center items-center gap-3 md:gap-4 flex-wrap">
          <span>Besiktningsgaranti</span>
          <span className="opacity-40">&middot;</span>
          <span>Erfarna sedan 1998</span>
          <span className="opacity-40">&middot;</span>
          <span>RUT 50%</span>
        </div>


      </div>
    </section>
  );
}
