interface FooterProps {
  onPrivacyClick?: () => void;
}

export default function Footer({ onPrivacyClick }: FooterProps) {
  return (
    <footer className="w-full bg-[#1A1A1A] text-gray-400 py-12 border-t border-gray-800" id="footer-landing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start border-b border-gray-800 pb-8">
          {/* Left Column: Corporate profile */}
          <div>
            <h3 className="text-white text-lg font-bold font-display mb-3">Städ & Trädgårdsservice AB</h3>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed mb-4">
              Professionell städservice och trygg hemstädning sedan 1998. Vi levererar förstklassig omsorg för ditt hem med full ansvarsförsäkring och nöjd-kund-garanti.
            </p>
            <div className="text-xs text-gray-500 font-mono">
              Org.nr: 559139-4704 | Godkänd för F-skatt
            </div>
          </div>

          {/* Right Column: Key NAP coordinates */}
          <div className="space-y-3 text-sm">
            <h4 className="text-white font-bold tracking-tight uppercase text-xs text-gray-550 mb-1">Kontaktuppgifter</h4>

            <p className="flex items-center gap-2">
              <span className="text-gray-500 font-medium">Telefon:</span>
              <a
                href="tel:0101753040"
                className="text-white font-bold hover:text-brand underline decoration-brand/50 decoration-1 hover:decoration-brand duration-150"
              >
                010-175 30 40
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-gray-500 font-medium">E-post:</span>
              <a
                href="mailto:info@stadochtradgard.se"
                className="text-gray-200 hover:text-brand underline decoration-gray-700 decoration-1 hover:decoration-brand duration-150"
              >
                info@stadochtradgard.se
              </a>
            </p>
          </div>
        </div>

        {/* Legal bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Städ & Trädgårdsservice AB. Alla rättigheter reserverade.</p>
          <div className="flex gap-4">
            <button
              onClick={onPrivacyClick}
              className="hover:text-white underline cursor-pointer bg-transparent border-none text-left"
            >
              Integritetspolicy (GDPR)
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
