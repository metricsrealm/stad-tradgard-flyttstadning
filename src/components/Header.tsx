import { Phone } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAFAF8] border-b border-gray-200/60 shadow-xs transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-18 flex items-center justify-between">
        {/* Left Side: Logo */}
        <div className="flex-shrink-0 flex items-center">
          <img
            src="https://stadochtradgard.se/wp-content/uploads/2023/02/IMG_2579-e1715026825546-2048x431.png"
            alt="Städ & Trädgårdsservice"
            className="h-8 md:h-10 w-auto object-contain"
            id="header-logo"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Right Side: Simple Phone Call CTA */}
        <div className="flex items-center gap-3">
          <a
            href="tel:0101753040"
            className="inline-flex items-center justify-center bg-brand hover:bg-brand-hover text-white text-sm md:text-base font-semibold px-4 py-2.5 md:py-3 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-98 transition-all duration-300 ease-out group min-h-[48px]"
            id="header-phone-btn"
          >
            <Phone className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300 ease-out" />
            <span>010-175 30 40</span>
          </a>
        </div>
      </div>
    </header>
  );
}
