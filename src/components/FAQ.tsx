import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FAQItem } from '../types';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Vad ingår i flyttstädningen?",
      answer: "En komplett flyttstädning omfattar grundlig rengöring av alla rum, inklusive fönsterputsning, rengöring bakom spisar och kylskåp, avtorkning av fast inredning samt städning av badrum och kök in i minsta detalj. Vi städar efter en noggrann checklista godkänd av hyresvärdar och mäklare."
    },
    {
      question: "Erbjuder ni nöjd-kund-garanti?",
      answer: "Ja, vi erbjuder alltid en generös nöjd-kund-garanti på vår flyttstädning. Det innebär att vi garanterar att städningen blir godkänd vid besiktningen, och skulle det mot förmodan finnas några anmärkningar åtgärdar vi dem kostnadsfritt inom kortast möjliga tid."
    },
    {
      question: "Hur lång tid tar en flyttstädning?",
      answer: "Det beror helt på bostadens storlek och skick. Vanligtvis tar en mindre lägenhet ca 4–6 timmar, medan en större villa kan ta en hel dag för vårt städteam att slutföra. Vi arbetar alltid effektivt för att säkerställa högsta kvalitet."
    },
    {
      question: "Kan jag boka flyttstädning med kort varsel?",
      answer: "Ja, vi gör alltid vårt yttersta för att tillgodose akuta bokningar, särskilt i slutet och början av månaden. Kontakta oss så snart som möjligt, så ser vi till att hitta en tid som passar ditt flyttschema."
    },
    {
      question: "Ingår fönsterputsning i priset?",
      answer: "Ja, fönsterputsning ingår alltid kostnadsfritt i vår flyttstädning. Vi putsar dina fönster på alla sidor för att säkerställa att hela bostaden är redo för nästa hyresgäst eller köpare."
    },
    {
      question: "Vad händer om hyresvärden eller mäklaren inte godkänner städningen vid besiktning?",
      answer: "Om hyresvärden eller köparen har några anmärkningar vid besiktningen kontaktar du oss direkt. Vi skickar omgående tillbaka vårt team för att åtgärda eventuella brister helt utan extra kostnad under vår nöjd-kund-garanti."
    },
    {
      question: "Hur fungerar RUT-avdraget vid flyttstädning?",
      answer: "RUT-avdraget ger dig 50% rabatt på arbetskostnaden för flyttstädningen. Vi drar av rabatten direkt på fakturan och sköter all administration och rapportering till Skatteverket, så att du bara betalar hälften av priset."
    }
  ];

  const handleToggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-[#FAFAF8] border-b border-gray-200" id="faq-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-[560px] mx-auto mb-12">
          <h2 className="text-[30px] font-bold tracking-tight text-[#1C2833] font-display">
            Vanliga frågor och svar
          </h2>
          <p className="mt-4 text-[16px] text-[#5D6D7E] text-center">
            Här har vi samlat de vanligaste frågorna våra kunder brukar ha. Hittar du inte svaret du söker är du varmt välkommen att ringa oss.
          </p>
        </div>

        <div className="space-y-4" id="faq-accordions">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-[12px] border border-gray-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => handleToggle(idx)}
                  className="w-full text-left px-5 py-5 md:px-6 md:py-6 flex items-center justify-between gap-4 font-bold text-gray-900 hover:text-brand transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-base md:text-lg font-display text-[#1C2833] leading-tight">
                    {faq.question}
                  </span>
                  <div className={`p-1.5 rounded-full bg-gray-50 flex-shrink-0 text-[#EC4C44] transition-transform duration-250 ${isOpen ? 'rotate-180 bg-red-50' : ''}`}>
                    <ChevronDown className="w-[18px] h-[18px]" />
                  </div>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-72 border-t border-gray-100' : 'max-h-0'
                  } overflow-hidden`}
                >
                  <div className="p-5 md:p-6 text-sm md:text-base text-gray-650 leading-relaxed bg-[#FAFAF8]/40">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
