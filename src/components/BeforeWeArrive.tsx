import { Check, Info } from 'lucide-react';

export default function BeforeWeArrive() {
  const prepSteps = [
    {
      title: "Töm bostaden helt",
      desc: "Bostaden ska vara helt tömd på möbler, kartonger och personliga tillhörigheter innan vi påbörjar städningen."
    },
    {
      title: "Frosta av kyl & frys",
      desc: "Stäng av och frosta av kyl och frys i förväg om de ska städas inuti, så att vi kan rengöra dem noggrant."
    },
    {
      title: "El & varmvatten i drift",
      desc: "Se till att el och varmvatten är igång i bostaden så att våra städare har belysning och varmt rengöringsvatten."
    },
    {
      title: "Nyckelöverlämning",
      desc: "Lämna över nycklar i förväg enligt överenskommelse (t.ex. nyckelgömma, godkänd kod eller personlig överlämning)."
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-white border-b border-gray-200/80" id="before-we-arrive-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-[580px] mx-auto mb-9">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 font-bold text-[11px] px-3 py-1 rounded-full border border-blue-100 mb-2.5">
            <Info className="w-3.5 h-3.5" />
            <span>Inför städdagen</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1C2833] font-display">
            Vad behöver jag göra innan städningen?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">
            Enkla förberedelser så att vi kan utföra städningen smidigt.
          </p>
        </div>

        {/* Prep Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {prepSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-5 hover:shadow-sm transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm mb-3">
                <Check className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2 font-display">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
