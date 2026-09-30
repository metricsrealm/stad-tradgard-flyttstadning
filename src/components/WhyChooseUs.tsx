import { Award, Receipt, Sparkles, ShieldAlert } from 'lucide-react';

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: <Award className="w-5 h-5 text-brand" />,
      title: "Över 25 års erfarenhet",
      desc: "Grundades 1998 och har genomfört tusentals godkända flyttstädningar med välbeprövade städrutiner."
    },
    {
      icon: <Receipt className="w-5 h-5 text-brand" />,
      title: "50% RUT-avdrag direkt",
      desc: "Du betalar endast hälften på fakturan. Vi sköter all kontakt och rapportering med Skatteverket åt dig."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-brand" />,
      title: "Egen proffsutrustning ingår",
      desc: "Vi tar med oss alla städmaskiner, städkemikalier och mikrofiberdukar. Du behöver inte tillhandahålla något."
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-brand" />,
      title: "Ansvarsförsäkrad personal",
      desc: "Vår städpersonal är kollektivavtalsansluten och helt täckt av vår ansvarsförsäkring för din trygghet."
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-slate-50 border-b border-gray-200/80" id="why-choose-us-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-[580px] mx-auto mb-9 reveal-on-scroll">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1C2833] font-display">
            Varför välja oss för din flyttstädning?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-600">
            Kombinationen av lång erfarenhet, trygga villkor och professionell utrustning.
          </p>
        </div>

        {/* 4 Reasons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
          {reasons.map((item, idx) => (
            <div
              key={idx}
              className={`bg-white border border-slate-200/90 rounded-2xl p-5 card-hover-lift flex items-start gap-4 reveal-on-scroll ${
                idx === 1 ? 'delay-75' : idx === 2 ? 'delay-150' : idx === 3 ? 'delay-200' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                {item.icon}
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1 font-display">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

