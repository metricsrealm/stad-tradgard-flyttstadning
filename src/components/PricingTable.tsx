import { useState } from 'react';
import { FLYTT_PRICE_TABLE } from '../data/pricing';
import { CheckCircle2, Info, Phone, ArrowUpRight } from 'lucide-react';

interface PricingTableProps {
  onSelectSqm?: (sqm: number) => void;
  onScrollToForm?: () => void;
}

export default function PricingTable({ onSelectSqm, onScrollToForm }: PricingTableProps) {
  const [showDodsboView, setShowDodsboView] = useState<boolean>(false);

  const handleRowClick = (maxSqm: number) => {
    if (onSelectSqm) onSelectSqm(maxSqm);
    if (onScrollToForm) onScrollToForm();
  };

  return (
    <section className="py-14 md:py-20 bg-white border-b border-gray-200/80" id="prislista-section">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-red-50 text-brand text-xs font-bold px-3 py-1 rounded-full border border-red-100 uppercase tracking-wider">
            Fast pris &middot; Inga dolda avgifter
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight font-display">
            Prislista för flyttstädning
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Se våra fasta priser per bostadsyta. Du som privatperson betalar alltid priset i mittenkolumnen{' '}
            <strong className="text-brand font-bold">(efter 50% RUT-avdrag)</strong>.
          </p>
        </div>

        {/* Informative notice card explaining RUT & Dödsbo rules */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 md:p-6 mb-8 space-y-3 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl flex-shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-900">
                Hur fungerar RUT-avdraget?
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Staten betalar <strong>50% av arbetskostnaden</strong> direkt till oss via Skatteverket. Du som kund betalar endast priset efter RUT-avdrag (mittenkolumnen) och avdraget administreras automatiskt på din faktura.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200/70 flex items-start gap-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl flex-shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-gray-900">
                Viktig regel vid städning av dödsbo
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Enligt Skatteverkets regler kan RUT-avdrag <strong>endast nyttjas av levande personer</strong>. Om städningen avser en person som avlidit (dödsbo) kan RUT-avdraget inte användas. I så fall gäller ordinarie pris i kolumnen <em>Innan RUT-avdrag</em>.
              </p>
            </div>
          </div>
        </div>

        {/* View mode toggle (Privatperson efter RUT vs Dödsbo innan RUT) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <span className="text-xs sm:text-sm font-semibold text-gray-700">
            Klicka på en rad för att räkna ut och boka i kalkylatorn:
          </span>
          <div className="inline-flex rounded-xl p-1 bg-gray-100 border border-gray-200">
            <button
              type="button"
              onClick={() => setShowDodsboView(false)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                !showDodsboView
                  ? 'bg-white text-brand shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Privatperson (Efter 50% RUT)
            </button>
            <button
              type="button"
              onClick={() => setShowDodsboView(true)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                showDodsboView
                  ? 'bg-white text-brand shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dödsbo (Innan RUT)
            </button>
          </div>
        </div>

        {/* Pricing Table Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/90 text-xs font-extrabold text-gray-700 tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Bostadsyta (KVM)</th>
                  <th className={`py-3.5 px-4 sm:px-6 ${!showDodsboView ? 'bg-red-50/80 text-brand font-black' : ''}`}>
                    <div className="flex items-center gap-1.5">
                      <span>Pris efter RUT-avdrag</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-sm uppercase">
                        Kundpris
                      </span>
                    </div>
                  </th>
                  <th className={`py-3.5 px-4 sm:px-6 ${showDodsboView ? 'bg-amber-50/80 text-amber-900 font-black' : 'text-gray-500 font-semibold'}`}>
                    <div className="flex items-center gap-1.5">
                      <span>Innan RUT-avdrag</span>
                      {showDodsboView && (
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded-sm uppercase">
                          Dödsbo
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="py-3.5 px-4 sm:px-6 text-right hidden sm:table-cell">Val</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {FLYTT_PRICE_TABLE.map((tier, idx) => {
                  return (
                    <tr
                      key={idx}
                      onClick={() => handleRowClick(tier.maxSqm)}
                      className="hover:bg-red-50/30 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 sm:px-6 font-bold text-gray-900">
                        {tier.kvmLabel} kvm
                      </td>
                      <td className={`py-3 px-4 sm:px-6 font-bold ${!showDodsboView ? 'text-brand font-black text-base' : 'text-gray-800'}`}>
                        {tier.priceAfterRUT.toLocaleString('sv-SE')} kr
                      </td>
                      <td className={`py-3 px-4 sm:px-6 ${showDodsboView ? 'text-brand font-black text-base' : 'text-gray-500 font-medium'}`}>
                        {tier.priceBeforeRUT.toLocaleString('sv-SE')} kr
                      </td>
                      <td className="py-3 px-4 sm:px-6 text-right hidden sm:table-cell">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-400 group-hover:text-brand transition-colors">
                          <span>Välj</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {/* Over 200 sqm row */}
                <tr
                  onClick={() => handleRowClick(220)}
                  className="bg-amber-50/50 hover:bg-amber-50 transition-colors cursor-pointer border-t-2 border-amber-200 group"
                >
                  <td className="py-3.5 px-4 sm:px-6 font-black text-amber-950">
                    Över 200 kvm
                  </td>
                  <td colSpan={2} className="py-3.5 px-4 sm:px-6 font-black text-amber-900">
                    <div className="flex items-center gap-2">
                      <span>Kontakta oss för pris (offert vid förfrågan)</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-right hidden sm:table-cell">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 group-hover:text-amber-950">
                      <span>Offert</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer note in table */}
          <div className="p-4 bg-gray-50/90 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Samtliga priser inkluderar moms, fönsterputs och 100% besiktningsgaranti.</span>
            </div>
            {onScrollToForm && (
              <button
                type="button"
                onClick={onScrollToForm}
                className="text-brand font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Öppna kalkylatorn</span>
                <span>↑</span>
              </button>
            )}
          </div>
        </div>

        {/* Contact banner for > 200 sqm */}
        <div className="mt-6 bg-gradient-to-r from-red-50 via-white to-red-50 border border-red-100 rounded-2xl p-5 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-gray-900">
              Har du en bostad större än 200 kvm?
            </h4>
            <p className="text-xs text-gray-600 mt-0.5">
              Vi skräddarsyr en offert med förmånligt fast pris efter 50% RUT-avdrag.
            </p>
          </div>
          <a
            href="tel:0101753040"
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors flex-shrink-0"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Ring 010-175 30 40</span>
          </a>
        </div>

      </div>
    </section>
  );
}
