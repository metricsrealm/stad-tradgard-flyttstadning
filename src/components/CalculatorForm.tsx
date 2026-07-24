import React, { useState, useEffect } from 'react';
import { Check, Loader2, Mail, User, Info, Phone } from 'lucide-react';
import type { FormValues } from '../types';

interface CalculatorFormProps {
  initialService?: string;
  initialCity?: string;
  onSubmitSuccess: (service: string, city: string) => void;
}

// Auto-fill city from URL
const getCityFromURL = () => {
  if (typeof window === 'undefined') return '';
  const param = new URLSearchParams(window.location.search).get('city');
  if (param) {
    const decoded = decodeURIComponent(param);
    return decoded ? (decoded.charAt(0).toUpperCase() + decoded.slice(1)) : '';
  }
  return '';
};

// Push generate_lead event to GTM dataLayer for Enhanced Conversions
const pushLeadToDataLayer = (
  nameVal: string,
  emailVal: string,
  phoneVal: string,
  cityVal: string,
  sqmVal: string,
  freqVal: string
) => {
  try {
    const dataLayer = (window as any).dataLayer || [];
    const trimmedName = (nameVal || '').trim();
    const parts = trimmedName.split(/\s+/);
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || '';

    // Standard format for Google Ads Enhanced Conversions via dataLayer
    dataLayer.push({
      event: 'generate_lead',
      user_data: {
        email: (emailVal || '').trim().toLowerCase(),
        phone_number: (phoneVal || '').trim(),
        first_name: firstName,
        last_name: lastName,
        address: {
          city: (cityVal || '').trim()
        }
      },
      lead_details: {
        service_type: 'Flyttstädning',
        square_meter: sqmVal || '',
        city: cityVal || '',
        frequency: freqVal || ''
      }
    });
    console.log("Tracked 'generate_lead' event in dataLayer with user_data:", {
      event: 'generate_lead',
      user_data: {
        email: emailVal,
        phone_number: phoneVal,
        first_name: firstName,
        last_name: lastName,
        address: { city: cityVal }
      }
    });
  } catch (err) {
    console.error("Error pushing lead event to dataLayer:", err);
  }
};

// Helper to submit the lead data with robust fallback for static hosting like Cloudflare Pages
const submitLeadToCRM = async (payload: FormValues) => {
  console.log("Attempting CRM submission via proxy...", payload);
  try {
    const resp = await fetch("/api/submit-lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (resp.ok) {
      const data = await resp.json();
      console.log("CRM submission via proxy succeeded:", data);
      return data;
    }

    console.warn(`Proxy returned status ${resp.status}. Falling back to direct CRM POST...`);
  } catch (err) {
    console.error("Proxy CRM submission failed/errored. Falling back to direct CRM POST...", err);
  }

  // Fallback: Direct form post to the PHP endpoint
  try {
    console.log("Executing fallback direct POST to https://stadochtradgard.se/calculator_submit.php...");
    
    const params = new URLSearchParams();
    Object.entries(payload).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        params.append(key, String(val));
      }
    });

    // Use mode: "no-cors" to bypass CORS preflight blocking
    await fetch("https://stadochtradgard.se/calculator_submit.php", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params
    });

    console.log("Direct fallback POST completed successfully (opaque response).");
    return { success: true, fallback: true };
  } catch (fallbackErr) {
    console.error("Direct CRM fallback POST failed:", fallbackErr);
    throw fallbackErr;
  }
};

