import React, { useState, useEffect } from 'react';
import { Check, Loader2, Mail, User, Phone, CheckCircle2, MapPin, Info, Table, ChevronDown, ChevronUp } from 'lucide-react';
import { DatePicker } from './DatePicker';
import { CityCombobox } from './CityCombobox';
import { FLYTT_PRICE_TABLE, getFlyttPriceInfo } from '../data/pricing';
import type { FormValues } from '../types';

interface CalculatorFormProps {
  initialService?: string;
  initialCity?: string;
  initialSquareMeter?: string;
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
        frequency: freqVal || 'Engångsstädning'
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

// Helper to submit the lead data with robust fallback
const submitLeadToCRM = async (payload: FormValues) => {
  console.log("Attempting CRM submission via proxy...", payload);

  const searchParams = new URLSearchParams(window.location.search);
  const formattedPayload = {
    name: payload.name || "",
    phone: payload.phone || "",
    email: payload.email || "",
    square_meter: typeof payload.square_meter === 'number' 
      ? payload.square_meter 
      : (parseInt(String(payload.square_meter || payload.squareMeter)) || 70),
    city: payload.city || "",
    address: payload.address || payload.city || "",
    move_date: payload.move_date || payload.cleaning_date || payload.cleaningDate || "",
    message: payload.message || payload.comment || "",
    comment: payload.comment || payload.message || "",
    suggested_price: typeof payload.suggested_price === 'number'
      ? payload.suggested_price
      : (parseInt(String(payload.suggested_price || payload.suggestedPrice || '').replace(/[^0-9]/g, '')) || 0),
    button_click: payload.button_click || "no",
    is_button_click: payload.is_button_click || payload.button_click || "no",
    user_type: payload.user_type || "Privatperson",
    service_type: payload.service_type || "Moving cleaning",
    user_agent: payload.user_agent || navigator.userAgent || "",
    utm_source: payload.utm_source || searchParams.get("utm_source") || "",
    utm_medium: payload.utm_medium || searchParams.get("utm_medium") || "",
    utm_campaign: payload.utm_campaign || searchParams.get("utm_campaign") || "",
    utm_term: payload.utm_term || searchParams.get("utm_term") || "",
    utm_content: payload.utm_content || searchParams.get("utm_content") || "",
    gclid: payload.gclid || searchParams.get("gclid") || "",
    fbclid: payload.fbclid || searchParams.get("fbclid") || ""
  };

  try {
    const resp = await fetch("/api/submit-lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formattedPayload)
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

  // Fallback: Direct POST to submit_quote.php with form urlencoded
  try {
    console.log("Executing fallback direct POST to http://stadochtradgard.se/dashboard/submit_quote.php...");

    const params = new URLSearchParams();
    Object.entries(formattedPayload).forEach(([k, v]) => {
      params.append(k, String(v ?? ""));
    });

    await fetch("http://stadochtradgard.se/dashboard/submit_quote.php", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    console.log("Direct fallback POST completed successfully.");
    return { success: true, fallback: true };
  } catch (fallbackErr) {
    console.error("Direct CRM fallback POST failed:", fallbackErr);
    throw fallbackErr;
  }
};

export default function CalculatorForm({ initialService, initialCity, initialSquareMeter, onSubmitSuccess }: CalculatorFormProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Cached UTM / Gclid params on load
  const [utmParams, setUtmParams] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tracking: { [key: string]: string } = {};
    ['gclid', 'fbclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
      const val = params.get(key);
      if (val) tracking[key] = val;
    });
    setUtmParams(tracking);
  }, []);

  // Form State
  const [serviceType, setServiceType] = useState<string>('flytt');
  const [squareMeter, setSquareMeter] = useState<string>(initialSquareMeter || '');
  const [city, setCity] = useState<string>(initialCity !== undefined ? initialCity : (getCityFromURL() || ''));

  // Add-ons & options
  const [sprojsFonster, setSprojsFonster] = useState<boolean>(false);
  const [inglasadAltan, setInglasadAltan] = useState<boolean>(false);
  const [isDodsbo, setIsDodsbo] = useState<boolean>(false);
  const [showPriceList, setShowPriceList] = useState<boolean>(false);

  // Customer contact info & preferences
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [cleaningDate, setCleaningDate] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  // Field errors & tracked lead id
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasFiredLeadEvent, setHasFiredLeadEvent] = useState<boolean>(false);
  const [customerId, setCustomerId] = useState<string | number | null>(null);

  // Step 4 animation words state
  const [loadingWord, setLoadingWord] = useState<string>('Beräknar ditt fasta pris...');

  // Sync initial values when dynamic routing triggers route updates
  useEffect(() => {
    if (initialService) setServiceType(initialService);
  }, [initialService]);

  useEffect(() => {
    if (initialSquareMeter) {
      setSquareMeter(initialSquareMeter);
    }
  }, [initialSquareMeter]);

