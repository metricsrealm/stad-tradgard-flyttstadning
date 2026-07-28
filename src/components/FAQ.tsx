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
      question: "Erbjuder ni nöjd-kund-garanti?",
      answer: "Ja, vi erbjuder nöjd-kund-garanti på all flyttstädning. Om något inte är godkänt åtgärdar vi det kostnadsfritt."
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
    <section className="py-12 md:py-16 bg-slate-50 border-b border-gray-200/80" id="faq-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-[560px] mx-auto mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C2833] font-display">
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
