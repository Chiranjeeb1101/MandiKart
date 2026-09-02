/**
 * MandiKart Farmer App — Multi-language Translations Registry
 * 
 * Supports: English, Hindi, Odia, Marathi, Punjabi, Tamil, Telugu, Bengali, Gujarati, Kannada.
 */

import { LanguageCode } from '@/store/appStore';

export interface TranslationSchema {
  // Welcome Screen
  welcomeTitle: string;
  welcomeSubtitle: string;
  getStarted: string;
  pillYourProduce: string;
  pillMarketOpportunities: string;
  pillDirectBuyers: string;
  typingText1: string;
  typingText2: string;
  typingText3: string;
  typingText4: string;

  // Language Selection Screen
  chooseLanguage: string;
  selectComfortableLang: string;
  continueBtn: string;
  languageNote: string;

  // Auth & Onboarding
  signUpTitle: string;
  loginTitle: string;
  verifyOtpTitle: string;
  farmerProfileTitle: string;
  farmDetailsTitle: string;
  mobileNumberLabel: string;
  fullNameLabel: string;
  villageLabel: string;
  stateLabel: string;
  districtLabel: string;
  cropLabel: string;
  farmSizeLabel: string;
  submitBtn: string;

  // Main Tabs
  tabHome: string;
  tabProduce: string;
  tabSell: string;
  tabOrders: string;
  tabMore: string;
}

