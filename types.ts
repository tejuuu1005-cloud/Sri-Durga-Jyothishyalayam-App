
export enum View {
  HOME = 'HOME',
  HOROSCOPE = 'HOROSCOPE',
  KUNDALI = 'KUNDALI',
  BOOKING = 'BOOKING',
  YATRA = 'YATRA',
  CONTACT = 'CONTACT',
  PROFILE = 'PROFILE',
  ADMIN = 'ADMIN'
}

export type Language = 'en' | 'te';

export interface User {
  name: string;
  phone: string;
  isLoggedIn: boolean;
  isAdmin?: boolean;
}

export interface Booking {
  id: string;
  userName: string;
  service: string;
  date: string;
  status: 'pending' | 'confirmed';
}

export const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export const SERVICES = [
  "Horoscope Reading (Jathakam)",
  "Muhurtham Fixing",
  "Vastu Consultation",
  "Yantra & Japam",
  "Navagraha Shanti",
  "Yatra (Pilgrimage) Planning"
];
