import React, { useState, useEffect } from 'react';
import { Layout, Header } from './components/Layout';
import { Navigation } from './components/Navigation';
import { View, User, Booking, ZODIAC_SIGNS, SERVICES as DEFAULT_SERVICES, Language } from './types';
import { getDailyHoroscope, getKundaliAnalysis } from './services/gemini';
import { Phone, MapPin, Mail, User as UserIcon, CheckCircle, Lock, Menu, Star, Moon, Briefcase, ChevronRight, X, Loader2, LogOut, Camera, ScanLine, Globe, Calendar as CalendarIcon, Upload, Sun, ArrowRight, CreditCard } from 'lucide-react';

// --- Constants ---
// Generating a valid UPI QR code for the provided number
const QR_CODE_URL = "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi%3A%2F%2Fpay%3Fpa%3D7013285122%40ybl%26pn%3DSriDurgaJyothishyalayam";

// Placeholders - In a production app, these would be the actual uploaded images.
// Using 'object-contain' in CSS ensures the full text of these pamphlets is visible.
const MAIN_PAMPHLET_URL = "https://images.unsplash.com/photo-1605052308962-f703e488e02d?q=80&w=800&auto=format&fit=crop"; 
const YATRA_PAMPHLET_URL = "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=800&auto=format&fit=crop"; 
// Updated Placeholder for Profile Picture - Durga Devi Image
const PROFILE_PIC_URL = "https://images.unsplash.com/photo-1699784064148-894463467a42?q=80&w=1974&auto=format&fit=crop"; 

// Services list updated from Pamphlet
const SERVICES_LIST = [
  "Horoscope Reading (Jathakam)",
  "Muhurtham Fixing",
  "Vastu Consultation",
  "Yantra & Japam",
  "Navagraha Shanti",
  "Homamulu",
  "Yatra Planning"
];

