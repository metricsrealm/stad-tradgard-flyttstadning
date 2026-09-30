import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FAQItem } from '../types';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "Vad ingår i flyttstädningen?",
      answer: "Vår flyttstädning inkluderar grundlig rengöring av alla rum, kök, badrum, fönster och förvaring. Vi ser till att bostaden är redo för besiktning."
    },
    {
      question: "Får jag någon garanti på flyttstädningen?",
      answer: "Självklart! Du får alltid fyra (4) dagars garanti på flyttstädning genom oss. Skulle något saknas åtgärdar vi det snabbt, utan extra kostnad."
    },
    {
      question: "Hur lång tid tar en flyttstädning?",
      answer: "Tiden varierar beroende på bostadens storlek, men en genomsnittlig lägenhet tar oss vanligtvis en arbetsdag att städa."
    },
    {
      question: "Kan jag boka flyttstädning med kort varsel?",
      answer: "Vi gör vårt bästa för att tillgodose akuta bokningar. Kontakta oss så snart som möjligt så hittar vi en lösning som passar dig."
    }
  ];

  const handleToggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-12 md:py-16 bg-[#F8FAFC] border-b border-gray-200/80" id="faq-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-[560px] mx-auto mb-8 reveal-on-scroll">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1C2833] font-display">
            Vanliga frågor och svar
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#5D6D7E] text-center">
            Här hittar du svar på de vanligaste frågorna inför din bokning.
          </p>
        </div>

        <div className="space-y-4" id="faq-accordions">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 reveal-on-scroll ${
                  idx === 1 ? 'delay-75' : idx === 2 ? 'delay-150' : idx === 3 ? 'delay-200' : ''
                }`}
              >
                <button
                  onClick={() => handleToggle(idx)}
                  className="w-full text-left px-6 py-5 md:px-7 md:py-5 flex items-center justify-between gap-4 font-bold text-gray-900 hover:text-brand transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold font-display text-[#1C2833] leading-tight">
                    {faq.question}
                  </span>
                  <div className={`p-2 rounded-full bg-red-50/80 flex-shrink-0 text-[#EC4C44] transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? 'rotate-180 bg-red-100' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 py-5 md:px-7 md:py-6 text-sm md:text-base text-gray-600 leading-relaxed bg-white border-t border-gray-100">
                      {faq.answer}
                    </div>
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

