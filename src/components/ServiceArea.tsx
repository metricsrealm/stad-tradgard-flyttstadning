import { MapPin, Phone } from 'lucide-react';

interface ServiceAreaProps {
  currentCityName?: string;
}

export default function ServiceArea({ currentCityName }: ServiceAreaProps) {
  // Let's divide these based on areas
  const fallbackCities = [
    "Borås", "Värnamo", "Gnosjö", "Gislaved", "Anderstorp", "Hestra", 
    "Hillerstorp", "Kulltorp", "Forsheda"
  ];

  return (
    <section className="py-12 md:py-16 bg-white border-b border-gray-200/80" id="service-area-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-[560px] mx-auto mb-8">
          <div className="inline-flex p-2.5 bg-red-50 rounded-full mb-2.5 border border-red-100">
            <MapPin className="w-5 h-5 text-brand" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C2833] font-display mb-2">
            Vi utför städning i {currentCityName ? currentCityName : "din region"}
          </h2>
          <p className="text-xs sm:text-sm text-[#5D6D7E] text-center">
            Vi utför flyttstädning i Borås, Värnamo, Gnosjö och omkringliggande områden.
          </p>
        </div>

        {/* Cities Grid of badges */}
        <div className="max-w-4xl mx-auto mt-6" id="service-area-pills">
          <div className="flex flex-wrap justify-center gap-3">
            {fallbackCities.map((city, idx) => {
              const isActive = currentCityName && city.toLowerCase().includes(currentCityName.toLowerCase());
              return (
                <div
                  key={idx}
                  className={`h-8 px-4 text-[13px] font-semibold rounded-[16px] border transition-all duration-200 flex items-center justify-center ${
                    isActive
                      ? "bg-brand/10 text-brand border-brand scale-103 font-bold"
                      : "bg-gray-50 text-gray-700 border-[#D5D8DC] hover:border-brand/40"
                  }`}
                >
                  {city}
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-10 max-w-md mx-auto pt-4 border-t border-gray-200/60">
          <p className="text-base md:text-lg font-bold text-gray-800 mb-3">
            Tveksam om vi täcker ditt specifika område?
          </p>
          <a
            href="tel:0101753040"
            className="inline-flex items-center justify-center gap-3 px-6 py-4.5 bg-brand/5 hover:bg-brand/10 text-brand border-2 border-brand/20 hover:border-brand/45 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(236,76,68,0.12)] active:scale-[0.98] group"
          >
            <Phone className="w-5 h-5 text-brand group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-extrabold text-[#EC4C44] tracking-tight text-sm md:text-[15px]">
              Ring och fråga oss direkt: 010-175 30 40
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