// --- Translations ---
const TRANSLATIONS = {
  en: {
    appTitle: "Sri Durga Jyothishyalayam",
    welcome: "Welcome",
    loginTitle: "Login to Continue",
    namePlace: "Your Name",
    phonePlace: "Phone Number",
    getOtp: "Get OTP",
    verify: "Verify & Login",
    verifyTitle: "Verify Mobile",
    back: "Back",
    dailyHoroscope: "Daily Horoscope",
    dailyDesc: "Get your daily prediction",
    kundali: "Kundali Analysis",
    kundaliDesc: "Birth chart generation",
    yatra: "Sri Durga Yatra Special",
    yatraDesc: "Pilgrimage tours: Kashi, Gaya, Rameshwaram",
    bookAppt: "Book Appointment",
    contactInfo: "Contact Info",
    selectSign: "Select Your Zodiac Sign",
    changeSign: "Change Sign",
    luckyColor: "Lucky Color",
    luckyNumber: "Lucky Number",
    genKundali: "Generate Kundali",
    fullName: "Full Name",
    dob: "Date of Birth",
    tob: "Time of Birth",
    pob: "Place of Birth",
    genChart: "Generate Chart",
    bookConsult: "Book Consultation",
    selectService: "Select Service",
    selectDate: "Select Date",
    confirmBook: "Confirm Booking",
    reqSent: "Request Sent!",
    reqDesc: "Guruji will contact you to confirm the time.",
    payMethod: "Payment Methods",
    payDesc: "Scan to Pay (PhonePe / GPay)",
    myProfile: "My Profile",
    personalDet: "Personal Details",
    myBookings: "My Bookings",
    privacy: "Privacy Settings",
    signOut: "Sign Out",
    visitingHours: "Visiting Hours",
    morning: "Morning",
    evening: "Evening",
    location: "Location",
    callUs: "Call Us",
    astrologerName: "Kandarpa Surya Subrahmanyam",
    astrologerTitle: "(K. Suresh Sharma) M.A (Jyothishyam), M.A, Ph.D",
    tagline: "Sarve Jana Sukhino Bhavantu",
    enterOtp: "Enter OTP",
    otpPlace: "1234",
    pamphlet: "Our Services",
    qrTitle: "Payment QR Code",
    consultationFee: "Consultation Fee: ₹500",
    viewPamphlet: "Tour Packages",
    destinations: "Available Yatra Packages",
    phonePeNumbers: "PhonePe / GPay Numbers"
  },
  te: {
    appTitle: "శ్రీ దుర్గా జ్యోతిష్యాలయం",
    welcome: "స్వాగతం",
    loginTitle: "లాగిన్ చేయండి",
    namePlace: "మీ పేరు",
    phonePlace: "ఫోన్ నంబర్",
    getOtp: "OTP పొందండి",
    verify: "ధృవీకరించండి & లాగిన్ చేయండి",
    verifyTitle: "మొబైల్ ధృవీకరణ",
    back: "వెనుకకు",
    dailyHoroscope: "రాశి ఫలాలు",
    dailyDesc: "మీ రోజువారీ ఫలితాలు",
    kundali: "జాతకం",
    kundaliDesc: "జన్మ కుండలి విశ్లేషణ",
    yatra: "శ్రీ దుర్గా యాత్ర స్పెషల్",
    yatraDesc: "కాశీ, గయ, రామేశ్వరం యాత్రలు",
    bookAppt: "అపాయింట్‌మెంట్ బుక్ చేయండి",
    contactInfo: "సంప్రదించండి",
    selectSign: "మీ రాశిని ఎంచుకోండి",
    changeSign: "రాశి మార్చండి",
    luckyColor: "అదృష్ట రంగు",
    luckyNumber: "అదృష్ట సంఖ్య",
    genKundali: "జాతకం సృష్టించండి",
    fullName: "పూర్తి పేరు",
    dob: "పుట్టిన తేదీ",
    tob: "పుట్టిన సమయం",
    pob: "పుట్టిన ప్రదేశం",
    genChart: "చార్ట్ సృష్టించండి",
    bookConsult: "సంప్రదింపుల కోసం బుక్ చేయండి",
    selectService: "సేవను ఎంచుకోండి",
    selectDate: "తేదీ ఎంచుకోండి",
    confirmBook: "బుకింగ్ నిర్ధారించండి",
    reqSent: "అభ్యర్థన పంపబడింది!",
    reqDesc: "గురువు గారు సమయాన్ని నిర్ధారించడానికి మిమ్మల్ని సంప్రదిస్తారు.",
    payMethod: "చెల్లింపు పద్ధతులు",
    payDesc: "చెల్లించడానికి స్కాన్ చేయండి",
    myProfile: "నా ప్రొఫైల్",
    personalDet: "వ్యక్తిగత వివరాలు",
    myBookings: "నా బుకింగ్‌లు",
    privacy: "గోప్యతా సెట్టింగ్‌లు",
    signOut: "లాగ్ అవుట్",
    visitingHours: "సందర్శించు వేళలు",
    morning: "ఉదయం",
    evening: "సాయంత్రం",
    location: "చిరునామా",
    callUs: "మాకు కాల్ చేయండి",
    astrologerName: "కందర్ప సూర్య సుబ్రహ్మణ్యం",
    astrologerTitle: "(K. సురేష్ శర్మ) M.A (జ్యోతిష్యం), M.A, Ph.D",
    tagline: "సర్వే జనా సుఖినో భవంతు",
    enterOtp: "OTP నమోదు చేయండి",
    otpPlace: "1234",
    pamphlet: "మా సేవలు",
    qrTitle: "చెల్లింపు QR కోడ్",
    consultationFee: "సంప్రదింపు రుసుము: ₹500",
    viewPamphlet: "యాత్ర వివరాలు",
    destinations: "అందుబాటులో ఉన్న యాత్రలు",
    phonePeNumbers: "PhonePe / GPay నంబర్లు"
  }
};

// --- Sub-Components ---

const LoadingSpinner = () => (
  <div className="flex justify-center p-8 text-amber-600 animate-spin">
    <Loader2 size={32} />
  </div>
);

const SectionTitle = ({ children, lang }: { children?: React.ReactNode, lang: Language }) => (
  <h2 className={`text-xl text-[#B91C1C] mb-4 font-bold border-l-4 border-amber-500 pl-3 uppercase tracking-wider ${lang === 'te' ? 'telugu-font' : 'heading-font'}`}>
    {children}
  </h2>
);

const Card = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <div className={`bg-white p-4 rounded-xl border-2 border-orange-100 shadow-md shadow-orange-100/50 ${className}`}>
    {children}
  </div>
);

