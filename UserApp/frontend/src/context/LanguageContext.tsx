import React, { createContext, useContext, useState } from 'react';

export type SupportedLanguage = 'en' | 'or' | 'hi' | 'mr';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English (IN)', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ (Odia)', flag: '🌾' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी (Hindi)', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी (Marathi)', flag: '🚩' },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    appName: 'MandiKart',
    searchPlaceholder: 'Search fresh vegetables, fruits & grains...',
    deliveryLocation: 'Delivery Location',
    autoDetectGps: 'Auto-Detect GPS',
    addNewAddress: 'Add New Address',
    consumerMode: 'Household / Retail',
    bulkMode: 'Hotel & Bulk Buyer',
    categories: 'Categories',
    viewAll: 'See All',
    freshVegetables: 'Fresh Vegetables',
    summerFruits: 'Summer Fruits',
    organicProduce: 'Organic Produce',
    grainsAndPulses: 'Grains & Pulses',
    home: 'Home',
    cart: 'Cart',
    orders: 'Orders',
    profile: 'Profile',
    negotiations: 'Negotiations',
    appLanguage: 'App Language',
    selectLanguage: 'Select Language 🌐',
    chooseLanguage: 'Choose your preferred app language:',
    settings: 'Settings',
    realtimeTracking: 'REALTIME WS',
    escrowProtected: 'Stripe Escrow Protected',
    orderStatusPlaced: 'Order Placed',
    orderStatusConfirmed: 'Farm Confirmed & Packed',
    orderStatusPickup: 'Logistics Pickup',
    orderStatusTransit: 'Picked Up & In Transit',
    orderStatusDelivered: 'Delivered (OTP Verified)',
    orderStatusCompleted: 'Completed',
    escrowHeldMsg: 'Payment held safely in Stripe Escrow until delivery is confirmed.',
    escrowReleasedMsg: 'Payment released to farmer account upon delivery OTP verification.',
    smsNotification: 'SMS Verification Active',
  },
  or: {
    appName: 'ମଣ୍ଡିକାର୍ଟ',
    searchPlaceholder: 'ସତେଜ ପନିପରିବା, ଫଳ ଓ ଶସ୍ୟ ଖୋଜନ୍ତୁ...',
    deliveryLocation: 'ବିତରଣ ସ୍ଥାନ',
    autoDetectGps: 'ଲାଇଭ୍ GPS ଚିହ୍ନଟ କରନ୍ତୁ',
    addNewAddress: 'ନୂଆ ଠିକଣା ଯୋଡନ୍ତୁ',
    consumerMode: 'ଖୁଚୁରା କ୍ରେତା',
    bulkMode: 'ପାଇକାରୀ ବ୍ୟବସାୟୀ',
    categories: 'ବର୍ଗସମୂହ',
    viewAll: 'ସମସ୍ତ ଦେଖନ୍ତୁ',
    freshVegetables: 'ସତେଜ ପନିପରିବା',
    summerFruits: 'ଋତୁକାଳୀନ ଫଳ',
    organicProduce: 'ଜୈବିକ ଉତ୍ପାଦ',
    grainsAndPulses: 'ଶସ୍ୟ ଏବଂ ଡାଲି',
    home: 'ମୂଳପୃଷ୍ଠା',
    cart: 'ଟୋକେଇ',
    orders: 'ମୋର ଅର୍ଡର',
    profile: 'ପ୍ରୋଫାଇଲ୍',
    negotiations: 'ଦରକଷାକଷି',
    appLanguage: 'ଆପ୍ ଭାଷା',
    selectLanguage: 'ଭାଷା ବାଛନ୍ତୁ 🌐',
    chooseLanguage: 'ଆପଣଙ୍କ ପସନ୍ଦର ଭାଷା ବାଛନ୍ତୁ:',
    settings: 'ସେଟିଙ୍ଗ୍ସ',
    realtimeTracking: 'ଲାଇଭ୍ ଟ୍ରାକିଂ',
    escrowProtected: 'ଷ୍ଟ୍ରାଇପ୍ ସୁରକ୍ଷିତ ଏସ୍କ୍ରୋ ଗ୍ୟାରେଣ୍ଟି',
    orderStatusPlaced: 'ଅର୍ଡର ଗ୍ରହଣ ହୋଇଛି',
    orderStatusConfirmed: 'ଫାର୍ମ ନିଶ୍ଚିତ ଓ ପ୍ୟାକ୍ ହୋଇଛି',
    orderStatusPickup: 'ଲଜିଷ୍ଟିକ୍ସ ପିକଅପ୍ ସଫଳ',
    orderStatusTransit: 'ଡେଲିଭରୀ ରାସ୍ତାରେ ଅଛି',
    orderStatusDelivered: 'ବିତରଣ ସଫଳ ହେଲା (OTP ଯାଞ୍ଚ)',
    orderStatusCompleted: 'ସମ୍ପୂର୍ଣ୍ଣ ସମାପ୍ତ',
    escrowHeldMsg: 'ବିତରଣ ସୁନିଶ୍ଚିତ ନହେବା ପର୍ଯ୍ୟନ୍ତ ଟଙ୍କା ଷ୍ଟ୍ରାଇପ୍ ଏସ୍କ୍ରୋରେ ସୁରକ୍ଷିତ ରହିଛି।',
    escrowReleasedMsg: 'ଡେଲିଭରୀ OTP ଯାଞ୍ଚ ପରେ ଚାଷୀଙ୍କ ବ୍ୟାଙ୍କ ଖାତାକୁ ଟଙ୍କା ପଠାଯାଇଛି।',
    smsNotification: 'SMS ଯାଞ୍ଚ ସକ୍ରିୟ',
  },
  hi: {
    appName: 'मंडीकार्ट',
    searchPlaceholder: 'ताजा सब्जियां, फल और अनाज खोजें...',
    deliveryLocation: 'डिलीवरी का पता',
    autoDetectGps: 'लाइव जीपीएस का उपयोग करें',
    addNewAddress: 'नया पता जोड़ें',
    consumerMode: 'उपभोक्ता / खुदरा',
    bulkMode: 'थोक खरीदार',
    categories: 'श्रेणियां',
    viewAll: 'सभी देखें',
    freshVegetables: 'ताजी सब्जियां',
    summerFruits: 'मौसमी फल',
    organicProduce: 'जैविक उत्पाद',
    grainsAndPulses: 'अनाज और दालें',
    home: 'होम',
    cart: 'कार्ट',
    orders: 'ऑर्डर',
    profile: 'प्रोफाइल',
    negotiations: 'मूलभाव',
    appLanguage: 'ऐप की भाषा',
    selectLanguage: 'भाषा चुनें 🌐',
    chooseLanguage: 'अपनी पसंदीदा भाषा चुनें:',
    settings: 'सेटिंग्स',
    realtimeTracking: 'लाइव ट्रैकिंग',
    escrowProtected: 'स्ट्राइप सुरक्षित एस्क्रो गारंटी',
    orderStatusPlaced: 'ऑर्डर दिया गया',
    orderStatusConfirmed: 'खेत से पैक व स्वीकृत',
    orderStatusPickup: 'लॉजिस्टिक्स पिकअप पूरा',
    orderStatusTransit: 'रास्ते में है',
    orderStatusDelivered: 'डिलीवर हो गया (ओटीपी सत्यापित)',
    orderStatusCompleted: 'सफलतापूर्वक पूर्ण',
    escrowHeldMsg: 'डिलीवरी होने तक भुगतान सुरक्षित एस्क्रो खाते में जमा है।',
    escrowReleasedMsg: 'डिलीवरी ओटीपी सत्यापन के बाद किसान के खाते में राशि जारी की गई।',
    smsNotification: 'एसएमएस सत्यापन सक्रिय',
  },
  mr: {
    appName: 'मंडीकार्ट',
    searchPlaceholder: 'ताजी भाजीपाला, फळे आणि धान्य शोधा...',
    deliveryLocation: 'डिलिव्हरी पत्ता',
    autoDetectGps: 'थेट GPS शोधा',
    addNewAddress: 'नवीन पत्ता जोडा',
    consumerMode: 'ग्राहक / किरकोळ',
    bulkMode: 'घाऊक खरेदीदार',
    categories: 'वर्गवारी',
    viewAll: 'सर्व पहा',
    freshVegetables: 'ताजी भाजीपाला',
    summerFruits: 'हंगामी फळे',
    organicProduce: 'सेंद्रिय उत्पादने',
    grainsAndPulses: 'धान्य व डाळी',
    home: 'मुख्यपृष्ठ',
    cart: 'कार्ट',
    orders: 'ऑर्डर्स',
    profile: 'प्रोफाइल',
    negotiations: 'किंमत चर्चा',
    appLanguage: 'अ‍ॅप भाषा',
    selectLanguage: 'भाषा निवडा 🌐',
    chooseLanguage: 'आपली पसंतीची भाषा निवडा:',
    settings: 'सेटिंग्ज',
    realtimeTracking: 'थेट ट्रॅकिंग',
    escrowProtected: 'स्ट्राइप सुरक्षित एस्क्रो खात्री',
    orderStatusPlaced: 'ऑर्डर नोंदवली',
    orderStatusConfirmed: 'शेतकऱ्याने पॅक व स्वीकारली',
    orderStatusPickup: 'लॉजिस्टिक्स पिकअप पूर्ण',
    orderStatusTransit: 'मार्गावर आहे',
    orderStatusDelivered: 'डिलिव्हर झाले (OTP पडताळणी)',
    orderStatusCompleted: 'यशस्वीरीत्या पूर्ण',
    escrowHeldMsg: 'डिलिव्हरी होईपर्यंत पेमेंट सुरक्षित एस्क्रो खात्यात ठेवले आहे.',
    escrowReleasedMsg: 'डिलिव्हरी OTP पडताळणीनंतर शेतकऱ्याच्या बँक खात्यात रक्कम पाठवली.',
    smsNotification: 'SMS पडताळणी सक्रिय',
  },
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
  languageOptions: LanguageOption[];
  currentLanguageOption: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key, fallback) => fallback || key,
  languageOptions: LANGUAGE_OPTIONS,
  currentLanguageOption: LANGUAGE_OPTIONS[0],
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  const setLanguage = (newLang: SupportedLanguage) => {
    setLanguageState(newLang);
  };

  const t = (key: string, fallback?: string): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (dict[key]) return dict[key];
    const enDict = TRANSLATIONS.en;
    if (enDict[key]) return enDict[key];
    return fallback || key;
  };

  const currentLanguageOption =
    LANGUAGE_OPTIONS.find((opt) => opt.code === language) || LANGUAGE_OPTIONS[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        languageOptions: LANGUAGE_OPTIONS,
        currentLanguageOption,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