  useEffect(() => {
    if (initialCity !== undefined) {
      setCity(initialCity);
    } else {
      const autoCity = getCityFromURL();
      setCity(autoCity || '');
    }
  }, [initialCity]);

  // Calculate Flyttstädning price according to exact pricing table & RUT rules
  // Customer pays price after 50% RUT-avdrag (middle column) if living;
  // If estate/deceased (dödsbo), RUT cannot be used and customer pays before RUT.
  // If > 200 kvm: needs to contact for price.
  const flyttPriceInfo = getFlyttPriceInfo(squareMeter, {
    sprojsFonster,
    inglasadAltan,
    isDodsbo
  });

  // Handle Step 1 Submit (Bostad)
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!squareMeter || parseInt(squareMeter) <= 0) {
      newErrors.squareMeter = "Ange bostadsyta (kvm)";
    }
    if (!city.trim()) {
      newErrors.city = "Stad krävs";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(2);
  };

  // Handle Step 2 Submit (Kontakt)
  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = "Namn krävs";
    }
    if (!phone.trim()) {
      newErrors.phone = "Telefonnummer krävs";
    } else {
      const cleanPhone = phone.replace(/\s+/g, '');
      if (cleanPhone.length < 8) {
        newErrors.phone = "Ange ett giltigt telefonnummer";
      }
    }
    if (!email.trim()) {
      newErrors.email = "E-postadress krävs";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Ogiltig e-postadress";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(3);
  };

  // Handle Step 3 Submit (Datum & Meddelande)
  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!cleaningDate) {
      newErrors.cleaningDate = "Välj ett flyttdatum i kalendern";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(4);

    // Fire lead generation payload immediately in Step 3 so details are saved
    try {
      const addons: string[] = [];
      if (sprojsFonster) addons.push("Spröjsade fönster (+300 kr)");
      if (inglasadAltan) addons.push("Inglasad altan/balkong (+500 kr)");
      if (isDodsbo) addons.push("Dödsbo (RUT-avdrag ej tillämpligt)");
      if (flyttPriceInfo.isContactForPrice) addons.push(`Yta över 200 kvm (${flyttPriceInfo.sqmUsed} kvm - kontakt för pris)`);
      const fullMessage = addons.length > 0 
        ? `Uppdrag: ${addons.join(', ')}.${message ? ' ' + message : ''}`
        : (message || "");

      const gclidVal = utmParams.gclid || new URLSearchParams(window.location.search).get("gclid") || "";
      const fbclidVal = utmParams.fbclid || new URLSearchParams(window.location.search).get("fbclid") || "";

      const payload: FormValues = {
        name,
        phone,
        email,
        square_meter: parseInt(squareMeter) || 70,
        squareMeter: squareMeter || '70',
        city,
        address: address || city || "",
        cleaningDate,
        cleaning_date: cleaningDate,
        move_date: cleaningDate,
        message: fullMessage,
        comment: fullMessage,
        suggested_price: flyttPriceInfo.isContactForPrice ? 0 : flyttPriceInfo.effectivePrice,
        suggestedPrice: flyttPriceInfo.isContactForPrice ? "Kontakta för pris" : flyttPriceInfo.formattedPrice,
        button_click: "no",
        is_button_click: "no",
        user_agent: navigator.userAgent,
        user_type: isDodsbo ? "Dödsbo" : "Privatperson",
        service_type: "Moving cleaning",
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
        utm_term: utmParams.utm_term,
        utm_content: utmParams.utm_content,
        gclid: gclidVal,
        fbclid: fbclidVal
      };

      console.log("Submitting Step 3 lead to CRM (button_click=no):", payload);

      submitLeadToCRM(payload)
        .then((data) => {
          console.log("Step 3 CRM submission success:", data);
          const retrievedId = data?.id || data?.data?.id || data?.data?.customer_id;
          if (retrievedId) {
            setCustomerId(retrievedId);
          }
          if (!hasFiredLeadEvent) {
            pushLeadToDataLayer(name, email, phone, city, squareMeter, 'Engångsstädning');
            setHasFiredLeadEvent(true);
          }
        })
        .catch((err) => {
          console.error("Step 3 CRM submission network failure:", err);
          if (!hasFiredLeadEvent) {
            pushLeadToDataLayer(name, email, phone, city, squareMeter, 'Engångsstädning');
            setHasFiredLeadEvent(true);
          }
        });
    } catch (err) {
      console.error("Step 3 CRM submission exception:", err);
    }
  };

  // Step 4 sequence auto-advancer (Loader animation)
  useEffect(() => {
    if (step === 4) {
      const words = flyttPriceInfo.isContactForPrice
        ? ["Sedan 1998", "100% Besiktningsgaranti", "Förbereder prisförslag"]
        : ["Sedan 1998", "100% Besiktningsgaranti", "Fast pris efter RUT-avdrag"];
      let currentWordIdx = 0;
      setLoadingWord(words[0]);

      const interval = setInterval(() => {
        currentWordIdx++;
        if (currentWordIdx < words.length) {
          setLoadingWord(words[currentWordIdx]);
        } else {
          clearInterval(interval);
          setStep(5);
        }
      }, 1200);

      return () => clearInterval(interval);
    }
  }, [step, flyttPriceInfo.isContactForPrice]);

  // Final submit (Step 5 -> Step 6)
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const addons: string[] = [];
      if (sprojsFonster) addons.push("Spröjsade fönster (+300 kr)");
      if (inglasadAltan) addons.push("Inglasad altan/balkong (+500 kr)");
      if (isDodsbo) addons.push("Dödsbo (RUT-avdrag ej tillämpligt)");
      if (flyttPriceInfo.isContactForPrice) addons.push(`Yta över 200 kvm (${flyttPriceInfo.sqmUsed} kvm - kontakt för pris)`);
      const fullMessage = addons.length > 0 
        ? `Uppdrag: ${addons.join(', ')}.${message ? ' ' + message : ''}`
        : (message || "");

      const gclidVal = utmParams.gclid || new URLSearchParams(window.location.search).get("gclid") || "";
      const fbclidVal = utmParams.fbclid || new URLSearchParams(window.location.search).get("fbclid") || "";

      const payload: FormValues = {
        name,
        phone,
        email,
        square_meter: parseInt(squareMeter) || 70,
        squareMeter: squareMeter || '70',
        city,
        address: address || city || "",
        cleaningDate,
        cleaning_date: cleaningDate,
        move_date: cleaningDate,
        message: fullMessage,
        comment: fullMessage,
        suggested_price: flyttPriceInfo.isContactForPrice ? 0 : flyttPriceInfo.effectivePrice,
        suggestedPrice: flyttPriceInfo.isContactForPrice ? "Kontakta för pris" : flyttPriceInfo.formattedPrice,
        button_click: "yes",
        is_button_click: "yes",
        user_agent: navigator.userAgent,
        user_type: isDodsbo ? "Dödsbo" : "Privatperson",
        service_type: "Moving cleaning",
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
        utm_term: utmParams.utm_term,
        utm_content: utmParams.utm_content,
        gclid: gclidVal,
        fbclid: fbclidVal
      };

      console.log("Submitting final payload to CRM (button_click=yes)...", payload);

      const data = await submitLeadToCRM(payload);
      console.log("CRM submission response:", data);

      const idToUpdate = customerId || data?.id || data?.data?.id || data?.data?.customer_id;
      if (idToUpdate) {
        fetch("/api/update-lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: 4,
            customer_id: idToUpdate,
            name,
            email,
            phone,
            square_meter: parseInt(squareMeter) || 70,
            city,
            comment: fullMessage,
            message: fullMessage,
            suggested_price: flyttPriceInfo.isContactForPrice ? 0 : flyttPriceInfo.effectivePrice,
            button_click: "yes",
            is_button_click: "yes",
            user_agent: navigator.userAgent,
            user_type: isDodsbo ? "Dödsbo" : "Privatperson",
            utm_source: utmParams.utm_source || "",
            utm_medium: utmParams.utm_medium || "",
            utm_campaign: utmParams.utm_campaign || "",
            utm_term: utmParams.utm_term || "",
            utm_content: utmParams.utm_content || "",
            gclid: gclidVal,
            fbclid: fbclidVal
          })
        }).catch(err => console.error("Update lead error:", err));
      }

      if (!hasFiredLeadEvent) {
        pushLeadToDataLayer(name, email, phone, city, squareMeter, 'Engångsstädning');
        setHasFiredLeadEvent(true);
      }

      onSubmitSuccess('flytt', city);
      setStep(6);
    } catch (e) {
      console.error("Failed submitting final form fields", e);
      if (!hasFiredLeadEvent) {
        pushLeadToDataLayer(name, email, phone, city, squareMeter, 'Engångsstädning');
        setHasFiredLeadEvent(true);
      }
      onSubmitSuccess('flytt', city);
      setStep(6);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper render for progress indicator
  const renderProgressIndicator = () => {
    const steps = [
      { num: 1, label: "Bostad" },
      { num: 2, label: "Kontakt" },
      { num: 3, label: "Datum" },
      { num: 5, label: "Pris" }
    ];

    return (
      <div className="flex items-center justify-center gap-1 sm:gap-2 mb-5" id="form-progress-bar">
        {steps.map((s, idx) => {
          let state: 'active' | 'done' | 'pending' = 'pending';
          if (step === s.num || (step === 4 && s.num === 3)) {
            state = 'active';
          } else if (
            step > s.num ||
            (step === 4 && s.num < 5) ||
            (step === 6)
          ) {
            state = 'done';
          }

          return (
            <div key={s.num} className="flex items-center">
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] border transition-all duration-200 ${
                    state === 'done'
                      ? 'bg-brand border-brand text-white'
                      : state === 'active'
                      ? 'bg-brand border-brand text-white shadow-md ring-4 ring-brand/20'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {state === 'done' ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                <span className={`text-[10px] sm:text-[11px] font-semibold mt-1 tracking-tight ${state === 'active' ? 'text-brand font-bold' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`h-0.5 w-5 sm:w-8 mx-1 sm:mx-1.5 rounded-full transition-colors duration-300 ${
                    step > s.num || (step === 4 && s.num < 5) || (step === 6) ? 'bg-brand' : 'bg-gray-200'
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
    <div className="w-full bg-[#f7f7f6] rounded-3xl border border-gray-200/80 shadow-xl p-5 md:p-7" id="calculator-form-container">
      {step !== 4 && step !== 6 && renderProgressIndicator()}

      {/* STEP 1: BOSTAD */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit} noValidate className="space-y-4" id="stepperForm">
          <div className="text-center space-y-1 mb-2">
            <h2 className="text-lg md:text-xl font-extrabold text-gray-900 tracking-tight font-display">
              Räkna ut pris för flyttstädning
            </h2>
            <p className="text-xs md:text-sm text-gray-500">
              Få ditt fasta pris direkt online på under 60 sekunder.
            </p>
          </div>

          {/* Service badge (Pre-selected) */}
          <div>
            <div className="bg-red-50/60 border-2 border-[#ec4c44] rounded-xl p-3 flex items-center gap-3 w-full">
              <span className="text-lg">🚚</span>
              <div className="text-left">
                <strong className="text-gray-900 text-xs font-bold block">Flyttstädning</strong>
                <p className="text-xs text-gray-500 mt-0.5">Inkl. fönsterputs & 100% besiktningsgaranti</p>
              </div>
              <span className="ml-auto text-brand font-bold text-xs bg-white px-2.5 py-1 rounded-full border border-brand/20 shadow-2xs">
                Vald
              </span>
            </div>
          </div>

          {/* Square Meters (Bostadsyta kvm) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="squareMeter">
                Bostadsyta (kvm) <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPriceList(!showPriceList)}
                className="text-[11px] font-bold text-brand hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Table className="w-3 h-3" />
                <span>{showPriceList ? 'Dölj prislista' : 'Se prislista (10–200 kvm)'}</span>
                {showPriceList ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>
            <input
              type="number"
              id="squareMeter"
              name="squareMeter"
              placeholder="T.ex. 70"
              value={squareMeter}
              onChange={(e) => {
                setSquareMeter(e.target.value);
                if (errors.squareMeter) setErrors({ ...errors, squareMeter: '' });
              }}
              min="10"
              max="500"
              inputMode="numeric"
              className={errors.squareMeter ? 'field-error' : ''}
            />
            {errors.squareMeter && (
              <span className="error-text">⚠ {errors.squareMeter}</span>
            )}

            {/* Dynamic real-time calculation preview badge */}
            {Boolean(squareMeter && parseInt(squareMeter) > 0) && (
              parseInt(squareMeter) > 200 ? (
                <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-start gap-2 mt-1.5">
                  <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Över 200 kvm:</strong> För ytor över 200 kvm behöver du kontakta oss för pris. Fyll i dina uppgifter så återkommer vi direkt med en skräddarsydd offert med 50% RUT-avdrag!
                  </span>
                </div>
              ) : (
                <div className="text-xs text-emerald-900 bg-emerald-50/90 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between mt-1.5">
                  <span className="font-medium text-emerald-800">
                    {!isDodsbo ? '✓ Pris efter 50% RUT-avdrag (kundpris):' : 'Pris innan RUT-avdrag (Dödsbo):'}
                  </span>
                  <span className="font-black text-brand text-sm">
                    {flyttPriceInfo.formattedPrice}
                  </span>
                </div>
              )
            )}

            {/* Expandable in-form full pricing table */}
            {showPriceList && (
              <div className="mt-2 bg-white rounded-xl border border-gray-200 p-3 shadow-sm text-xs space-y-2">
                <div className="flex items-center justify-between border-b border-gray-100 pb-1.5 font-bold text-gray-700">
                  <span>Pristabell för flyttstädning</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                    Kunden betalar pris efter RUT
                  </span>
                </div>
                <div className="max-h-48 overflow-y-auto divide-y divide-gray-100 pr-1">
                  <div className="grid grid-cols-3 py-1 font-bold text-[11px] text-gray-500 uppercase tracking-wider">
                    <span>KVM</span>
                    <span className="text-brand">Efter RUT</span>
                    <span>Innan RUT</span>
                  </div>
                  {FLYTT_PRICE_TABLE.map((tier, idx) => {
                    const isSelected = parseInt(squareMeter) <= tier.maxSqm && (idx === 0 || parseInt(squareMeter) > FLYTT_PRICE_TABLE[idx - 1].maxSqm);
                    return (
                      <div
                        key={tier.maxSqm}
                        onClick={() => setSquareMeter(String(tier.maxSqm))}
                        className={`grid grid-cols-3 py-1.5 px-1 rounded cursor-pointer transition-colors ${
                          isSelected ? 'bg-red-50/80 font-black text-brand' : 'hover:bg-gray-50 text-gray-800'
                        }`}
                      >
                        <span>{tier.kvmLabel} kvm</span>
                        <span className="font-bold text-brand">{tier.priceAfterRUT.toLocaleString('sv-SE')} kr</span>
                        <span className="text-gray-500">{tier.priceBeforeRUT.toLocaleString('sv-SE')} kr</span>
                      </div>
                    );
                  })}
                  <div
                    onClick={() => setSquareMeter('220')}
                    className="grid grid-cols-3 py-1.5 px-1 bg-amber-50/80 text-amber-950 font-bold rounded cursor-pointer hover:bg-amber-100/70 transition-colors"
                  >
                    <span>Över 200 kvm</span>
                    <span colSpan={2} className="col-span-2 text-amber-900">Kontakta för pris</span>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 leading-tight pt-1 border-t border-gray-100">
                  * Kunden betalar priset i mitten (efter 50% RUT-avdrag). Vid dödsbo kan RUT-avdrag enligt lag ej nyttjas, då gäller pris innan RUT.
                </p>
              </div>
            )}
          </div>

          {/* Location (Stad) Selection field with Searchable City Combobox */}
          <div className="space-y-1.5">
            <label htmlFor="city">
              Stad <span className="text-red-500">*</span>
            </label>
            <CityCombobox
              id="city"
              value={city}
              onChange={(val) => {
                setCity(val);
                if (errors.city) setErrors({ ...errors, city: '' });
              }}
              error={errors.city}
            />
            {errors.city && (
              <span className="error-text">⚠ {errors.city}</span>
            )}
          </div>

          {/* RUT / Dödsbo Selection */}
          <div className="space-y-1.5 pt-2 border-t border-gray-150">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-700">
                RUT-avdrag / Beställare
              </label>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                50% statligt avdrag
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsDodsbo(false)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all text-left flex items-center justify-between cursor-pointer ${
                  !isDodsbo
                    ? 'border-brand bg-red-50/50 text-brand ring-1 ring-brand'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>Privatperson (50% RUT)</span>
                {!isDodsbo && <Check className="w-3.5 h-3.5 text-brand flex-shrink-0" />}
              </button>
              <button
                type="button"
                onClick={() => setIsDodsbo(true)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all text-left flex items-center justify-between cursor-pointer ${
                  isDodsbo
                    ? 'border-brand bg-red-50/50 text-brand ring-1 ring-brand'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>Dödsbo (Utan RUT)</span>
                {isDodsbo && <Check className="w-3.5 h-3.5 text-brand flex-shrink-0" />}
              </button>
            </div>
            {isDodsbo && (
              <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 leading-tight">
                ℹ️ Enligt Skatteverkets regler kan RUT-avdrag endast nyttjas av levande personer. Vid städning av dödsbo gäller ordinarie pris innan RUT.
              </p>
            )}
          </div>

          {/* Additional Services UI (Eventuella tillval) - Compact Selectable Cards */}
          <div className="space-y-2 pt-2 border-t border-gray-150">
            <label className="block text-xs font-semibold text-gray-700">
              Eventuella tillval
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Card 1: Spröjsade fönster */}
              <div
                onClick={() => setSprojsFonster(!sprojsFonster)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                  sprojsFonster
                    ? 'border-brand bg-red-50/40 shadow-2xs ring-1 ring-brand'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={sprojsFonster}
                  onChange={() => {}} // Handled by div container click
                  className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand flex-shrink-0 cursor-pointer"
                />
                <div className="flex flex-col min-w-0 justify-center">
                  <span className="text-xs font-semibold text-gray-900 leading-tight">
                    Spröjsade fönster
                  </span>
                  <span className="text-[11px] text-gray-500 mt-0.5">
                    Tillägg
                  </span>
                </div>
              </div>

              {/* Card 2: Inglasad altan / balkong */}
              <div
                onClick={() => setInglasadAltan(!inglasadAltan)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                  inglasadAltan
                    ? 'border-brand bg-red-50/40 shadow-2xs ring-1 ring-brand'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={inglasadAltan}
                  onChange={() => {}} // Handled by div container click
                  className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand flex-shrink-0 cursor-pointer"
                />
                <div className="flex flex-col min-w-0 justify-center">
                  <span className="text-xs font-semibold text-gray-900 leading-tight">
                    Inglasad altan / balkong
                  </span>
                  <span className="text-[11px] text-gray-500 mt-0.5">
                    Tillägg
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              id="form-step1-submit"
              className="btn-primary"
            >
              <span>Beräkna mitt pris →</span>
            </button>
            <div className="flex items-center justify-center gap-2.5 mt-2.5 text-[11px] font-semibold text-gray-500 flex-wrap">
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> Fast pris</span>
              <span className="text-gray-300">&middot;</span>
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> Inga dolda avgifter</span>
              <span className="text-gray-300">&middot;</span>
              <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-500" /> Pris efter RUT</span>
            </div>
          </div>

          <p className="privacy-note">
            🔒 Genom att fylla i formuläret godkänner du vår <a href="https://stadochtradgard.se/integritetspolicy/" className="underline hover:text-brand transition-colors" target="_blank" rel="noopener noreferrer">integritetspolicy</a>. Vi delar aldrig dina uppgifter.
          </p>
        </form>
      )}

      {/* STEP 2: KONTAKTUPPGIFTER */}
      {step === 2 && (
        <form onSubmit={handleStep2Submit} noValidate className="space-y-4" id="stepperForm">
          <div className="text-center space-y-1 mb-2">
            <h2 className="text-lg md:text-xl font-extrabold text-gray-900 tracking-tight font-display">
              Var ska vi skicka offerten?
            </h2>
            <p className="text-xs md:text-sm text-gray-500">
              Fyll i dina kontaktuppgifter för att gå vidare.
            </p>
          </div>

          {/* Name Field */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gray-400" />
              <span>Namn <span className="text-red-500">*</span></span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              placeholder="Ditt fullständiga namn"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              className={errors.name ? 'field-error' : ''}
            />
            {errors.name && (
              <span className="error-text">⚠ {errors.name}</span>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-1.5">
            <label htmlFor="phone" className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <span>Telefonnummer <span className="text-red-500">*</span></span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              inputMode="tel"
              autoComplete="tel"
              placeholder="07X XXX XX XX"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors({ ...errors, phone: '' });
              }}
              className={errors.phone ? 'field-error' : ''}
            />
            {errors.phone && (
              <span className="error-text">⚠ {errors.phone}</span>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <span>E-postadress <span className="text-red-500">*</span></span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              inputMode="email"
              autoComplete="email"
              placeholder="din@email.se"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              className={errors.email ? 'field-error' : ''}
            />
            {errors.email && (
              <span className="error-text">⚠ {errors.email}</span>
            )}
          </div>

          {/* Address Field */}
          <div className="space-y-1.5">
            <label htmlFor="address" className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span>Gatuadress <span className="text-gray-400 text-xs font-normal">(valfritt)</span></span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              autoComplete="street-address"
              placeholder="T.ex. Storgatan 1"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <p className="privacy-note">
            🔒 Din e-post och telefon behandlas konfidentiellt.
          </p>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-secondary w-1/3"
            >
              Tillbaka
            </button>
            <button
              type="submit"
              className="btn-primary w-2/3"
              id="form-step2-submit"
            >
              <span>Nästa: Välj datum →</span>
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: FLYTTDATUM & MEDDELANDE */}
      {step === 3 && (
        <form onSubmit={handleStep3Submit} noValidate className="space-y-4" id="stepperForm">
          <div className="text-center space-y-1 mb-2">
            <h2 className="text-lg md:text-xl font-extrabold text-gray-900 tracking-tight font-display">
              När vill du ha flyttstädningen?
            </h2>
            <p className="text-xs md:text-sm text-gray-500">
              Välj datum i kalendern och skriv eventuella önskemål.
            </p>
          </div>

          {/* Cleaning Date (Custom React Calendar Popover) */}
          <div className="space-y-1.5">
            <label htmlFor="cleaningDate">
              Önskat flyttdatum <span className="text-red-500">*</span>
            </label>
            <DatePicker
              id="cleaningDate"
              value={cleaningDate}
              onChange={(d) => {
                setCleaningDate(d);
                if (errors.cleaningDate) setErrors({ ...errors, cleaningDate: '' });
              }}
              error={errors.cleaningDate}
            />
            {errors.cleaningDate && (
              <span className="error-text">⚠ {errors.cleaningDate}</span>
            )}
          </div>

          {/* Additional Message */}
          <div className="space-y-1.5">
            <label htmlFor="message">
              Meddelande (valfritt)
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Särskilda önskemål eller koder till dörr..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full placeholder:text-gray-400 text-gray-900 border border-[#D5D8DC] rounded-lg p-3 text-sm focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all resize-y min-h-[96px]"
            />
          </div>

          <p className="privacy-note">
            🔒 Vi kontaktar dig inom kort med bokningsbekräftelse. 100% städgaranti.
          </p>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-secondary w-1/3"
            >
              Tillbaka
            </button>
            <button
              type="submit"
              className="btn-primary w-2/3"
              id="form-step3-submit"
            >
              <span>Visa mitt prisförslag →</span>
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: TRUST ANIMATION TIMEOUT */}
      {step === 4 && (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-6" id="form-animated-loader">
          <Loader2 className="w-12 h-12 text-brand animate-spin" />
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-gray-900 font-display animate-pulse">
              {loadingWord}
            </h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              Beräknar fast pris för {squareMeter} kvm flyttstädning{city ? ` i ${city}` : ''}...
            </p>
          </div>

          <div className="flex gap-2 justify-center pt-2 opacity-85">
            <span className="bg-red-50 border border-red-100 rounded-full py-1 px-3 text-[10px] font-bold text-brand">Sedan 1998</span>
            <span className="bg-red-50 border border-red-100 rounded-full py-1 px-3 text-[10px] font-bold text-brand">100% Städgaranti</span>
            <span className="bg-red-50 border border-red-100 rounded-full py-1 px-3 text-[10px] font-bold text-brand">RUT-avdrag 50%</span>
          </div>
        </div>
      )}

      {/* STEP 5: STREAMLINED PRICE SUMMARY SCREEN */}
      {step === 5 && (
        <div className="space-y-6" id="pricing-estimate">
          {flyttPriceInfo.isContactForPrice ? (
            <>
              <div className="text-center space-y-1">
                <span className="inline-block bg-amber-100 text-amber-900 text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider mb-1">
                  Yta över 200 kvm
                </span>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 font-display">
                  Kontakta oss för pris
                </h3>
                <p className="text-xs text-gray-500">
                  {squareMeter} kvm bostadsyta{city ? ` i ${city}` : ''}
                </p>
              </div>

              {/* Contact for price box */}
              <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-200 text-center space-y-3">
                <div className="text-2xl md:text-3xl font-black text-amber-950 font-display tracking-tight" id="price">
                  Offert vid förfrågan
                </div>
                <p className="text-xs text-gray-700 max-w-sm mx-auto leading-relaxed">
                  För bostäder större än 200 kvm behöver du kontakta oss för pris. Vi räknar fram en anpassad offert med bästa möjliga fasta pris och 50% RUT-avdrag.
                </p>
                <div className="pt-1">
                  <a
                    href="tel:0101753040"
                    className="inline-flex items-center justify-center gap-2 bg-white border border-amber-300 hover:bg-amber-100/50 text-amber-950 font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors text-sm"
                  >
                    <Phone className="w-4 h-4 text-brand" />
                    <span>Ring direkt: 010-175 30 40</span>
                  </a>
                </div>
              </div>

              {/* Included in your move-out cleaning checklist */}
              <div className="space-y-2.5 bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider text-center">
                  Detta ingår alltid i ditt pris:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Komplett flyttstädning</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Fönsterputs</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Ugn & kyl/frys</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Kök & badrum</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2 justify-center pt-1 text-emerald-800 font-bold border-t border-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>100% Besiktningsgaranti</span>
                  </div>
                </div>
              </div>

              <input type="hidden" name="suggested_price" id="suggested_price" value="Kontakta för pris" />
              <input type="hidden" name="button_click" id="button_click" value="1" />

              {/* Single Strong CTA Button */}
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="w-full bg-brand hover:bg-brand-hover text-white h-12 rounded-xl text-base font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 cursor-pointer flex items-center justify-center gap-2"
                id="contact_button"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Skickar förfrågan...</span>
                  </>
                ) : (
                  <span>Begär personlig offert</span>
                )}
              </button>
            </>
          ) : (
            <>
              <div className="text-center space-y-1">
                <span className="inline-block bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider mb-1">
                  Inga dolda avgifter
                </span>
                <h3 className="text-xl md:text-2xl font-black text-gray-900 font-display">
                  {isDodsbo ? "Ditt fasta pris innan RUT-avdrag (Dödsbo)" : "Ditt fasta pris efter RUT-avdrag"}
                </h3>
                <p className="text-xs text-gray-500">
                  {squareMeter || 70} kvm bostadsyta{city ? ` i ${city}` : ''}
                </p>
              </div>

              {/* Large Price Display with clear Efter RUT / Innan RUT indication */}
              <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-200/80 text-center space-y-2.5">
                <div className="text-4xl md:text-5xl font-black text-brand font-display tracking-tight" id="price">
                  {flyttPriceInfo.formattedPrice}
                </div>
                
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white border border-gray-200 shadow-2xs">
                  <span className={!isDodsbo ? "text-emerald-700" : "text-amber-800"}>
                    {!isDodsbo ? "✓ Priset är efter 50% RUT-avdrag (det du betalar)" : "Pris innan RUT-avdrag (Dödsbo)"}
                  </span>
                </div>

                <p className="text-xs text-gray-700 font-medium max-w-sm mx-auto">
                  {!isDodsbo 
                    ? "Kunden betalar detta pris efter 50% RUT-avdrag. Resterande 50% betalar staten direkt till oss via Skatteverket." 
                    : "RUT-avdrag kan enligt lag ej nyttjas vid dödsbo. Ordinarie pris innan RUT-avdrag tillämpas."}
                </p>

                {/* Clear Price Comparison Breakdown (efter RUT vs innan RUT) */}
                <div className="mt-3 pt-3 border-t border-gray-200/80 text-left space-y-2 bg-white p-3.5 rounded-xl">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-700 font-medium">Pris efter RUT-avdrag (det kunden betalar):</span>
                    <span className={`font-bold ${!isDodsbo ? 'text-brand text-sm' : 'text-gray-700'}`}>
                      {flyttPriceInfo.formattedPriceAfterRUT}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-700 font-medium">Innan RUT-avdrag (ordinarie pris):</span>
                    <span className={`font-semibold ${isDodsbo ? 'text-brand text-sm font-bold' : 'text-gray-500'}`}>
                      {flyttPriceInfo.formattedPriceBeforeRUT}
                    </span>
                  </div>
                  {!isDodsbo && (
                    <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg font-semibold border border-emerald-100">
                      <span>Statligt RUT-avdrag (50% avdrag som staten betalar):</span>
                      <span className="font-bold">- {flyttPriceInfo.formattedDiscount}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Prominent RUT Clarification Notice Box */}
              <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 text-left text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-blue-950">
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Viktig information om RUT-avdrag</span>
                </div>
                <p className="text-gray-700 leading-relaxed text-[11px] sm:text-xs">
                  Priset som visas är beräknat <strong>efter 50% RUT-avdrag</strong>, vilket är vad kunden betalar. Resterande 50% betalas av staten och dras av direkt på din faktura utan krångel.
                </p>
                <p className="text-gray-700 text-[11px] leading-relaxed pt-1.5 border-t border-blue-100">
                  <strong>Regler för dödsbo:</strong> RUT-avdrag gäller enbart för levande privatpersoner. Om städningen avser en person som avlidit (dödsbo) kan RUT-avdraget inte användas enligt Skatteverkets regler – då gäller pris innan RUT-avdrag ({flyttPriceInfo.formattedPriceBeforeRUT}).
                </p>
                <div className="pt-1.5 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-700">Gäller städningen ett dödsbo?</span>
                  <button
                    type="button"
                    onClick={() => setIsDodsbo(!isDodsbo)}
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      isDodsbo
                        ? 'bg-blue-900 text-white border-blue-900 shadow-2xs'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {isDodsbo ? 'Ja (visar innan RUT)' : 'Nej (visar efter RUT)'}
                  </button>
                </div>
              </div>

              {/* Included in your move-out cleaning checklist */}
              <div className="space-y-2.5 bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider text-center">
                  Detta ingår alltid i ditt pris:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 font-semibold">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Komplett flyttstädning</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Fönsterputs</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Ugn & kyl/frys</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Kök & badrum</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2 justify-center pt-1 text-emerald-800 font-bold border-t border-emerald-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>100% Besiktningsgaranti</span>
                  </div>
                </div>
              </div>

              <input type="hidden" name="suggested_price" id="suggested_price" value={flyttPriceInfo.formattedPrice} />
              <input type="hidden" name="button_click" id="button_click" value="1" />

              {/* Single Strong CTA Button */}
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="w-full bg-brand hover:bg-brand-hover text-white h-12 rounded-xl text-base font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 cursor-pointer flex items-center justify-center gap-2"
                id="contact_button"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Skickar bokning...</span>
                  </>
                ) : (
                  <span>Boka flyttstädning</span>
                )}
              </button>
            </>
          )}

          {/* Trust badges below CTA */}
          <div className="trust-row flex justify-center items-center gap-3 text-xs text-emerald-700 font-semibold pt-1 flex-wrap">
            <span>✓ Besiktningsgaranti</span>
            <span className="text-gray-300">&middot;</span>
            <span>✓ RUT-avdrag 50%</span>
            <span className="text-gray-300">&middot;</span>
            <span>✓ Inga dolda avgifter</span>
          </div>

          {/* Direct Phone CTA */}
          <div className="text-center pt-1 border-t border-gray-100">
            <a
              href="tel:0101753040"
              className="text-xs font-bold text-gray-500 hover:text-brand transition-colors inline-flex items-center gap-1.5"
              id="pricing-call-fallback"
            >
              <Phone className="w-3.5 h-3.5 text-brand" />
              <span>Ring direkt: 010-175 30 40</span>
            </a>
          </div>
        </div>
      )}

      {/* STEP 6: SUCCESS STATE */}
      {step === 6 && (
        <div className="py-8 px-4 text-center space-y-4" id="greetings">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            ✓
          </div>
          <h2 className="text-xl font-bold text-gray-900 font-display">
            Tack! Vi kontaktar dig inom kort med din bokningsbekräftelse.
          </h2>
          <p className="text-sm text-gray-600">
            Vill du prata direkt? Ring oss på{' '}
            <a href="tel:0101753040" className="text-brand font-bold hover:underline">
              010-175 30 40
            </a>
          </p>
          <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
            E-post: <a href="mailto:info@stadochtradgard.se" className="text-brand font-medium">info@stadochtradgard.se</a>
          </p>
        </div>
      )}
    </div>
  );
}
