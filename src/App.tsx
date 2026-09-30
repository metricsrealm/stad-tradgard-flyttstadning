import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SocialProof from './components/SocialProof';
import WhatsIncluded from './components/WhatsIncluded';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import ServiceArea from './components/ServiceArea';
import FAQ from './components/FAQ';
import BottomCTA from './components/BottomCTA';
import Footer from './components/Footer';
import Tack from './components/Tack';
import PrivacyModal from './components/PrivacyModal';
import type { ServiceKey, ServiceConfig, CityConfig } from './types';

const serviceConfigs: Record<ServiceKey, ServiceConfig> = {
  hem: {
    key: 'hem',
    name: 'Hemstädning',
    h1Pattern: 'Professionell hemstädning',
    subheadline: 'Alltid samma städare · RUT-avdrag direkt · Generös nöjd-kund-garanti',
    differentiator: 'Alltid samma städare &middot; RUT &middot; Försäkrade',
    heroImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=80',
    defaultSquareMeter: 85
  },
  flytt: {
    key: 'flytt',
    name: 'Flyttstädning',
    h1Pattern: 'Professionell flyttstädning',
    subheadline: 'Fullständig städgaranti godkänd av hyresvärd · RUT-avdrag · Snabbt på plats',
    differentiator: 'Depositionen tillbaka &middot; Godkänd städgaranti',
    heroImage: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80',
    defaultSquareMeter: 70
  },
  djup: {
    key: 'djup',
    name: 'Djupstädning',
    h1Pattern: 'Genomgripande djupstädning',
    subheadline: 'Grovrengöring i minsta detalj · Ugn & kylskåp städas ur · Skinande resultat',
    differentiator: 'Grovrengöring &middot; Ugn & kylskåp ingår',
    heroImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
    defaultSquareMeter: 90
  },
  kontor: {
    key: 'kontor',
    name: 'Kontorsstädning',
    h1Pattern: 'Skräddarsydd kontorsstädning',
    subheadline: 'Renare arbetsplatser för högre trivsel · Certifierade lokalvårdare · Flexibla tider',
    differentiator: 'Certifierade lokalvårdare &middot; Snabba offerter',
    heroImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1600&q=80',
    defaultSquareMeter: 150
  }
};

const cities: CityConfig[] = [
  { key: 'goteborg', name: 'Göteborg', county: 'Västra Götalands län' },
  { key: 'jonkoping', name: 'Jönköping', county: 'Jönköpings län' },
  { key: 'boras', name: 'Borås', county: 'Västra Götalands län' },
  { key: 'gnosjo', name: 'Gnosjö', county: 'Jönköpings län' },
  { key: 'varnamo', name: 'Värnamo', county: 'Jönköpings län' }
];

const getInitialCity = () => {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  const paramCity = params.get('city');
  if (paramCity) {
    const decoded = decodeURIComponent(paramCity);
    return decoded ? (decoded.charAt(0).toUpperCase() + decoded.slice(1)) : '';
  }
  return '';
};

