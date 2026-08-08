export type ServiceKey = 'hem' | 'flytt' | 'djup' | 'kontor';

export interface ServiceConfig {
  key: ServiceKey;
  name: string;
  h1Pattern: string;
  subheadline: string;
  differentiator: string;
  heroImage: string;
  defaultSquareMeter: number;
}

export interface CityConfig {
  key: string;
  name: string;
  county: string;
}

export interface FormValues {
  serviceType?: string;
  service_type?: string;
  squareMeter?: string;
  square_meter?: number | string;
  antalRum?: string;
  antal_rum?: string;
  city?: string;
  address?: string;
  frequency?: string;
  name?: string;
  phone?: string;
  email?: string;
  cleaningDate?: string;
  cleaning_date?: string;
  move_date?: string;
  sprojsFonster?: boolean;
  inglasadAltan?: boolean;
  message?: string;
  suggested_price?: number | string;
  suggestedPrice?: number | string;
  gclid?: string;
  fbclid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  user_agent?: string;
  user_ip?: string;
  customer_id?: number | string;
  action?: number;
  contact_status?: string;
  offer_service?: string;
  potential_service?: string;
  comment?: string;
  button_click?: string;
}

export interface Testimonial {
  name: string;
  city: string;
  service: string;
  rating: number;
  text: string;
  avatarUrl?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
