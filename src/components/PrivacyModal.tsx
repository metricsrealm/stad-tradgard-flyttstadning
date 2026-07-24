import { X, ShieldAlert } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Overlay background */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-xs transition-opacity duration-200"
      ></div>

      {/* Modal Card Content */}
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative z-10 border border-gray-200 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Stäng"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-6">
          <ShieldAlert className="w-6 h-6 text-brand" />
          <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight font-display">
            Integritetspolicy & GDPR
          </h2>
        </div>

        <div className="space-y-4 text-sm text-gray-600 overflow-y-auto max-h-[60vh] pr-2 leading-relaxed">
          <p>
            Städ & Trädgårdsservice AB värnar om din personliga integritet och att alltid skydda dina personuppgifter på säkrast möjliga sätt. Denna policy beskriver hur vi samlar in, lagrar, skyddar och använder information som du skickar till oss via vår priskalkylator och våra Google Ads-kampanjer.
          </p>

          <h3 className="font-bold text-gray-800 text-base">1. Vilka uppgifter sparar vi?</h3>
          <p>
            Vid ifyllnad av vårt prisformulär sparas följande information: namn, telefonnummer, e-postadress, önskat städort, bostadstyp, bostadsstorlek (kvm) samt eventuella medskickade spårningsparametrar (inklusive gclid/fbclid/utm-kampanjer för att mäta annonseffekter).
          </p>

          <h3 className="font-bold text-gray-800 text-base">2. Syfte med databehandlingen</h3>
          <p>
            Vi behandlar dina uppgifter för att:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Skapa och förse dig med en personlig, rättvis prisuppskattning på hemstädning.</li>
            <li>Kontakta dig via telefon eller e-post för att bekräfta bokningsdetaljer.</li>
            <li>Optimera våra annonskampanjer hos Google Ads och förhindra ogiltiga klick.</li>
          </ul>

          <h3 className="font-bold text-gray-800 text-base">3. Lagringstid och säkerhet</h3>
          <p>
            Dina inskickade personuppgifter sparas krypterat på våra säkra servrar. Uppgifter som inte leder till en bokad eller återkommande städtjänst raderas automatiskt från våra aktiva listor efter 30 dagar. Vi säljer eller delar aldrig dina personuppgifter med tredjepartstjänster.
          </p>

          <h3 className="font-bold text-gray-800 text-base">4. Dina rättigheter</h3>
          <p>
            Du har enligt GDPR rätt att kostnadsfritt begära utdrag, korrigering eller fullständig borttagning av alla personuppgifter vi har sparade om dig. För att utöva dina rättigheter kontaktar du oss enkelt via e-post på <a href="mailto:info@stadochtradgard.se" className="text-brand underline">info@stadochtradgard.se</a> eller ringer oss på 010-175 30 40.
          </p>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-brand hover:bg-brand-hover text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            Jag förstår & godkänner
          </button>
        </div>
      </div>
    </div>
  );
}