export const translations: Record<LanguageCode, TranslationSchema> = {
  en: {
    welcomeTitle: 'Sell Smarter with MandiKart',
    welcomeSubtitle: 'Connect directly with buyers and maximize your agricultural profits.',
    getStarted: 'GET STARTED',
    pillYourProduce: 'Your Produce',
    pillMarketOpportunities: 'Market Rate',
    pillDirectBuyers: 'Direct Buyers',
    typingText1: 'Direct Buyer Connect...',
    typingText2: 'Maximum Price Realization...',
    typingText3: 'Zero Middleman Charges...',
    typingText4: 'Instant Daily Payouts...',

    chooseLanguage: 'Choose Your Language',
    selectComfortableLang: 'Select the language you are most comfortable with',
    continueBtn: 'CONTINUE',
    languageNote: 'You can change your language anytime in Settings.',

    signUpTitle: 'Create Farmer Account',
    loginTitle: 'Welcome Back, Farmer',
    verifyOtpTitle: 'Verify Mobile Number',
    farmerProfileTitle: 'Farmer Profile Details',
    farmDetailsTitle: 'Farm & Crop Details',
    mobileNumberLabel: 'Mobile Number',
    fullNameLabel: 'Full Name',
    villageLabel: 'Village / Town',
    stateLabel: 'State',
    districtLabel: 'District',
    cropLabel: 'Primary Crops',
    farmSizeLabel: 'Farm Size (Acres)',
    submitBtn: 'SUBMIT & CONTINUE',

    tabHome: 'Home',
    tabProduce: 'Produce',
    tabSell: 'Sell Produce',
    tabOrders: 'Orders',
    tabMore: 'More',
  },
  hi: {
    welcomeTitle: 'मंडीकार्ट के साथ समझदारी से बेचें',
    welcomeSubtitle: 'खरीदारों से सीधे जुड़ें और अपनी कृषि आय अधिकतम करें।',
    getStarted: 'शुरू करें',
    pillYourProduce: 'आपकी उपज',
    pillMarketOpportunities: 'बाजार भाव',
    pillDirectBuyers: 'सीधे खरीदार',
    typingText1: 'सीधे खरीदार से जुड़ें...',
    typingText2: 'उपज का अधिकतम मूल्य...',
    typingText3: 'बिचौलियों से मुक्ति...',
    typingText4: 'तुरंत दैनिक भुगतान...',

    chooseLanguage: 'अपनी भाषा चुनें',
    selectComfortableLang: 'वह भाषा चुनें जिसमें आप सबसे सहज हैं',
    continueBtn: 'आगे बढ़ें',
    languageNote: 'आप बाद में सेटिंग्स में अपनी भाषा बदल सकते हैं।',

    signUpTitle: 'किसान खाता बनाएं',
    loginTitle: 'नमस्ते किसान भाई',
    verifyOtpTitle: 'मोबाइल नंबर सत्यापित करें',
    farmerProfileTitle: 'किसान प्रोफ़ाइल विवरण',
    farmDetailsTitle: 'खेत और फसल का विवरण',
    mobileNumberLabel: 'मोबाइल नंबर',
    fullNameLabel: 'पूरा नाम',
    villageLabel: 'गांव / शहर',
    stateLabel: 'राज्य',
    districtLabel: 'जिला',
    cropLabel: 'मुख्य फसलें',
    farmSizeLabel: 'खेत का आकार (एकड़)',
    submitBtn: 'जमा करें और आगे बढ़ें',

    tabHome: 'होम',
    tabProduce: 'उपज',
    tabSell: 'बेचें',
    tabOrders: 'ऑर्डर',
    tabMore: 'अधिक',
  },
  or: {
    welcomeTitle: 'ମଣ୍ଡିକାର୍ଟ ସହିତ ସହଜରେ ବିକ୍ରି କରନ୍ତୁ',
    welcomeSubtitle: 'ସିଧାସଳଖ କ୍ରେତାଙ୍କ ସହ ଯୋଡି ହୁଅନ୍ତୁ ଏବଂ ଅଧିକ ଲାଭ ଅର୍ଜନ କରନ୍ତୁ।',
    getStarted: 'ଆରମ୍ଭ କରନ୍ତୁ',
    pillYourProduce: 'ଆପଣଙ୍କ ଫସଲ',
    pillMarketOpportunities: 'ମଣ୍ଡି ଦର',
    pillDirectBuyers: 'ସିଧାସଳଖ କ୍ରେତା',
    typingText1: 'ସିଧାସଳଖ କ୍ରେତାଙ୍କ ସହ ସଂଯୋଗ...',
    typingText2: 'ଫସଲର ଉଚିତ ମୂଲ୍ୟ...',
    typingText3: 'ଦଲାଲମୁକ୍ତ ସେବା...',
    typingText4: 'ତୁରନ୍ତ ଦୈନିକ ପେମେଣ୍ଟ...',

    chooseLanguage: 'ଆପଣଙ୍କ ଭାଷା ବାଛନ୍ତୁ',
    selectComfortableLang: 'ଆପଣ ସହଜ ମନେ କରୁଥିବା ଭାଷା ଚୟନ କରନ୍ତୁ',
    continueBtn: 'ଆଗକୁ ବଢ଼ନ୍ତୁ',
    languageNote: 'ଆପଣ ପରେ ସେଟିଂସରେ ଭାଷା ବଦଳାଇ ପାରିବେ।',

    signUpTitle: 'କୃଷକ ଆକାଉଣ୍ଟ ଖୋଲନ୍ତୁ',
    loginTitle: 'ସ୍ୱାଗତ କୃଷକ ଭାଇ',
    verifyOtpTitle: 'ମୋବାଇଲ୍ ନମ୍ବର ଯାଞ୍ଚ କରନ୍ତୁ',
    farmerProfileTitle: 'କୃଷକ ପରିଚୟ ବିବରଣୀ',
    farmDetailsTitle: 'ଜମି ଓ ଫସଲ ବିବରଣୀ',
    mobileNumberLabel: 'ମୋବାଇଲ୍ ନମ୍ବର',
    fullNameLabel: 'ପୂରା ନାମ',
    villageLabel: 'ଗାଁ / ସହର',
    stateLabel: 'ରାଜ୍ୟ',
    districtLabel: 'ଜିଲ୍ଲା',
    cropLabel: 'ମୁଖ୍ୟ ଫସଲ',
    farmSizeLabel: 'ଜମିର ପରିମାଣ (ଏକର)',
    submitBtn: 'ଦାଖଲ କରନ୍ତୁ',

    tabHome: 'ହୋମ୍',
    tabProduce: 'ଫସଲ',
    tabSell: 'ବିକ୍ରି କରନ୍ତୁ',
    tabOrders: 'ଅର୍ଡର',
    tabMore: 'ଅଧିକ',
  },
  mr: {
    welcomeTitle: 'मंडीकार्ट सोबत हुशारीने विक्री करा',
    welcomeSubtitle: 'थेट खरेदीदारांशी जोडा आणि आपला शेती नफा वाढवा.',
    getStarted: 'शुरू करा',
    pillYourProduce: 'तुमची पिके',
    pillMarketOpportunities: 'बाजार भाव',
    pillDirectBuyers: 'थेट खरेदीदार',
    typingText1: 'थेट खरेदीदार कनेक्ट...',
    typingText2: 'पिकाचा सर्वाधिक भाव...',
    typingText3: 'मध्यस्थांशिवाय व्यापार...',
    typingText4: 'झटपट दैनिक पेमेंट...',

    chooseLanguage: 'तुमची भाषा निवडा',
    selectComfortableLang: 'तुम्हाला सोयीची वाटणारी भाषा निवडा',
    continueBtn: 'पुढे जा',
    languageNote: 'तुम्ही नंतर सेटिंग्जमध्ये तुमची भाषा बदलू शकता.',

    signUpTitle: 'शेतकरी खाते तयार करा',
    loginTitle: 'नमस्कार शेतकरी मित्र',
    verifyOtpTitle: 'मोबाईल नंबर सत्यापित करा',
    farmerProfileTitle: 'शेतकरी माहिती',
    farmDetailsTitle: 'शेती व पिकांचा तपशील',
    mobileNumberLabel: 'मोबाईल नंबर',
    fullNameLabel: 'पूर्ण नाव',
    villageLabel: 'गाव / शहर',
    stateLabel: 'राज्य',
    districtLabel: 'जिल्हा',
    cropLabel: 'प्रमुख पिके',
    farmSizeLabel: 'शेताचा आकार (एकड)',
    submitBtn: 'सबमिट करा',

    tabHome: 'होम',
    tabProduce: 'पिके',
    tabSell: 'विक्री करा',
    tabOrders: 'ऑर्डर्स',
    tabMore: 'अधिक',
  },
  pa: {
    welcomeTitle: 'ਮੰਡੀਕਾਰਟ ਨਾਲ ਸਮਝਦਾਰੀ ਨਾਲ ਵੇਚੋ',
    welcomeSubtitle: 'ਖਰੀਦਦਾਰਾਂ ਨਾਲ ਸਿੱਧੇ ਜੁੜੋ ਅਤੇ ਆਪਣੀ ਖੇਤੀ ਆਮਦਨ ਵਧਾਓ।',
    getStarted: 'ਸ਼ੁਰੂ ਕਰੋ',
    pillYourProduce: 'ਤੁਹਾਡੀ ਫਸਲ',
    pillMarketOpportunities: 'ਮੰਡੀ ਭਾਅ',
    pillDirectBuyers: 'ਸਿੱਧੇ ਖਰੀਦਦਾਰ',
    typingText1: 'ਸਿੱਧੇ ਖਰੀਦਦਾਰ ਨਾਲ ਜੁੜੋ...',
    typingText2: 'ਫਸਲ ਦਾ ਪੂਰਾ ਮੁੱਲ...',
    typingText3: 'ਬਿਨਾਂ ਵਿਚੋਲੇ ਵਪਾਰ...',
    typingText4: 'ਤੁਰੰਤ ਰੋਜ਼ਾਨਾ ਭੁਗਤਾਨ...',

    chooseLanguage: 'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ',
    selectComfortableLang: 'ਉਹ ਭਾਸ਼ਾ ਚੁਣੋ ਜਿਸ ਵਿੱਚ ਤੁਸੀਂ ਸਹਿਜ ਹੋ',
    continueBtn: 'ਅੱਗੇ ਵਧੋ',
    languageNote: 'ਤੁਸੀਂ ਬਾਅਦ ਵਿੱਚ ਸੈਟਿੰਗਾਂ ਵਿੱਚ ਭਾਸ਼ਾ ਬਦਲ ਸਕਦੇ ਹੋ।',

    signUpTitle: 'ਕਿਸਾਨ ਖਾਤਾ ਬਣਾਓ',
    loginTitle: 'ਜੀ ਆਇਆਂ ਨੂੰ ਕਿਸਾਨ ਵੀਰੋ',
    verifyOtpTitle: 'ਮੋਬਾਈਲ ਨੰਬਰ ਦੀ ਜਾਂਚ ਕਰੋ',
    farmerProfileTitle: 'ਕਿਸਾਨ ਪ੍ਰੋਫਾਈਲ ਵੇਰਵਾ',
    farmDetailsTitle: 'ਖੇਤ ਅਤੇ ਫਸਲ ਦਾ ਵੇਰਵਾ',
    mobileNumberLabel: 'ਮੋਬਾਈਲ ਨੰਬਰ',
    fullNameLabel: 'ਪੂਰਾ ਨਾਮ',
    villageLabel: 'ਪਿੰਡ / ਸ਼ਹਿਰ',
    stateLabel: 'ਸੂਬਾ',
    districtLabel: 'ਜ਼ਿਲ੍ਹਾ',
    cropLabel: 'ਮੁੱਖ ਫਸਲਾਂ',
    farmSizeLabel: 'ਖੇਤ ਦਾ ਆਕਾਰ (ਏਕੜ)',
    submitBtn: 'ਜਮ੍ਹਾਂ ਕਰੋ',

    tabHome: 'ਹੋਮ',
    tabProduce: 'ਫਸਲ',
    tabSell: 'ਵੇਚੋ',
    tabOrders: 'ਆਰਡਰ',
    tabMore: 'ਹੋਰ',
  },
  ta: {
    welcomeTitle: 'மண்டிகார்ட் மூலம் சிறந்த விற்பனை',
    welcomeSubtitle: 'நேரடி வாங்குபவர்களுடன் இணைந்து உங்கள் விவசாய வருமானத்தை உயர்த்துங்கள்.',
    getStarted: 'தொடங்குங்கள்',
    pillYourProduce: 'உங்கள் விளைச்சல்',
    pillMarketOpportunities: 'சந்தை விலை',
    pillDirectBuyers: 'நேரடி வாங்குபவர்',
    typingText1: 'நேரடி வாங்குபவர் இணைப்பு...',
    typingText2: 'உயர்ந்த விற்பனை விலை...',
    typingText3: 'தரகர் இல்லாத வியாபாரம்...',
    typingText4: 'உடனடி தினசரி பணம்...',

    chooseLanguage: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்',
    selectComfortableLang: 'உங்களுக்கு விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்',
    continueBtn: 'தொடரவும்',
    languageNote: 'அமைப்புகளில் உங்கள் மொழியை பின்னர் மாற்றலாம்.',

    signUpTitle: 'விவசாயி கணக்கு তৈরি',
    loginTitle: 'வரவேற்கிறோம் விவசாயி',
    verifyOtpTitle: 'மொபைல் எண்ணை உறுதிசெய்க',
    farmerProfileTitle: 'விவசாயி விவரங்கள்',
    farmDetailsTitle: 'பண்ணை & பயிர் விவரங்கள்',
    mobileNumberLabel: 'மொபைல் எண்',
    fullNameLabel: 'முழு பெயர்',
    villageLabel: 'கிராமம் / நகரம்',
    stateLabel: 'மாநிலம்',
    districtLabel: 'மாவட்டம்',
    cropLabel: 'முக்கிய பயிர்கள்',
    farmSizeLabel: 'பண்ணை அளவு (ஏக்கர்)',
    submitBtn: 'சமர்ப்பிக்கவும்',

    tabHome: 'முகப்பு',
    tabProduce: 'விளைச்சல்',
    tabSell: 'விற்க',
    tabOrders: 'ஆர்டர்கள்',
    tabMore: 'மேலும்',
  },
  te: {
    welcomeTitle: 'మండికార్ట్‌తో తెలివిగా విక్రయించండి',
    welcomeSubtitle: 'నేరుగా కొనుగోలుదారులతో కనెక్ట్ అవ్వండి మరియు మీ లాభాలను పెంచుకోండి.',
    getStarted: 'ప్రారంభించండి',
    pillYourProduce: 'మీ పంట',
    pillMarketOpportunities: 'మార్కెట్ ధరలు',
    pillDirectBuyers: 'నేరుగా కొనుగోలుదారులు',
    typingText1: 'నేరుగా కొనుగోలుదారుల కనెక్ట్...',
    typingText2: 'పంటకు గరిష్ట ధర...',
    typingText3: 'దళారులు లేని వ్యాపారం...',
    typingText4: 'వెంటనే దినసరి చెల్లింపులు...',

    chooseLanguage: 'మీ భాషను ఎంచుకోండి',
    selectComfortableLang: 'మీకు అనుకూలమైన భాషను ఎంచుకోండి',
    continueBtn: 'కొనసాగించండి',
    languageNote: 'మీరు సెట్టింగ్స్ లో భాషను మార్చుకోవచ్చు.',

    signUpTitle: 'రైతు ఖాతా సృష్టించండి',
    loginTitle: 'స్వాగతం రైతు సోదరా',
    verifyOtpTitle: 'మొబైల్ నంబర్ సరిచూడండి',
    farmerProfileTitle: 'రైతు ప్రొఫైల్ వివరాలు',
    farmDetailsTitle: 'పొలం మరియు పంట వివరాలు',
    mobileNumberLabel: 'మొబైల్ నంబర్',
    fullNameLabel: 'పూర్తి పేరు',
    villageLabel: 'గ్రామం / పట్టణం',
    stateLabel: 'రాష్ట్రం',
    districtLabel: 'జిల్లా',
    cropLabel: 'ప్రధాన పంటలు',
    farmSizeLabel: 'పొలం పరిమాణం (ఎకరాలు)',
    submitBtn: 'సమర్పించండి',

    tabHome: 'హోమ్',
    tabProduce: 'పంటలు',
    tabSell: 'అమ్మకం',
    tabOrders: 'ఆర్డర్లు',
    tabMore: 'మరిన్ని',
  },
  bn: {
    welcomeTitle: 'মান্ডিকার্ট দিয়ে বুদ্ধিমত্তার সাথে বিক্রি করুন',
    welcomeSubtitle: 'সরাসরি ক্রেতাদের সাথে যুক্ত হন এবং আপনার কৃষিজ আয় বৃদ্ধি করুন।',
    getStarted: 'শুরু করুন',
    pillYourProduce: 'আপনার ফসল',
    pillMarketOpportunities: 'বাজার দর',
    pillDirectBuyers: 'সরাসরি ক্রেতা',
    typingText1: 'সরাসরি ক্রেতার সাথে সংযোগ...',
    typingText2: 'ফসলের সর্বোচ্চ দাম...',
    typingText3: 'মধ্যস্বত্বভোগীমুক্ত সেবা...',
    typingText4: 'তাৎক্ষণিক দৈনিক পেমেন্ট...',

    chooseLanguage: 'আপনার ভাষা নির্বাচন করুন',
    selectComfortableLang: 'আপনার সুবিধাজনক ভাষা বেছে নিন',
    continueBtn: 'এগিয়ে যান',
    languageNote: 'আপনি পরে সেটিংসে ভাষা পরিবর্তন করতে পারবেন।',

    signUpTitle: 'কৃষক অ্যাকাউন্ট তৈরি করুন',
    loginTitle: 'স্বাগতম কৃষক বন্ধু',
    verifyOtpTitle: 'মোবাইল নম্বর যাচাই করুন',
    farmerProfileTitle: 'কৃষক প্রোফাইল তথ্য',
    farmDetailsTitle: 'জমি ও ফসলের তথ্য',
    mobileNumberLabel: 'মোবাইল নম্বর',
    fullNameLabel: 'সম্পূর্ণ নাম',
    villageLabel: 'গ্রাম / শহর',
    stateLabel: 'রাজ্য',
    districtLabel: 'জেলা',
    cropLabel: 'প্রধান ফসল',
    farmSizeLabel: 'জমির পরিমাণ (একর)',
    submitBtn: 'জমা দিন',

    tabHome: 'হোম',
    tabProduce: 'ফসল',
    tabSell: 'বিক্রি করুন',
    tabOrders: 'অর্ডার',
    tabMore: 'আরও',
  },
  gu: {
    welcomeTitle: 'મંડીકાર્ટ સાથે સમજદારીથી વેચો',
    welcomeSubtitle: 'સીધા ખરીદદારો સાથે જોડાઓ અને તમારી કૃષિ આવક વધારો.',
    getStarted: 'શરૂ કરો',
    pillYourProduce: 'તમારી ઉપજ',
    pillMarketOpportunities: 'બજાર ભાવ',
    pillDirectBuyers: 'સીધા ખરીદદાર',
    typingText1: 'સીધા ખરીદદાર સાથે જોડાણ...',
    typingText2: 'પાકના મહત્તમ ભાવ...',
    typingText3: 'વચેટિયા વગર વેચાણ...',
    typingText4: 'ત્વરિત દૈનિક ચૂકવણી...',

    chooseLanguage: 'તમારી ભાષા પસંદ કરો',
    selectComfortableLang: 'તમને અનુકૂળ ભાષા પસંદ કરો',
    continueBtn: 'આગળ વધો',
    languageNote: 'તમે પછીથી સેટિંગ્સમાં ભાષા બદલી શકો છો.',

    signUpTitle: 'ખેડૂત ખાતું બનાવો',
    loginTitle: 'સ્વાગત છે ખેડૂત મિત્ર',
    verifyOtpTitle: 'મોબાઇલ નંબર ચકાસો',
    farmerProfileTitle: 'ખેડૂત પ્રોફાઇલ વિગત',
    farmDetailsTitle: 'જમીન અને પાક વિગત',
    mobileNumberLabel: 'મોબાઇલ નંબર',
    fullNameLabel: 'પૂરું નામ',
    villageLabel: 'ગામ / શહેર',
    stateLabel: 'રાજ્ય',
    districtLabel: 'જિલ્લો',
    cropLabel: 'મુખ્ય પાક',
    farmSizeLabel: 'જમીનનું માપ (એકર)',
    submitBtn: 'સબમિટ કરો',

    tabHome: 'હોમ',
    tabProduce: 'ઉપજ',
    tabSell: 'વેચો',
    tabOrders: 'ઓર્ડર',
    tabMore: 'વધુ',
  },
  kn: {
    welcomeTitle: 'ಮಂಡಿಕಾರ್ಟ್‌ನೊಂದಿಗೆ ಬುದ್ಧಿವಂತಿಕೆಯಿಂದ ಮಾರಾಟ ಮಾಡಿ',
    welcomeSubtitle: 'ನೇರವಾಗಿ ಖರೀದಿದಾರರೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಿ ಮತ್ತು ನಿಮ್ಮ ಆದಾಯವನ್ನು ಹೆಚ್ಚಿಸಿ.',
    getStarted: 'ಪ್ರಾರಂಭಿಸಿ',
    pillYourProduce: 'ನಿಮ್ಮ ಬೆಳೆ',
    pillMarketOpportunities: 'ಮಾರುಕಟ್ಟೆ ದರ',
    pillDirectBuyers: 'ನೇರ ಖರೀದಿದಾರರು',
    typingText1: 'ನೇರ ಖರೀದಿದಾರರ ಸಂಪರ್ಕ...',
    typingText2: 'ಬೆಳೆಗೆ ಗರಿಷ್ಠ ಬೆಲೆ...',
    typingText3: 'ದಳ್ಳಾಳಿಗಳಿಲ್ಲದ ವ್ಯಾಪಾರ...',
    typingText4: 'ತ್ವರಿತ ದಿನನಿತ್ಯದ ಪಾವತಿ...',

    chooseLanguage: 'ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    selectComfortableLang: 'ನಿಮಗೆ ಅನುಕೂಲಕರವಾದ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    continueBtn: 'ಮುಂದುವರಿಯಿರಿ',
    languageNote: 'ನೀವು ನಂತರ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಬಹುದು.',

    signUpTitle: 'ರೈತ ಖಾತೆ ತೆರೆಯಿರಿ',
    loginTitle: 'ಸ್ವಾಗತ ರೈತ ಮಿತ್ರ',
    verifyOtpTitle: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಪರಿಶೀಲಿಸಿ',
    farmerProfileTitle: 'ರೈತನ ಪ್ರೊಫೈಲ್ ವಿವರಗಳು',
    farmDetailsTitle: 'ಜಮೀನು ಮತ್ತು ಬೆಳೆ ವಿವರಗಳು',
    mobileNumberLabel: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
    fullNameLabel: 'ಪೂರ್ಣ ಹೆಸರು',
    villageLabel: 'ಗ್ರಾಮ / ನಗರ',
    stateLabel: 'ರಾಜ್ಯ',
    districtLabel: 'ಜಿಲ್ಲೆ',
    cropLabel: 'ಮುಖ್ಯ ಬೆಳೆಗಳು',
    farmSizeLabel: 'ಜಮೀನಿನ ಗಾತ್ರ (ಎಕರೆ)',
    submitBtn: 'ಸಲ್ಲಿಸಿ',

    tabHome: 'ಹೋಮ್',
    tabProduce: 'ಬೆಳೆಗಳು',
    tabSell: 'ಮಾರಾಟ',
    tabOrders: 'ಆರ್ಡರ್‌ಗಳು',
    tabMore: 'ಇನ್ನಷ್ಟು',
  },
};
