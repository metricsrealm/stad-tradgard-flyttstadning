import { ShieldCheck, ReceiptText, UserCheck, Award } from 'lucide-react';

export default function Benefits() {
  const benefits = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-brand" />,
      title: "100% Besiktningsgaranti",
      desc: "Full besiktningsgaranti godkänd av hyresvärd och mäklare. Om något mot förmodan anmärks åtgärdar vi det kostnadsfritt."
    },
    {
      icon: <ReceiptText className="w-5 h-5 text-brand" />,
      title: "RUT-avdrag direkt (50%)",
      desc: "Vi drar av RUT på 50% direkt på din faktura och tar hand om all rapportering till Skatteverket."
    },
    {
      icon: <UserCheck className="w-5 h-5 text-brand" />,
      title: "Fönsterputs & ugn ingår",
      desc: "Inga dolda tillägg. Fönsterputsning (in- och utsida), rengöring av ugn, kyl, frysar och köksfläkt ingår i det fasta priset."
    },
    {
      icon: <Award className="w-5 h-5 text-brand" />,
      title: "Erfarna sedan 1998",
      desc: "Med över 25 års erfarenhet av flyttstädningar garanterar vi beprövade rutiner och ett garanterat godkänt resultat."
    }
  ];

  return (
    <section className="py-20 bg-slate-50/50 relative overflow-hidden" id="benefits-section">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        {/* Subtle decorative background pattern */}
        <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-brand/30 filter blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-emerald-500/20 filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-[560px] mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1C2833] font-display">
            Våra trygga fördelar vid flyttstädning
          </h2>
          <p className="mt-4 text-[16px] text-[#5D6D7E] text-center">
            Hos oss får du inte bara ett skinande rent resultat vid utflytt, utan också marknadens tryggaste upplägg med godkänd besiktningsgaranti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              className="bg-white p-6 md:p-8 rounded-[12px] border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center mb-6 transition-transform">
                {b.icon}
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#1C2833] mb-2 font-display">{b.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