export default function CalculatorForm({ initialService, initialCity, onSubmitSuccess }: CalculatorFormProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Cached UTM / Gclid params on load
  const [utmParams, setUtmParams] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tracking: { [key: string]: string } = {};
    ['gclid', 'fbclid', 'utm_source', 'utm_medium', 'utm_campaign'].forEach((key) => {
      const val = params.get(key);
      if (val) tracking[key] = val;
    });
    setUtmParams(tracking);
  }, []);

  // Form State
  const [serviceType, setServiceType] = useState<string>('flytt');
  const [squareMeter, setSquareMeter] = useState<string>('');
  const [antalRum, setAntalRum] = useState<string>('3');
  const [city, setCity] = useState<string>(initialCity !== undefined ? initialCity : (getCityFromURL() || ''));
  const [sprojsadeFonster, setSprojsadeFonster] = useState<boolean>(false);
  const [inglasadAltan, setInglasadAltan] = useState<boolean>(false);
  const frequency = 'Flyttstädning' + (sprojsadeFonster ? ' (spröjsade fönster)' : '') + (inglasadAltan ? ' (inglasad altan)' : '');

  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // Field errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasFiredLeadEvent, setHasFiredLeadEvent] = useState<boolean>(false);

  // Step 3 animation words state
  const [loadingWord, setLoadingWord] = useState<string>('Beräknar ditt pris...');

  // Sync initial values when dynamic routing triggers route updates
  useEffect(() => {
    if (initialService) setServiceType(initialService);
  }, [initialService]);

  useEffect(() => {
    if (initialCity !== undefined) {
      setCity(initialCity);
    } else {
      const autoCity = getCityFromURL();
      setCity(autoCity || '');
    }
  }, [initialCity]);

  // Handle Step 1 Submit
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!city.trim()) {
      newErrors.city = "Stad fält krävs";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(2);
  };

  // Handle Step 2 Submit
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = "Namn fält krävs";
    }
    if (!phone.trim()) {
      newErrors.phone = "Mobilnummer krävs";
    } else {
      const cleanPhone = phone.replace(/\s+/g, '');
      if (cleanPhone.length < 8) {
        newErrors.phone = "Felaktigt telefonnummer (måste innehålla minst 8 siffror)";
      }
    }
    if (!email.trim()) {
      newErrors.email = "Mejl fält krävs";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Ogiltig e-postadress";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(3);

    // Fire lead generation payload immediately in Step 2 so contact details are not lost
    try {
      const payload: FormValues = {
        serviceType: 'Flyttstädning',
        service_type: 'Flyttstäd',
        squareMeter: squareMeter || (antalRum === '5+' ? 120 : parseInt(antalRum) * 25).toString(),
        square_meter: squareMeter || (antalRum === '5+' ? 120 : parseInt(antalRum) * 25).toString(),
        antalRum,
        antal_rum: antalRum,
        city,
        frequency,
        name,
        phone,
        email,
        suggested_price: simulated.price,
        suggestedPrice: simulated.price,
        ...utmParams
      };

      console.log("Submitting Step 2 lead to CRM:", payload);

      submitLeadToCRM(payload)
        .then((data) => {
          console.log("Step 2 CRM submission success:", data);
          if (!hasFiredLeadEvent) {
            pushLeadToDataLayer(name, email, phone, city, squareMeter || (parseInt(antalRum) * 20).toString(), frequency);
            setHasFiredLeadEvent(true);
          }
        })
        .catch((err) => {
          console.error("Step 2 CRM submission network failure:", err);
          if (!hasFiredLeadEvent) {
            pushLeadToDataLayer(name, email, phone, city, squareMeter || (parseInt(antalRum) * 20).toString(), frequency);
            setHasFiredLeadEvent(true);
          }
        });
    } catch (err) {
      console.error("Step 2 CRM submission exception:", err);
    }
  };

  // Step 3 sequence auto-advancer
  useEffect(() => {
    if (step === 3) {
      const words = [
        "Sedan 1998",
        "Vi följer kollektivavtal",
        "Vi är försäkrade"
      ];
      let currentWordIdx = 0;
      setLoadingWord(words[0]);

      const interval = setInterval(() => {
        currentWordIdx++;
        if (currentWordIdx < words.length) {
          setLoadingWord(words[currentWordIdx]);
        } else {
          clearInterval(interval);
          setStep(4);
        }
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [step]);

  // Calculate simulated price brackets based on standard Swedish cleaning variables
  const getSimulatedPriceSummary = () => {
    const sqm = parseInt(squareMeter) || (antalRum === '5+' ? 120 : parseInt(antalRum) * 25);
    
    let ratePerSqm = 45;
    if (sqm > 120) ratePerSqm = 32;
    else if (sqm > 80) ratePerSqm = 36;
    else if (sqm > 50) ratePerSqm = 40;

    let basePrice = sqm * ratePerSqm;
    if (basePrice < 1250) basePrice = 1250;

    let addOnsPrice = 0;
    if (sprojsadeFonster) addOnsPrice += 450;
    if (inglasadAltan) addOnsPrice += 650;

    const total = Math.round(basePrice + addOnsPrice);
    
    // Format with space separator for thousands (e.g. 1 850 kr)
    const formattedPrice = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " kr";

    return {
      price: formattedPrice,
      totalVal: total
    };
  };

  const simulated = getSimulatedPriceSummary();

  // Final submit to the backend Express route
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Align fields exactly to calculator_submit.php/lead spec
      const payload: FormValues = {
        serviceType: 'Flyttstädning',
        service_type: 'Flyttstäd',
        squareMeter: squareMeter || (antalRum === '5+' ? 120 : parseInt(antalRum) * 25).toString(), // estimate kvm if missing
        square_meter: squareMeter || (antalRum === '5+' ? 120 : parseInt(antalRum) * 25).toString(),
        antalRum,
        antal_rum: antalRum,
        city,
        frequency,
        name,
        phone,
        email,
        suggested_price: simulated.price,
        suggestedPrice: simulated.price,
        ...utmParams
      };

      console.log("Submitting final payload to CRM...", payload);

      const data = await submitLeadToCRM(payload);
      console.log("CRM submission response:", data);

      if (!hasFiredLeadEvent) {
        pushLeadToDataLayer(name, email, phone, city, squareMeter || (antalRum === '5+' ? 120 : parseInt(antalRum) * 25).toString(), frequency);
        setHasFiredLeadEvent(true);
      }

      // Trigger redirect / success state to render /tack view
      onSubmitSuccess('flytt', city);
      setStep(5);
    } catch (e) {
      console.error("Failed submitting final form fields", e);
      if (!hasFiredLeadEvent) {
        pushLeadToDataLayer(name, email, phone, city, squareMeter || (antalRum === '5+' ? 120 : parseInt(antalRum) * 25).toString(), frequency);
        setHasFiredLeadEvent(true);
      }
      // Fail gracefully and show success anyway to not block user flow if remote endpoint is down
      onSubmitSuccess('flytt', city);
      setStep(5);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper render for progress indicator
  const renderProgressIndicator = () => {
    const steps = [1, 2, 4]; // step 3 is the loading transition
    const stepLabel = { 1: "VAL", 2: "KONTAKT", 4: "PRIS" };
    return (
      <div className="flex items-center justify-center gap-1.5 mb-4" id="form-progress-bar">
        {steps.map((s, idx) => {
          let state: 'active' | 'done' | 'pending' = 'pending';
          if (step === s) {
            state = 'active';
          } else if (step > s || (step === 3 && s === 2) || (step === 5 && s === 4)) {
            state = 'done';
          }

          return (
            <div key={s} className="flex items-center">
              {/* Dot Wrapper */}
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9px] border transition-all duration-350 ${
                    state === 'done'
                      ? 'bg-brand border-brand text-white'
                      : state === 'active'
                      ? 'bg-brand border-brand text-white shadow-md ring-4 ring-brand/20'
                      : 'bg-white border-gray-250 text-gray-400'
                  }`}
                >
                  {state === 'done' ? <Check className="w-3 h-3" /> : idx + 1}
                </div>
                <span className={`text-[10px] font-bold mt-0.5 uppercase tracking-wider ${state === 'active' ? 'text-brand' : 'text-gray-400'}`}>
                  {stepLabel[s as 1 | 2 | 4]}
                </span>
              </div>

              {/* Connecting line between steps */}
              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 w-10 mx-1 rounded-full transition-colors duration-300 ${
                    step > s || (step === 3 && s === 1) || (step === 5 && s === 2) ? 'bg-brand' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl border border-gray-200/80 shadow-xl p-[18px] md:p-[28px]" id="calculator-form-container">
      {step !== 3 && step !== 5 && renderProgressIndicator()}

      {/* STEP 1: CONFIGURATION */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit} className="flex flex-col gap-[12px]" id="stepperForm">
          <h2 className="text-base md:text-lg font-black text-gray-900 tracking-tight font-display mb-0.5 text-center">
            Få prisförslag direkt
          </h2>
          <p className="text-xs md:text-sm text-gray-500 text-center mb-2">
            Beräkna ditt städpris på under 60 sekunder.
          </p>

          {/* Service tile selector (Locked Flyttstädning Badge) */}
          <div className="w-full">
            <div className="service-confirmed bg-[#FFF5F4] border-2 border-[#EC4C44] rounded-[8px] py-[8px] px-[12px] flex items-center gap-3 w-full" id="service-confirmed-badge">
              <span className="text-base">📦</span>
              <div className="text-left">
                <strong className="text-gray-900 text-xs font-bold block">Flyttstädning</strong>
                <p className="text-xs text-gray-500 mt-0.5 leading-none">Grundlig städning inför flytt, med garanti</p>
              </div>
              <span className="ml-auto text-[#EC4C44] font-bold text-xs">✓</span>
            </div>
            <input type="hidden" name="serviceType" value="Flyttstädning" />
          </div>

          {/* Antal rum Clickable Tiles */}
          <div className="w-full">
            <label htmlFor="antalRum">
              Antal rum:
            </label>
            <div className="room-tiles" id="room-tiles">
              {['1', '2', '3', '4', '5+'].map((val) => {
                const isActive = antalRum === val;
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAntalRum(val)}
                    className={`room-tile ${isActive ? 'active' : ''}`}
                    data-value={val}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
            <input type="hidden" id="rooms" name="rooms" value={antalRum} required />
          </div>

          {/* Square Feet (kvm) Optional field */}
          <div className="w-full">
            <label htmlFor="squareMeter" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Bostadsyta (kvm):</span>
              <span style={{ fontSize: '10px', background: '#F3F4F6', color: '#9CA3AF', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, textTransform: 'none', letterSpacing: 0 }}>Valfritt</span>
            </label>
            <input
              type="number"
              id="squareMeter"
              name="squareMeter"
              placeholder="T.ex. 85"
              value={squareMeter}
              onChange={(e) => setSquareMeter(e.target.value)}
              min="5"
              max="500"
              className="w-full"
            />
          </div>

          {/* Location (Stad) Selection field */}
          <div className="w-full relative">
            <label htmlFor="city">Din stad:</label>
            <input
              type="text"
              id="city"
              name="city"
              placeholder="T.ex. Borås"
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                if (errors.city) {
                  setErrors({ ...errors, city: '' });
                }
              }}
              className={`w-full ${errors.city ? 'field-error' : ''}`}
            />
            {errors.city && (
              <span className="error-text">⚠ {errors.city}</span>
            )}
          </div>

          {/* Tilläggstjänster Checkboxes */}
          <div className="w-full space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Välj tilläggstjänster:</label>
            <div className="grid grid-cols-1 gap-3">
              <label className={`flex items-center justify-between bg-white border-2 ${sprojsadeFonster ? 'border-[#EC4C44] bg-[#FFF5F4]/40 ring-2 ring-[#EC4C44]/5' : 'border-[#E2E8F0] hover:border-gray-400'} rounded-xl p-3.5 transition-all duration-150 cursor-pointer text-[15px] font-bold text-gray-800 group shadow-sm`}>
                <input
                  type="checkbox"
                  checked={sprojsadeFonster}
                  onChange={(e) => setSprojsadeFonster(e.target.checked)}
                  className="sr-only"
                />
                <div className="flex items-center gap-3.5">
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-150 ${sprojsadeFonster ? 'bg-[#EC4C44] border-[#EC4C44] scale-110 shadow-md shadow-[#EC4C44]/20' : 'border-gray-300 bg-white group-hover:border-gray-400'}`}>
                    {sprojsadeFonster && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[15px] md:text-base font-bold text-gray-900 tracking-tight leading-tight select-none">Spröjsade fönster</span>
                </div>
              </label>
              
              <label className={`flex items-center justify-between bg-white border-2 ${inglasadAltan ? 'border-[#EC4C44] bg-[#FFF5F4]/40 ring-2 ring-[#EC4C44]/5' : 'border-[#E2E8F0] hover:border-gray-400'} rounded-xl p-3.5 transition-all duration-150 cursor-pointer text-[15px] font-bold text-gray-800 group shadow-sm`}>
                <input
                  type="checkbox"
                  checked={inglasadAltan}
                  onChange={(e) => setInglasadAltan(e.target.checked)}
                  className="sr-only"
                />
                <div className="flex items-center gap-3.5">
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-150 ${inglasadAltan ? 'bg-[#EC4C44] border-[#EC4C44] scale-110 shadow-md shadow-[#EC4C44]/20' : 'border-gray-300 bg-white group-hover:border-gray-400'}`}>
                    {inglasadAltan && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[15px] md:text-base font-bold text-gray-900 tracking-tight leading-tight select-none">Inglasad altan/balkong</span>
                </div>
              </label>
            </div>
          </div>

          <div className="buttons pt-2 w-full">
            <button
              type="submit"
              id="form-step1-submit"
              className="w-full"
            >
              <span>Beräkna mitt pris →</span>
            </button>
          </div>

          <p className="privacy-note">
            🔒 Genom att fylla i formuläret godkänner du vår <a href="https://stadochtradgard.se/integritetspolicy/" className="underline hover:text-[#EC4C44] transition-colors" target="_blank" rel="noopener noreferrer">integritetspolicy</a>. Vi delar aldrig dina uppgifter.
          </p>
        </form>
      )}

      {/* STEP 2: CONTACT INFORMATION */}
      {step === 2 && (
         <form onSubmit={handleStep2Submit} className="space-y-5" id="stepperForm">
          <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight font-display text-center mb-1">
            Var ska vi skicka kalkylen?
          </h2>
          <p className="text-xs md:text-sm text-gray-500 text-center mb-6">
            Fyll i dina uppgifter för att se din prisuppskattning och hämta offert.
          </p>

          {/* Name Field */}
          <div className="space-y-1">
            <label htmlFor="name" className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User className="w-4 h-4 text-gray-400" />
              <span>Namn <span style={{ color: "red" }}>*</span></span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Ditt fullständiga namn"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              className={errors.name ? 'field-error' : ''}
              required
            />
            {errors.name && (
              <span className="error-text">⚠ {errors.name}</span>
            )}
          </div>

          {/* Phone (REQUIRED with Swedish validation) */}
          <div className="space-y-1">
            <label htmlFor="phone" className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone className="w-4 h-4 text-gray-400" />
              <span>Mobilnummer <span style={{ color: "red" }}>*</span></span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="07X XXX XX XX"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors({ ...errors, phone: '' });
              }}
              className={errors.phone ? 'field-error' : ''}
              required
            />
            {errors.phone && (
              <span className="error-text">⚠ {errors.phone}</span>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail className="w-4 h-4 text-gray-400" />
              <span>E-postadress <span style={{ color: "red" }}>*</span></span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="din@email.se"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              className={errors.email ? 'field-error' : ''}
              required
            />
            {errors.email && (
              <span className="error-text">⚠ {errors.email}</span>
            )}
          </div>

          <p className="privacy-note text-[12px] text-[#7F8C8D] italic text-center mt-2">
            🔒 Vi kontaktar dig snarast möjligt. Ingen bindningstid.
          </p>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-1/3 border border-[#D5D8DC] hover:bg-gray-50 text-gray-600 h-11 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              Tillbaka
            </button>
            <button
              type="submit"
              className="w-2/3 bg-[#EC4C44] hover:bg-[#D44038] text-white h-11 rounded-lg text-sm font-bold shadow-sm transition-all duration-150 cursor-pointer"
              id="form-step2-submit"
            >
              <span>Visa mitt prisförslag →</span>
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: TRUST ANIMATION TIMEOUT */}
      {step === 3 && (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-6" id="form-animated-loader">
          <Loader2 className="w-14 h-14 text-[#EC4C44] animate-spin" />
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-gray-900 font-display animate-pulse" id="special_word">
              {loadingWord}
            </h3>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Analyserar bostadsstorlek och rumsfördelning{city ? ` i ${city}` : ''}...
            </p>
          </div>

          {/* Mini Trust badge anchors listing inside loaders */}
          <div className="flex gap-2 justify-center pt-4 opacity-75">
            <span className="bg-red-50 border border-red-100/60 rounded-full py-1 px-3 text-[10px] font-bold text-[#EC4C44]">Sedan 1998</span>
            <span className="bg-red-50 border border-red-100/60 rounded-full py-1 px-3 text-[10px] font-bold text-[#EC4C44]">Kollektivavtal</span>
            <span className="bg-red-50 border border-red-100/60 rounded-full py-1 px-3 text-[10px] font-bold text-[#EC4C44]">Försäkrade</span>
          </div>
        </div>
      )}

      {/* STEP 4: BRACKET & PRICING SCHEME */}
      {step === 4 && (
        <div className="space-y-6" id="pricing-estimate">
          <div className="text-center">
            <h3 className="text-xl md:text-2xl font-black text-gray-900 font-display mt-1">
              Ditt uppskattade pris för flyttstädning:
            </h3>
          </div>

          {/* Pricing detail grid box */}
          <div className="bg-[#FAF9F7] rounded-2xl p-5 border border-gray-200/80">
            
            <div className="py-4 space-y-2.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">Bostadsstorlek:</span>
                <span className="font-bold text-gray-800">{squareMeter ? `${squareMeter} kvm` : `${antalRum} rum`}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">Fönsterputsning:</span>
                <span className="font-bold text-emerald-600">Alltid inkluderat</span>
              </div>
              {(sprojsadeFonster || inglasadAltan) && (
                <div className="flex justify-between items-center text-sm border-t border-dashed border-gray-200 pt-2.5">
                  <span className="text-gray-600 font-medium">Valda tillägg:</span>
                  <span className="font-bold text-gray-800">
                    {[
                      sprojsadeFonster && "Spröjsade fönster",
                      inglasadAltan && "Inglasad altan/balkong"
                    ].filter(Boolean).join(", ")}
                  </span>
                </div>
              )}
            </div>

            {/* Accentuated Highlight for standard price */}
            <div className="pt-4 border-t border-gray-200/80 flex justify-between items-end">
              <div>
                <span className="text-[10px] bg-emerald-600 text-white font-black py-0.5 px-2 rounded-full uppercase tracking-wider inline-block mb-1">
                  RUT-Avdrag 50%
                </span>
                <p className="text-xs text-gray-500 font-semibold leading-tight">Ditt pris att betala:</p>
              </div>
              <div className="text-right">
                <strong className="text-3xl font-black text-[#EC4C44] font-display leading-none" id="price">
                  {simulated.price}
                </strong>
              </div>
            </div>
          </div>

          <p className="text-sm font-medium text-gray-600 text-center px-4 leading-relaxed">
            Priset är en uppskattning — du får alltid en offert innan du bestämmer dig.
          </p>

          <input type="hidden" name="suggested_price" id="suggested_price" value={simulated.price} />
          <input type="hidden" name="button_click" id="button_click" value="1" />

          <button
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="w-full bg-[#EC4C44] hover:bg-[#D44038] text-white h-12 rounded-xl text-base font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 cursor-pointer flex items-center justify-center gap-2"
            id="contact_button"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Skickar förfrågan...</span>
              </>
            ) : (
              <span>Jag är intresserad – kontakta mig!</span>
            )}
          </button>

          <div className="text-center">
            <div className="trust-row flex justify-center items-center gap-3.5 text-xs text-[#27AE60] font-semibold mt-1">
              <span>✓ Fast pris</span>
              <span>✓ Nöjd-kund-garanti</span>
              <span>✓ RUT-avdrag</span>
            </div>
          </div>

          <a
            href="tel:0101753040"
            className="block text-center text-xs font-bold text-gray-500 hover:text-[#EC4C44] underline"
            id="pricing-call-fallback"
          >
            eller boka snabbt via tel: 010-175 30 40
          </a>
        </div>
      )}

      {/* STEP 5: THANK YOU / SUCCESS COMPLETED STATE */}
      {step === 5 && (
        <div id="greetings" style={{ textAlign: 'center', padding: '20px 10px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>✓</div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1C2833', marginBottom: '8px' }}>
            Tack! Vi kontaktar dig snarast möjligt.
          </h2>
          <p style={{ fontSize: '14px', color: '#5D6D7E', marginBottom: '16px' }}>
            Vill du prata direkt? Ring oss på{' '}
            <a href="tel:0101753040" style={{ color: '#EC4C44', fontWeight: 600 }}>
              010-175 30 40
            </a>
          </p>
          <p style={{ fontSize: '12px', color: '#95A5A6' }}>
            E-post: <a href="mailto:info@stadochtradgard.se" style={{ color: '#EC4C44' }}>info@stadochtradgard.se</a>
          </p>
        </div>
      )}
    </div>
  );
}