const PhoneLink = ({ number }: { number: string }) => (
  <a href={`tel:${number.replace(/\s/g, '')}`} className="flex items-center gap-2 text-amber-900 font-bold bg-orange-50 px-3 py-2 rounded-md border border-orange-200 hover:bg-orange-100">
    <Phone size={16} className="text-amber-600" />
    {number}
  </a>
);

// --- Login Screen ---
const LoginScreen = ({ onLogin, lang, setLang }: { onLogin: (user: User) => void, lang: Language, setLang: (l: Language) => void }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const t = TRANSLATIONS[lang];

  const handleGetOtp = () => {
    if (phone.length >= 10 && name.length > 0) setStep(2);
    else alert(lang === 'en' ? "Please enter valid details" : "దయచేసి సరైన వివరాలను నమోదు చేయండి");
  };

  const handleVerify = () => {
    if (otp === '1234') {
      onLogin({ name, phone, isLoggedIn: true });
    } else {
      alert(lang === 'en' ? "Invalid OTP (Try 1234)" : "చెల్లని OTP (1234 ప్రయత్నించండి)");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] bg-orange-50">
      <div className="absolute top-4 right-4">
         <button 
            onClick={() => setLang(lang === 'en' ? 'te' : 'en')}
            className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-md text-amber-800 font-bold border border-amber-200"
          >
            <Globe size={16} />
            {lang === 'en' ? 'తెలుగు' : 'English'}
          </button>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border-t-8 border-[#B91C1C] text-center">
        <div className="w-24 h-24 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-6 border-4 border-[#B91C1C]">
          <Star size={40} className="text-[#B91C1C]" fill="#B91C1C" />
        </div>
        <h1 className={`text-2xl font-bold text-[#B91C1C] mb-2 ${lang === 'te' ? 'telugu-font' : 'heading-font'}`}>{t.appTitle}</h1>
        <p className="text-amber-800 mb-8 font-medium">{t.tagline}</p>

        {step === 1 ? (
          <div className="space-y-4">
            <h2 className={`text-xl font-semibold text-gray-800 ${lang === 'te' ? 'telugu-font' : ''}`}>{t.loginTitle}</h2>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 text-amber-400" size={20} />
              <input
                type="text"
                placeholder={t.namePlace}
                className="w-full pl-10 pr-4 py-3 border-2 border-orange-100 rounded-lg focus:outline-none focus:border-amber-500 bg-orange-50/30"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-amber-400" size={20} />
              <input
                type="tel"
                placeholder={t.phonePlace}
                className="w-full pl-10 pr-4 py-3 border-2 border-orange-100 rounded-lg focus:outline-none focus:border-amber-500 bg-orange-50/30"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <button
              onClick={handleGetOtp}
              className="w-full bg-gradient-to-r from-[#B91C1C] to-amber-600 text-white py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              {t.getOtp}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className={`text-xl font-semibold text-gray-800 ${lang === 'te' ? 'telugu-font' : ''}`}>{t.verifyTitle}</h2>
            <p className="text-sm text-gray-500">{t.enterOtp}</p>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-amber-400" size={20} />
              <input
                type="text"
                placeholder={t.otpPlace}
                className="w-full pl-10 pr-4 py-3 border-2 border-orange-100 rounded-lg focus:outline-none focus:border-amber-500 text-center text-xl tracking-widest bg-orange-50/30"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button
              onClick={handleVerify}
              className="w-full bg-gradient-to-r from-[#B91C1C] to-amber-600 text-white py-3 rounded-lg font-bold shadow-lg"
            >
              {t.verify}
            </button>
            <button onClick={() => setStep(1)} className="text-amber-600 text-sm font-medium hover:underline">
              {t.back}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Views ---

const HomeView = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang];
  return (
    <div className="p-4 space-y-6 animate-fade-in">
      {/* Astrologer Card */}
      <Card className="bg-gradient-to-br from-white to-orange-50 border-orange-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-32 h-32 rounded-full border-4 border-amber-400 shadow-xl mb-4 overflow-hidden bg-gray-200 relative">
             <img src={PROFILE_PIC_URL} alt="K. Suresh Sharma" className="w-full h-full object-cover" />
          </div>
          <h2 className={`text-2xl font-bold text-[#B91C1C] ${lang === 'te' ? 'telugu-font' : 'heading-font'}`}>
            {t.astrologerName}
          </h2>
          <p className="text-amber-800 text-sm font-medium mt-1 leading-relaxed max-w-xs">
            {t.astrologerTitle}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
             <div className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold border border-amber-200">Jyothishyam</div>
             <div className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold border border-amber-200">Vastu</div>
             <div className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold border border-amber-200">Muhurtham</div>
          </div>
        </div>
      </Card>

      {/* Main Pamphlet Image Section - Full Display */}
      <div className="space-y-2">
        <SectionTitle lang={lang}>{t.pamphlet}</SectionTitle>
        <div className="rounded-xl overflow-hidden shadow-lg border-2 border-amber-200 bg-white">
          <div className="w-full bg-amber-50 flex items-center justify-center p-2">
              <img src={MAIN_PAMPHLET_URL} alt="Services Pamphlet" className="w-full h-auto object-contain max-h-[500px]" />
          </div>
        </div>
      </div>
      
      <div className="bg-amber-100 p-4 rounded-lg border border-amber-300 text-center">
        <p className={`text-amber-900 font-bold ${lang === 'te' ? 'telugu-font' : ''}`}>
           {t.tagline}
        </p>
      </div>
    </div>
  );
};

const YatraView = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang];
  return (
    <div className="p-4 space-y-4 animate-fade-in pb-20">
      <SectionTitle lang={lang}>{t.yatra}</SectionTitle>
      
      {/* Yatra Pamphlet Image Section - Full Display */}
      <div className="rounded-xl overflow-hidden shadow-lg border-2 border-amber-200 mb-6 bg-white">
        <div className="w-full bg-amber-50 flex items-center justify-center p-2">
             <img src={YATRA_PAMPHLET_URL} alt="Yatra Details" className="w-full h-auto object-contain max-h-[500px]" />
        </div>
      </div>

      <Card className="bg-orange-50 border-amber-200">
        <h3 className={`font-bold text-[#B91C1C] mb-4 text-lg ${lang === 'te' ? 'telugu-font' : ''}`}>{t.destinations}</h3>
        
        <div className="space-y-3">
          <div className="bg-white p-3 rounded-lg border border-orange-100">
            <h4 className="font-bold text-amber-800 text-sm mb-1">North India</h4>
            <p className="text-xs text-amber-700">Kashi, Gaya, Prayaga, Delhi, Agra, Mathura, Haridwar, Rishikesh, Char Dham (Kedarnath, Badrinath)</p>
          </div>
          
          <div className="bg-white p-3 rounded-lg border border-orange-100">
            <h4 className="font-bold text-amber-800 text-sm mb-1">South India</h4>
            <p className="text-xs text-amber-700">Rameshwaram, Madurai, Kanyakumari, Tirupati, Srisailam, Arunachalam</p>
          </div>

          <div className="bg-white p-3 rounded-lg border border-orange-100">
            <h4 className="font-bold text-amber-800 text-sm mb-1">Jyotirlingas</h4>
            <p className="text-xs text-amber-700">Somnath, Nageshwar, Omkareshwar, Ujjain, Grushneshwar, Bhimashankar, Trayambakam</p>
          </div>
        </div>

        <button className="w-full mt-4 bg-[#B91C1C] text-white py-2 rounded-lg font-bold shadow-md hover:bg-red-800">
            {t.callUs}
        </button>
      </Card>
    </div>
  );
};

const ContactView = ({ lang }: { lang: Language }) => {
  const t = TRANSLATIONS[lang];
  return (
    <div className="p-4 space-y-6 animate-fade-in pb-20">
       <SectionTitle lang={lang}>{t.contactInfo}</SectionTitle>

       <Card className="flex items-start gap-4">
         <div className="bg-amber-100 p-3 rounded-full text-[#B91C1C]">
           <MapPin size={24} />
         </div>
         <div>
           <h3 className={`font-bold text-lg text-[#B91C1C] ${lang === 'te' ? 'telugu-font' : ''}`}>{t.location}</h3>
           <p className="text-amber-900 leading-relaxed mt-1">
             D.No: 8/20, Post Office Street,<br/>
             Indrapalem, Kakinada
           </p>
         </div>
       </Card>

       <Card className="flex items-start gap-4">
         <div className="bg-amber-100 p-3 rounded-full text-[#B91C1C]">
           <Phone size={24} />
         </div>
         <div className="w-full">
           <h3 className={`font-bold text-lg text-[#B91C1C] ${lang === 'te' ? 'telugu-font' : ''}`}>{t.callUs}</h3>
           <div className="flex flex-col gap-2 mt-2 w-full">
             <PhoneLink number="7013285122" />
             <PhoneLink number="9848368993" />
             <PhoneLink number="9912745744" />
           </div>
         </div>
       </Card>

       <Card>
         <h3 className={`font-bold text-lg text-[#B91C1C] mb-3 ${lang === 'te' ? 'telugu-font' : ''}`}>{t.visitingHours}</h3>
         <div className="flex justify-between items-center text-amber-900 border-b border-orange-100 pb-2 mb-2">
            <span className="flex items-center gap-2"><Sun size={18} className="text-amber-500"/> {t.morning}</span>
            <span className="font-bold text-green-700"><CheckCircle size={16}/></span>
         </div>
         <div className="flex justify-between items-center text-amber-900">
            <span className="flex items-center gap-2"><Moon size={18} className="text-indigo-500"/> {t.evening}</span>
             <span className="font-bold text-green-700"><CheckCircle size={16}/></span>
         </div>
       </Card>
       
       {/* QR Code */}
       <Card className="bg-white border-2 border-indigo-600 text-center overflow-hidden">
          <div className="bg-indigo-600 text-white py-2 font-bold mb-4 uppercase tracking-wider text-sm flex items-center justify-center gap-2">
            <ScanLine size={18} />
            UPI Payment
          </div>
          <div className="w-56 h-56 bg-white mx-auto p-1 flex items-center justify-center border border-gray-200 rounded-lg">
             <img src={QR_CODE_URL} alt="Payment QR" className="w-full h-full object-contain" />
          </div>
          <div className="mt-4 text-left px-4">
             <p className="text-xs text-gray-500 uppercase font-bold">{t.phonePeNumbers}:</p>
             <p className="text-indigo-900 font-bold text-lg">70132 85122</p>
             <p className="text-indigo-900 font-bold text-lg">93903 58053</p>
          </div>
       </Card>
    </div>
  );
};

const BookingView = ({ lang }: { lang: Language }) => {
  const [date, setDate] = useState('');
  const [service, setService] = useState(SERVICES_LIST[0]);
  const [submitted, setSubmitted] = useState(false);
  const t = TRANSLATIONS[lang];

  const handleSubmit = () => {
    if(!date) return alert(lang === 'en' ? "Please select a date" : "దయచేసి తేదీని ఎంచుకోండి");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="p-4 space-y-6 animate-fade-in pb-32">
      <SectionTitle lang={lang}>{t.bookConsult}</SectionTitle>

      {submitted ? (
        <Card className="bg-green-50 border-green-200 text-center py-8">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-green-800">{t.reqSent}</h3>
          <p className="text-green-700 mt-2">{t.reqDesc}</p>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <label className={`block text-sm font-bold text-amber-800 mb-2 ${lang === 'te' ? 'telugu-font' : ''}`}>{t.selectService}</label>
            <select 
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full p-3 bg-orange-50 border border-amber-200 rounded-lg text-amber-900 focus:outline-none focus:border-[#B91C1C]"
            >
              {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Card>

          <Card>
            <label className={`block text-sm font-bold text-amber-800 mb-2 ${lang === 'te' ? 'telugu-font' : ''}`}>{t.selectDate}</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-3 text-amber-500" size={20}/>
              <input 
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 p-3 bg-orange-50 border border-amber-200 rounded-lg text-amber-900 focus:outline-none focus:border-[#B91C1C]"
              />
            </div>
            <p className="text-xs text-amber-600 mt-2 italic">{lang === 'en' ? "* Time will be confirmed by Guruji" : "* సమయం గురువు గారిచే నిర్ధారించబడుతుంది"}</p>
          </Card>
          
          <Card className="border-indigo-200 bg-indigo-50">
             <h3 className={`font-bold text-indigo-900 mb-2 text-center ${lang === 'te' ? 'telugu-font' : ''}`}>{t.consultationFee}</h3>
             <div className="w-48 h-48 mx-auto bg-white border-2 border-indigo-400 rounded-lg p-2 flex items-center justify-center relative">
                 <img src={QR_CODE_URL} alt="Payment QR" className="w-full h-full object-contain" />
             </div>
             <div className="mt-3 text-center">
               <p className="text-xs text-indigo-700 font-bold">PhonePe / GPay:</p>
               <p className="text-indigo-900 font-bold">70132 85122 / 93903 58053</p>
             </div>
          </Card>

          <button 
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-[#B91C1C] to-red-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transition-all"
          >
            {t.confirmBook}
          </button>
        </div>
      )}
    </div>
  );
};

const ProfileView = ({ user, onLogout, lang }: { user: User, onLogout: () => void, lang: Language }) => {
  const t = TRANSLATIONS[lang];
  return (
    <div className="p-4 space-y-6 animate-fade-in">
       <SectionTitle lang={lang}>{t.myProfile}</SectionTitle>
       
       <div className="flex flex-col items-center py-6">
          <div className="w-24 h-24 bg-[#B91C1C] rounded-full flex items-center justify-center text-amber-100 text-3xl font-bold mb-3 border-4 border-amber-300 shadow-lg overflow-hidden">
             {/* If user had an image, we'd show it, else initial */}
             {user.name.charAt(0)}
          </div>
          <h2 className="text-xl font-bold text-amber-900">{user.name}</h2>
          <p className="text-amber-700">{user.phone}</p>
       </div>

       <div className="space-y-3">
         <button className="w-full flex items-center justify-between p-4 bg-white border border-amber-200 rounded-xl shadow-sm hover:bg-amber-50">
           <div className="flex items-center gap-3">
             <div className="bg-amber-100 p-2 rounded-lg text-[#B91C1C]"><UserIcon size={20}/></div>
             <span className="font-medium text-amber-900">{t.personalDet}</span>
           </div>
           <ChevronRight size={20} className="text-amber-400" />
         </button>

         <button className="w-full flex items-center justify-between p-4 bg-white border border-amber-200 rounded-xl shadow-sm hover:bg-amber-50">
           <div className="flex items-center gap-3">
             <div className="bg-amber-100 p-2 rounded-lg text-[#B91C1C]"><CalendarIcon size={20}/></div>
             <span className="font-medium text-amber-900">{t.myBookings}</span>
           </div>
           <ChevronRight size={20} className="text-amber-400" />
         </button>

         <button onClick={onLogout} className="w-full flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl mt-6 text-[#B91C1C] font-bold">
            <LogOut size={20} />
            {t.signOut}
         </button>
       </div>
    </div>
  );
};

// --- API Driven Views ---

const DailyHoroscopeView = ({ lang }: { lang: Language }) => {
  const [sign, setSign] = useState(ZODIAC_SIGNS[0]);
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    fetchPrediction();
  }, [sign, lang]); // Refetch when language or sign changes

  const fetchPrediction = async () => {
    setLoading(true);
    const result = await getDailyHoroscope(sign, lang);
    setPrediction(result);
    setLoading(false);
  };

  return (
    <div className="p-4 space-y-6">
      <SectionTitle lang={lang}>{t.dailyHoroscope}</SectionTitle>
      
      <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide">
        {ZODIAC_SIGNS.map(s => (
          <button
            key={s}
            onClick={() => setSign(s)}
            className={`flex-shrink-0 px-6 py-2 rounded-full border-2 text-sm font-bold transition-all ${
              sign === s 
              ? 'bg-[#B91C1C] text-white border-[#B91C1C] shadow-lg scale-105' 
              : 'bg-white text-amber-900 border-amber-200 hover:border-amber-400'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <Card className="bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] min-h-[200px] flex flex-col justify-center border-amber-300">
        <h3 className="text-2xl font-bold text-center text-[#B91C1C] mb-4 heading-font">{sign}</h3>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="prose text-amber-900 text-center leading-relaxed font-medium">
             {prediction}
          </div>
        )}
      </Card>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-amber-100 p-4 rounded-xl text-center border border-amber-200">
           <div className="text-xs text-amber-600 uppercase font-bold tracking-wider mb-1">{t.luckyColor}</div>
           <div className="font-bold text-amber-900 text-lg">Saffron</div>
        </div>
        <div className="bg-amber-100 p-4 rounded-xl text-center border border-amber-200">
           <div className="text-xs text-amber-600 uppercase font-bold tracking-wider mb-1">{t.luckyNumber}</div>
           <div className="font-bold text-amber-900 text-lg">9</div>
        </div>
      </div>
    </div>
  );
};

const KundaliView = ({ lang }: { lang: Language }) => {
  const [formData, setFormData] = useState({ name: '', dob: '', time: '', place: '' });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const t = TRANSLATIONS[lang];

  const handleGenerate = async () => {
    if (!formData.name || !formData.dob) return;
    setLoading(true);
    const analysis = await getKundaliAnalysis(formData.name, formData.dob, formData.time, formData.place, lang);
    setResult(analysis);
    setLoading(false);
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <SectionTitle lang={lang}>{t.kundali}</SectionTitle>
      
      {!result ? (
        <div className="space-y-4">
          <Card>
            <input 
              placeholder={t.fullName}
              className="w-full p-3 mb-3 bg-orange-50 border border-amber-200 rounded-lg text-amber-900 focus:border-[#B91C1C] outline-none"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input 
                type="date"
                className="w-full p-3 bg-orange-50 border border-amber-200 rounded-lg text-amber-900 focus:border-[#B91C1C] outline-none"
                onChange={(e) => setFormData({...formData, dob: e.target.value})}
              />
              <input 
                type="time"
                className="w-full p-3 bg-orange-50 border border-amber-200 rounded-lg text-amber-900 focus:border-[#B91C1C] outline-none"
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              />
            </div>
            <input 
              placeholder={t.pob}
              className="w-full p-3 bg-orange-50 border border-amber-200 rounded-lg text-amber-900 focus:border-[#B91C1C] outline-none"
              onChange={(e) => setFormData({...formData, place: e.target.value})}
            />
          </Card>
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-[#B91C1C] text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-red-800 transition-colors"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Star size={18} /> {t.genChart}</>}
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
           <Card className="bg-amber-50 border-amber-300">
              <h3 className="text-xl font-bold text-[#B91C1C] mb-4 border-b border-amber-200 pb-2">Birth Chart Analysis</h3>
              <div className="prose text-sm text-amber-900 leading-relaxed whitespace-pre-wrap">
                {result}
              </div>
           </Card>
           <button 
            onClick={() => setResult('')}
            className="w-full bg-white text-[#B91C1C] border-2 border-[#B91C1C] py-3 rounded-xl font-bold"
          >
            Generate Another
          </button>
        </div>
      )}
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setView] = useState<View>(View.HOME);
  const [lang, setLang] = useState<Language>('en');

  // Load user from local storage mock
  useEffect(() => {
    const savedUser = localStorage.getItem('astro_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('astro_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('astro_user');
  };

  if (!user) return <LoginScreen onLogin={handleLogin} lang={lang} setLang={setLang} />;

  const renderView = () => {
    switch (currentView) {
      case View.HOME: return <HomeView lang={lang} />;
      case View.HOROSCOPE: return <DailyHoroscopeView lang={lang} />;
      case View.KUNDALI: return <KundaliView lang={lang} />;
      case View.BOOKING: return <BookingView lang={lang} />;
      case View.YATRA: return <YatraView lang={lang} />; // Added Yatra view explicitly if needed in nav, or accessed via home
      case View.CONTACT: return <ContactView lang={lang} />;
      case View.PROFILE: return <ProfileView user={user} onLogout={handleLogout} lang={lang} />;
      default: return <HomeView lang={lang} />;
    }
  };

  return (
    <Layout>
      <Header 
        onProfileClick={() => setView(View.PROFILE)} 
        language={lang}
        setLanguage={setLang}
        title={TRANSLATIONS[lang].appTitle}
      />
      <div className="flex-1 overflow-y-auto pb-20">
        {renderView()}
      </div>
      <Navigation currentView={currentView} setView={setView} lang={lang} />
    </Layout>
  );
};

export default App;