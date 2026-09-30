import { useState } from 'react';
import { 
  ChevronDown, 
  ShieldCheck, 
  Check, 
  Maximize2, 
  Minimize2 
} from 'lucide-react';

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
  introText?: string;
  subsections?: ServiceSubSection[];
  items?: string[];
}

export default function WhatsIncluded({ onScrollToForm }: WhatsIncludedProps) {
  // Accordion open states
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    kitchen: false,
    bathroom: false,
    livingRoom: false,
    entireHome: false,
    additionalServices: false,
    beforeWeArrive: false,
    goodToKnow: false,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const allMainOpen = ['kitchen', 'entireHome', 'bathroom', 'additionalServices', 'livingRoom'].every(id => openItems[id]);

  const toggleAllMain = () => {
    const nextState = !allMainOpen;
    setOpenItems(prev => ({
      ...prev,
      kitchen: nextState,
      entireHome: nextState,
      bathroom: nextState,
      additionalServices: nextState,
      livingRoom: nextState,
    }));
  };

  const kitchenItem: ServiceAccordionItem = {
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
  };

  const entireHomeItem: ServiceAccordionItem = {
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
  };

  const bathroomItem: ServiceAccordionItem = {
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
  };

  const additionalServicesItem: ServiceAccordionItem = {
    id: 'additionalServices',
    title: 'Tilläggstjänster',
    introText: 'Vi kan också hjälpa dig med:',
    items: [
      'Städning av biytor som t.ex. förråd, garage och balkonger.',
      'Fönsterputsning av inglasade balkonger (endast glasräcke och helt inglasad).'
    ]
  };

  const livingRoomItem: ServiceAccordionItem = {
    id: 'livingRoom',
    title: 'Allrum och sovrum',
    items: [
      'Dammtorkning av golvlister.',
      'Våttorkning av samtliga golv.',
      'Dammsugning av heltäckningsmattor.'
    ]
  };

  const beforeWeArriveItem: ServiceAccordionItem = {
    id: 'beforeWeArrive',
    title: 'Detta behöver du göra innan vi kommer',
    introText: 'För att vi ska kunna utföra flyttstädningen behöver du:',
    items: [
      'Tömma bostaden på möbler och personliga tillhörigheter.',
      'Avfrosta och tömma kyl och frys.',
      'Dra fram spis samt kyl/frys om städning bakom önskas.',
      'Ta bort badkarsfront/skyddsplåt om städning under badkaret önskas.',
      'Se till att el, vatten och fungerande belysning finns tillgängligt under hela städtillfället.'
    ]
  };

  const goodToKnowItem: ServiceAccordionItem = {
    id: 'goodToKnow',
    title: 'Bra att veta',
    items: [
      'Persienner ingår inte i flyttstädningen.',
      'Demontering och rengöring av vattenlås ingår inte.',
      'Klistermärken och dekaler tas inte bort.',
      'Målade och tapetserade väggar tvättas inte.',
      'Fönster som inte går att öppna med normal handkraft putsas inte.'
    ]
  };

  const renderServiceCard = (item: ServiceAccordionItem) => {
    const isOpen = !!openItems[item.id];

    return (
      <div 
        key={item.id}
        className={`rounded-xl transition-all duration-300 ease-out overflow-hidden w-full ${
          isOpen 
            ? 'bg-white border border-red-200 shadow-xs' 
            : 'bg-white border border-gray-200/90 hover:border-gray-300'
        }`}
      >
        <button
          onClick={() => toggleItem(item.id)}
          className="w-full flex items-center justify-between px-4 py-3.5 sm:px-5 sm:py-4 text-left cursor-pointer transition-colors group"
          aria-expanded={isOpen}
        >
          <span className={`font-bold text-sm sm:text-base font-display tracking-tight transition-colors whitespace-nowrap overflow-hidden text-ellipsis ${
            isOpen ? 'text-brand' : 'text-gray-900 group-hover:text-brand'
          }`}>
            {item.title}
          </span>

          <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0 ml-3 ${
            isOpen ? 'bg-red-50 text-brand rotate-180' : 'bg-gray-100 text-gray-500 group-hover:bg-red-50 group-hover:text-brand'
          }`}>
            <ChevronDown className="w-4 h-4" />
          </div>
        </button>

        <div 
          className={`grid transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t border-gray-100 bg-[#fffdfd]">
              {item.introText && (
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-3 pt-1">
                  {item.introText}
                </p>
              )}

              {item.subsections ? (
                <div className="space-y-3 pt-1">
                  {item.subsections.map((sub, sIdx) => (
                    <div key={sIdx} className="space-y-1.5">
                      <h4 className="font-bold text-gray-900 text-xs sm:text-sm uppercase tracking-wide flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0"></span>
                        <span>{sub.title}</span>
                      </h4>
                      <ul className="space-y-1.5 pl-3">
                        {sub.items.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 leading-relaxed">
                            <Check className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-2 pt-1">
                  {item.items?.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 leading-relaxed">
                      <div className="w-4 h-4 rounded-full bg-red-50 text-brand flex items-center justify-center shrink-0 mt-0.5 border border-red-200/70">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInfoCard = (item: ServiceAccordionItem) => {
    const isOpen = openItems[item.id] !== undefined ? openItems[item.id] : true;

    return (
      <div 
        key={item.id}
        className={`rounded-xl transition-all duration-300 ease-out overflow-hidden w-full ${
          isOpen 
            ? 'bg-white border border-red-200 shadow-xs' 
            : 'bg-white border border-gray-200/90 hover:border-gray-300'
        }`}
      >
        <button
          onClick={() => toggleItem(item.id)}
          className="w-full flex items-center justify-between px-4 py-3.5 sm:px-5 sm:py-4 text-left cursor-pointer transition-colors group"
          aria-expanded={isOpen}
        >
          <span className={`font-bold text-sm sm:text-base font-display tracking-tight transition-colors whitespace-nowrap overflow-hidden text-ellipsis ${
            isOpen ? 'text-brand' : 'text-gray-900 group-hover:text-brand'
          }`}>
            {item.title}
          </span>

          <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0 ml-3 ${
            isOpen ? 'bg-red-50 text-brand rotate-180' : 'bg-gray-100 text-gray-500 group-hover:bg-red-50 group-hover:text-brand'
          }`}>
            <ChevronDown className="w-4 h-4" />
          </div>
        </button>

        <div 
          className={`grid transition-[grid-template-rows,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t border-gray-100 bg-[#fffdfd]">
              {item.introText && (
                <p className="text-xs sm:text-sm font-semibold text-gray-800 mb-3 pt-1">
                  {item.introText}
                </p>
              )}

              <ul className="space-y-2 pt-1">
                {item.items?.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 leading-relaxed">
                    <div className="w-4 h-4 rounded-full bg-red-50 text-brand flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px] border border-red-200/70">
                      {bIdx + 1}
                    </div>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-14 md:py-20 bg-[#fafafa] border-b border-gray-200/80" id="whats-included-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Title Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 md:mb-10 reveal-on-scroll">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1C2833] font-display">
              Vad ingår i vår flyttstädning?
            </h2>
          </div>

          <button
            onClick={toggleAllMain}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-brand bg-white hover:bg-gray-50 border border-gray-200 shadow-2xs px-3.5 py-2 rounded-xl transition-all duration-300 ease-out cursor-pointer shrink-0 hover:shadow-xs active:scale-98"
          >
            {allMainOpen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Stäng alla</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Öppna alla</span>
              </>
            )}
          </button>
        </div>

        {/* 2 Independent Columns so opening an accordion never stretches the other column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start mb-4 reveal-on-scroll delay-75">
          {/* Left Column */}
          <div className="space-y-4">
            {renderServiceCard(kitchenItem)}
            {renderServiceCard(bathroomItem)}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {renderServiceCard(entireHomeItem)}
            {renderServiceCard(additionalServicesItem)}
          </div>
        </div>

        {/* 5th Card centered in the middle */}
        <div className="flex justify-center mb-16 reveal-on-scroll delay-100">
          <div className="w-full md:w-[calc(50%-0.5rem)]">
            {renderServiceCard(livingRoomItem)}
          </div>
        </div>

        {/* Bra att veta inför städningen Section */}
        <div className="pt-10 border-t border-gray-200">
          <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10 reveal-on-scroll">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1C2833] font-display">
              Bra att veta inför städningen
            </h3>
          </div>

          {/* Side-by-side 2-column info cards with clean single-line headers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start reveal-on-scroll delay-75">
            {renderInfoCard(beforeWeArriveItem)}
            {renderInfoCard(goodToKnowItem)}
          </div>
        </div>
      </div>

      {/* Guarantee Banner */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-16 reveal-on-scroll">
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-50 text-brand rounded-2xl border border-red-100 flex-shrink-0">
              <ShieldCheck className="w-7 h-7 text-brand" />
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