export default function App() {
  const [activeService, setActiveService] = useState<ServiceKey>('flytt');
  const [activeCity, setActiveCity] = useState<string>(getInitialCity());
  
  // Navigation / Tack Page views State
  const [isTackPage, setIsTackPage] = useState<boolean>(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState<boolean>(false);

  // Global listener for phone clicks to trigger dataLayer event 'phone_click'
  useEffect(() => {
    const handlePhoneClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement | null;
      while (target && target.tagName !== 'A') {
        target = target.parentElement;
      }
      if (target && target.tagName === 'A') {
        const href = target.getAttribute('href');
        if (href && href.startsWith('tel:')) {
          try {
            const cleanPhone = href.replace('tel:', '').trim();
            const clickText = target.textContent?.trim() || '';
            const dataLayer = (window as any).dataLayer || [];
            
            dataLayer.push({
              event: 'phone_click',
              phone_number: cleanPhone,
              click_text: clickText
            });
            console.log("Tracked 'phone_click' event in dataLayer:", cleanPhone, clickText);
          } catch (err) {
            console.error("Error pushing phone_click event to dataLayer:", err);
          }
        }
      }
    };

    document.addEventListener('click', handlePhoneClick);
    return () => document.removeEventListener('click', handlePhoneClick);
  }, []);

  // Sync URL routes on load
  useEffect(() => {
    const parseUrlRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const params = new URLSearchParams(window.location.search);

      // 1. Identify Service Segments
      let service: ServiceKey = 'flytt';
      if (path.includes('hem') || params.get('service') === 'hem') service = 'hem';
      else if (path.includes('djup') || params.get('service') === 'djup') service = 'djup';
      else if (path.includes('kontor') || params.get('service') === 'kontor') service = 'kontor';

      // 2. Identify City Segments (Strictly check query parameter name)
      let city = '';
      const paramCity = params.get('city');
      if (paramCity) {
        const decoded = decodeURIComponent(paramCity);
        city = decoded ? (decoded.charAt(0).toUpperCase() + decoded.slice(1)) : '';
      }

      // 3. Fallback Route check for /tack confirmation landing page
      if (path.includes('tack')) {
        setIsTackPage(true);
      } else {
        setIsTackPage(false);
      }

      setActiveService(service);
      setActiveCity(city);
    };

    // Parse URL on init and popstate navigation
    parseUrlRoute();
    window.addEventListener('popstate', parseUrlRoute);
    return () => window.removeEventListener('popstate', parseUrlRoute);
  }, []);

  // Post-render DOM override to align with the dynamic city injection script (Fix 4)
  useEffect(() => {
    document.querySelectorAll('[data-city]').forEach(el => {
      el.textContent = activeCity || '';
    });
    document.title = activeCity 
      ? `Professionell flyttstädning i ${activeCity}`
      : `Professionell flyttstädning med garanti | Städ & Trädgårdsservice`;
  }, [activeCity]);

  // Global scroll reveal observer for smooth entrance animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [isTackPage]);

  // Smooth scroll to hero form helper
  const scrollToForm = () => {
    const formElement = document.getElementById('calculator-form-container');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Visual feedback: focus ring highlight
      formElement.classList.add('ring-4', 'ring-[#EC4C44]/20');
      setTimeout(() => {
        formElement.classList.remove('ring-4', 'ring-[#EC4C44]/20');
      }, 1000);
      
      // Focus on the first input inside the form to guide user interaction
      const input = formElement.querySelector('input, select') as HTMLInputElement | HTMLSelectElement;
      if (input) {
        input.focus({ preventScroll: true });
      }
    } else {
      const heroElement = document.getElementById('hero-section');
      if (heroElement) {
        heroElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Callback on successful CRM post submission
  const handleSubmissionSuccess = (service: string, city: string) => {
    // Dynamically rewrite pathname to /tack so tracking and pageview events fire matching the CRM guidelines
    window.history.pushState(
      { tack: true }, 
      '', 
      `/tack?service=${service}&city=${encodeURIComponent(city)}`
    );
    setIsTackPage(true);
  };

  // Re-route back to interactive kalkylator
  const handleResetForm = () => {
    window.history.pushState({}, '', '/');
    setIsTackPage(false);
  };

  const serviceConfig = serviceConfigs[activeService];

  return (
    <div className="bg-slate-50/30 text-gray-900 font-sans antialiased selection:bg-brand selection:text-white" id="main-landing-app">
      
      {/* Primary header */}
      <Header />

      {isTackPage ? (
        /* RENDER SUCCESS CONFIRMATION PAGE */
        <Tack
          serviceType={activeService}
          cityName={activeCity}
          onGoBack={handleResetForm}
        />
      ) : (
        /* RENDER PRIMARY OPTIMIZED CONVERSION FUNNEL LANDING PAGE */
        <>
          <Hero
            currentCityName={activeCity}
            currentServiceLabel={serviceConfig.name}
            currentServiceKey={activeService}
            onScrollToForm={scrollToForm}
            onSubmitSuccess={handleSubmissionSuccess}
          />

          <SocialProof />

          <WhatsIncluded onScrollToForm={scrollToForm} />

          <WhyChooseUs />
          <Testimonials />

          <ServiceArea currentCityName={activeCity} />

          <FAQ />

          {/* Squeeze second-chance bottom banner */}
          <BottomCTA onScrollToForm={scrollToForm} />
        </>
      )}

      {/* Global Bare-minimum GDPR Footer */}
      <Footer onPrivacyClick={() => setIsPrivacyOpen(true)} />

      {/* Drawer modal for Integritetspolicy */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />
    </div>
  );
}
