import { Star, Calendar, ShieldCheck, Percent } from 'lucide-react';

export default function SocialProof() {
  const items = [
    {
      icon: <Star className="w-5 h-5 text-amber-500 fill-amber-500" />,
      text: "4.8 / 5 Google-betyg",
      link: "https://maps.app.goo.gl/MJpJGKZWUqxDnRWL7"
    },
    {
      icon: <Calendar className="w-5 h-5 text-brand" />,
      text: "Sedan 1998"
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      text: "Fullt försäkrade"
    },
    {
      icon: <Percent className="w-5 h-5 text-emerald-600" />,
      text: "Godkänt för RUT"
    }
  ];

  return (
    <section className="w-full bg-slate-50 py-6 border-b border-slate-100" id="social-proof-strip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-2 divide-gray-250 md:divide-x">
          {items.map((item, idx) => {
            const content = (
              <>
                <div className="p-2 bg-white rounded-full shadow-xs flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                  {item.icon}
                </div>
                <span className="text-xs md:text-sm font-semibold tracking-tight text-gray-800">
                  {item.text}
                </span>
              </>
            );

            return item.link ? (
              <a
                key={idx}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-2 sm:gap-3 px-2 first:pl-0 reveal-on-scroll group cursor-pointer hover:opacity-90 transition-opacity ${
                  idx === 1 ? 'delay-75' : idx === 2 ? 'delay-150' : idx === 3 ? 'delay-200' : ''
                }`}
              >
                {content}
              </a>
            ) : (
              <div
                key={idx}
                className={`flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-2 sm:gap-3 px-2 first:pl-0 reveal-on-scroll ${
                  idx === 1 ? 'delay-75' : idx === 2 ? 'delay-150' : idx === 3 ? 'delay-200' : ''
                }`}
              >
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
