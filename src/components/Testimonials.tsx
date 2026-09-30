import { Star } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      initials: "JS",
      avatarBg: "#EC4C44",
      name: "John Svensson",
      meta: "Local Guide · 3 recensioner",
      stars: 5,
      date: "för ett år sedan",
      text: "Har använt detta företag ett flertal gånger för flyttstäd och det har alltid varit grym service och städ. Kan varmt rekommendera!",
      service: "Flyttstädning"
    },
    {
      initials: "JB",
      avatarBg: "#1D6FA6",
      name: "Julia Backman",
      meta: "Local Guide · 3 recensioner",
      stars: 5,
      date: "för 6 år sedan",
      text: "Behövde hjälp med både flyttstäd och fönsterputs — wow vilket resultat! Personalen var super trevliga och utförde jobbet snabbt och smidigt. Super nöjd och kommer definitivt anlita dem igen! Super bra priser också!",
      service: "Flyttstädning · Fönsterputs"
    },
    {
      initials: "JK",
      avatarBg: "#16A34A",
      name: "Jennie Karlsson",
      meta: "Local Guide · 2 recensioner",
      stars: 5,
      date: "för 3 år sedan",
      text: "Anlitade företaget för fönsterputs — noggranna och gav ett professionellt intryck, supernöjd med resultatet. Trevlig personal och lätt att komma i kontakt med dem. Rekommenderar dem varmt.",
      service: "Fönsterputs"
    },
    {
      initials: "LA",
      avatarBg: "#7C3AED",
      name: "Lukas Andersson",
      meta: "Local Guide · 5 recensioner",
      stars: 5,
      date: "för 6 år sedan",
      text: "Använde mig av Städ & Trädgårdsservice inför släktkalas. Var ute i sista sekund men de anpassade sig och kom på helgen för min skull! Jobbet blev gjort snyggt och proffsigt!",
      service: "Hemstädning · Helgbokning"
    }
  ];

  const googleLogo = (
    <svg viewBox="0 0 24 24" width="16" height="16" className="inline-block">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );

  return (
    <section className="py-12 md:py-16 bg-slate-50 border-b border-gray-200/80" id="testimonials-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-[560px] mx-auto mb-6 reveal-on-scroll">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1C2833] tracking-tight font-display mb-2">
            Vad våra kunder säger
          </h2>
          <p className="text-xs sm:text-sm text-[#5D6D7E] text-center leading-relaxed">
            Omdömen från verifierade Google-recensioner.
          </p>
        </div>

        {/* Google Rating Summary Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 max-w-md mx-auto reveal-on-scroll delay-100" id="rating-summary-bar">
          <div className="text-[48px] font-extrabold text-[#1C2833] leading-none font-display">
            4.8
          </div>
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex gap-0.5 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-[#FBBC04] fill-[#FBBC04]" />
              ))}
            </div>
            <div className="text-xs text-[#5D6D7E] font-medium">
              Baserat på 29 Google-omdömen
            </div>
            <a
              href="https://maps.app.goo.gl/MJpJGKZWUqxDnRWL7"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 mt-0.5 text-[11px] text-[#7F8C8D] hover:text-[#4285F4] transition-colors"
            >
              {googleLogo}
              <span className="hover:underline">Verifierade Google-omdömen</span>
            </a>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-10" id="testimonials-grid">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className={`bg-white border border-[#E5E7EB] rounded-[12px] p-[16px] card-hover-lift flex flex-col justify-between reveal-on-scroll ${
                idx === 1 ? 'delay-100' : idx === 2 ? 'delay-200' : idx === 3 ? 'delay-300' : ''
              }`}
              id={`review-card-${idx}`}
            >
              <div>
                {/* Reviewer Row */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white font-bold text-[14px]"
                    style={{ backgroundColor: r.avatarBg }}
                  >
                    {r.initials}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 leading-tight">{r.name}</h4>
                    <span className="text-[11px] text-[#7F8C8D] block">{r.meta}</span>
                  </div>
                </div>

                {/* Stars + Date */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-0.5">
                    {[...Array(r.stars)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-[#FBBC04] fill-[#FBBC04]" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#7F8C8D]">{r.date}</span>
                </div>

                {/* Review text */}
                <p className="text-[13px] text-gray-700 leading-[1.6] font-normal mb-4">
                  &ldquo;{r.text}&rdquo;
                </p>
              </div>

              {/* Service tag + Google Badge */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
                <span className="bg-[#FFF5F4] border border-[#FECACA] text-[#EC4C44] text-[10px] font-semibold py-0.5 px-[8px] rounded-[10px]">
                  {r.service}
                </span>
                <a
                  href="https://maps.app.goo.gl/MJpJGKZWUqxDnRWL7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] text-[#7F8C8D] hover:text-[#4285F4] transition-colors"
                >
                  {googleLogo}
                  <span>Omdöme via Google</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* View on Google Maps Button */}
        <div className="text-center mt-[20px]">
          <a
            href="https://maps.app.goo.gl/MJpJGKZWUqxDnRWL7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white border-[1.5px] border-[#E5E7EB] rounded-[8px] px-[22px] py-[10px] text-[13px] font-semibold text-[#374151] cursor-pointer hover:border-[#4285F4] hover:shadow-xs hover:-translate-y-0.5 transition-all duration-300 ease-out"
            id="view-google-reviews-btn"
          >
            {googleLogo}
            <span>Se alla omdömen på Google Maps</span>
          </a>
        </div>

      </div>
    </section>
  );
}
