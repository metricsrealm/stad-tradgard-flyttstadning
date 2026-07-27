import { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

interface WhatsIncludedProps {
  onScrollToForm?: () => void;
}

interface ServiceSubSection {
  title: string;
  items: string[];
}

interface ServiceAccordionItem {
  id: string;
  title: string;
  subsections?: ServiceSubSection[];
  items?: string[];
}

export default function WhatsIncluded({ onScrollToForm }: WhatsIncludedProps) {
  // Accordion open states
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    kitchen: true,
    entireHome: true,
    bathroom: true,
    livingRoom: true,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const leftColumnServices: ServiceAccordionItem[] = [
    {
      id: 'kitchen',
      title: 'Kök',
      subsections: [
        {
          title: 'Spis',
          items: [
            'Rengöring av spisens ovansida.',
            'Rengöring av kokplattor och kanter.',
            'Rengöring av ugn och värmeskåp.',
            'Rengöring av galler och ugnsplåtar.',
            'Städning bakom spisen (kunden ansvarar för att dra fram och ställa tillbaka spisen).'
          ]
        },
        {
          title: 'Fläkt',
          items: [
            'Rengöring av spisfläkt.',
            'Rengöring av fläktfilter.'
          ]
        },
        {
          title: 'Kyl och frys',
          items: [
            'Rengöring invändigt, utvändigt och bakom (kunden ansvarar för att dra fram och ställa tillbaka kyl/frys).',
            'Kyl och frys ska vara avfrostade innan städningen.'
          ]
        },
        {
          title: 'Övrigt',
          items: [
            'Avtorkning av skåp invändigt och utvändigt.',
            'Rengöring av kakel och kryddhylla.',
            'Rengöring av diskbänk, vask och skärbräda.',
            'Våttorkning av golv.'
          ]
        }
      ]
    },
    {
      id: 'livingRoom',
      title: 'Allrum och sovrum',
      items: [
        'Dammtorkning av golvlister.',
        'Våttorkning av samtliga golv.',
        'Dammsugning av heltäckningsmattor.'
      ]
    }
  ];

  const rightColumnServices: ServiceAccordionItem[] = [
    {
      id: 'entireHome',
      title: 'Hela bostaden',
      items: [
        'Fönsterputs av samtliga fönsterglas, karmar och snickerier.',
        'Rengöring av dörrar, snickerier och garderober.',
        'Rengöring av element, även bakom.',
        'Torkning av skåp och garderober invändigt.',
        'Rengöring av eluttag och strömbrytare.',
        'Dammtorkning av väggar, tak och lister.',
        'Rengöring av fasta armaturer.'
      ]
    },
    {
      id: 'bathroom',
      title: 'Badrum',
      items: [
        'Rengöring av WC in- och utvändigt.',
        'Rengöring av tvättställ och synliga rör.',
        'Rengöring av badrumsskåp invändigt och utvändigt.',
        'Rensning av golvbrunn.',
        'Rengöring av dusch, blandare och duschslang.',
        'Rengöring av kakel och våtrumsväggar.',
        'Rengöring av badkar samt under badkar (kunden tar bort front/skyddsplåt).',
        'Utvändig rengöring av vitvaror samt i tvättmedelsbehållaren på tvättmaskinen.',
        'Rengöring av filtret i torktumlaren.'
      ]
    }
  ];

  const renderAccordionItem = (item: ServiceAccordionItem) => {
    const isOpen = !!openItems[item.id];

    return (
      <div key={item.id} className="border-b border-gray-200/90 py-3">
        <button
          onClick={() => toggleItem(item.id)}
          className="w-full flex items-center justify-between py-2 text-left font-bold text-[#1C2833] text-lg sm:text-xl font-display hover:text-brand transition-colors cursor-pointer"
          aria-expanded={isOpen}
        >
          <span>{item.title}</span>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-700 flex-shrink-0 transition-transform" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-700 flex-shrink-0 transition-transform" />
          )}
        </button>

        {isOpen && (
          <div className="pt-2 pb-4 text-gray-700 pl-1">
            {item.subsections ? (
              <div className="space-y-5">
                {item.subsections.map((sub, sIdx) => (
                  <div key={sIdx} className="space-y-2">
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base">
                      {sub.title}
                    </h4>
                    <ul className="space-y-2 pl-2">
                      {sub.items.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 leading-relaxed">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-700 flex-shrink-0 mt-2" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <ul className="space-y-2.5 pl-2">
                {item.items?.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 flex-shrink-0 mt-2" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-12 md:py-16 bg-white border-b border-gray-200/80" id="whats-included-section">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#1C2833] font-display">
            Vad ingår i vår flyttstädning?
          </h2>
        </div>

        {/* 2-Column Accordion Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 items-start mb-14">
          {/* Left Column */}
          <div className="space-y-1">
            {leftColumnServices.map(renderAccordionItem)}
          </div>

          {/* Right Column */}
          <div className="space-y-1">
            {rightColumnServices.map(renderAccordionItem)}
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
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


