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
  firstNameLabel: string;
  middleNameLabel: string;
  lastNameLabel: string;
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

  // Home Screen
  namaste: string;
  whatSellToday: string;
  findBestBuyers: string;
  addProduce: string;
  todayGlance: string;
  activeOrders: string;
  pickupSchedule: string;
  monthlyEarning: string;
  tomorrow: string;
  bestOpportunity: string;
  viewAll: string;
  estimatedNetReturn: string;
  sellingPrice: string;
  transportCost: string;
  demand: string;
  highDemand: string;
  recommended: string;

  // Produce Screen
  myProduce: string;
  manageCropsOffers: string;
  totalValue: string;
  totalQuantity: string;
  sold: string;
  listCropGetOffers: string;
  available: string;
  listed: string;
  partiallySold: string;
  buyersFound: string;
  viewOptions: string;
  edit: string;

  // Sell Screen
  whatWantToSell: string;
  quantityKg: string;
  qualityGrade: string;
  nashikMarket: string;
  activeBuyers: string;
  topMatchForYou: string;
  findBestSellingOptions: string;
  addNew: string;
  addAnotherCrop: string;

  // Orders Screen
  myOrders: string;
  trackSalesPickup: string;
  all: string;
  active: string;
  pending: string;
  completed: string;
  activeOrder: string;
  orderValue: string;
  trackVehicleLive: string;
  invoice: string;
  pendingOffer: string;
  waitingBuyerResponse: string;
  cancelRequest: string;
  modifyOffer: string;
  relistProduce: string;

  // More Screen
  moreTitle: string;
  moreSubtitle: string;
  profileComplete: string;
  viewProfile: string;
  yourAccount: string;
  appSettings: string;
  helpSupport: string;
  logout: string;
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
    firstNameLabel: 'First Name',
    middleNameLabel: 'Middle Name (Optional)',
    lastNameLabel: 'Last Name',
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

    // Home Screen
    namaste: 'Namaste',
    whatSellToday: 'What do you want to\nsell today?',
    findBestBuyers: 'Find best buyers and get\nbetter returns',
    addProduce: 'Add Produce',
    todayGlance: 'Today at a Glance',
    activeOrders: 'Active\nOrders',
    pickupSchedule: 'Pickup\nSchedule',
    monthlyEarning: 'Monthly\nEarning',
    tomorrow: 'Tomorrow',
    bestOpportunity: 'Best Opportunity for You',
    viewAll: 'View all',
    estimatedNetReturn: 'Estimated Net Return',
    sellingPrice: 'Selling Price',
    transportCost: 'Transport Cost',
    demand: 'Demand',
    highDemand: 'High',
    recommended: 'RECOMMENDED',

    // Produce Screen
    myProduce: 'My Produce',
    manageCropsOffers: 'Manage crops, active listings & buyer offers',
    totalValue: 'TOTAL VALUE',
    totalQuantity: 'TOTAL QUANTITY',
    sold: 'SOLD',
    listCropGetOffers: 'List your crop and get best buyer offers',
    available: 'Available',
    listed: 'Listed',
    partiallySold: 'PARTIALLY SOLD',
    buyersFound: 'buyers found',
    viewOptions: 'VIEW BEST OPTIONS',
    edit: 'Edit',

    // Sell Screen
    whatWantToSell: 'What do you want to sell?',
    quantityKg: 'Quantity (KG)',
    qualityGrade: 'Quality Grade',
    nashikMarket: 'Nashik Market',
    activeBuyers: 'active buyers',
    topMatchForYou: 'TOP MATCH FOR YOU',
    findBestSellingOptions: 'FIND BEST SELLING OPTIONS',
    addNew: 'Add\nNew',
    addAnotherCrop: 'Add Another Crop',

    // Orders Screen
    myOrders: 'My Orders',
    trackSalesPickup: 'Track sales, pickup schedules & payouts',
    all: 'All',
    active: 'Active',
    pending: 'Pending',
    completed: 'Completed',
    activeOrder: 'ACTIVE ORDER',
    orderValue: 'Order Value',
    trackVehicleLive: 'Track Vehicle Live',
    invoice: 'Invoice',
    pendingOffer: 'PENDING OFFER',
    waitingBuyerResponse: 'Waiting for Buyer Response',
    cancelRequest: 'Cancel Request',
    modifyOffer: 'Modify Offer',
    relistProduce: 'Re-list Produce',

    // More Screen
    moreTitle: 'More',
    moreSubtitle: 'Manage your account, farm and preferences',
    profileComplete: 'Profile Complete',
    viewProfile: 'View Profile',
    yourAccount: 'Your Account',
    appSettings: 'App Settings',
    helpSupport: 'Help & Support',
    logout: 'Log Out',
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
    firstNameLabel: 'पहला नाम',
    middleNameLabel: 'मध्य नाम (वैकल्पिक)',
    lastNameLabel: 'अंतिम नाम',
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

    // Home Screen
    namaste: 'नमस्ते',
    whatSellToday: 'आज आप क्या\nबेचना चाहते हैं?',
    findBestBuyers: 'सर्वोत्तम खरीदार खोजें और\nअधिक लाभ कमाएं',
    addProduce: 'उपज जोड़ें',
    todayGlance: 'आज की मुख्य झलक',
    activeOrders: 'सक्रिय\nऑर्डर',
    pickupSchedule: 'पिकअप\nशेड्यूल',
    monthlyEarning: 'मासिक\nकमाई',
    tomorrow: 'कल',
    bestOpportunity: 'आपके लिए सर्वोत्तम अवसर',
    viewAll: 'सभी देखें',
    estimatedNetReturn: 'अनुमानित शुद्ध आय',
    sellingPrice: 'विक्रय मूल्य',
    transportCost: 'परिवहन लागत',
    demand: 'मांग',
    highDemand: 'उच्च',
    recommended: 'सुझाया गया',

    // Produce Screen
    myProduce: 'मेरी उपज',
    manageCropsOffers: 'फसलें, लिस्टिंग और खरीदार ऑफर प्रबंधित करें',
    totalValue: 'कुल मूल्य',
    totalQuantity: 'कुल मात्रा',
    sold: 'बिका हुआ',
    listCropGetOffers: 'अपनी फसल सूचीबद्ध करें और सर्वोत्तम ऑफर प्राप्त करें',
    available: 'उपलब्ध',
    listed: 'सूचीबद्ध',
    partiallySold: 'आंशिक बिका',
    buyersFound: 'खरीदार मिले',
    viewOptions: 'सर्वोत्तम विकल्प देखें',
    edit: 'संपादित करें',

    // Sell Screen
    whatWantToSell: 'आप क्या बेचना चाहते हैं?',
    quantityKg: 'मात्रा (किग्रा)',
    qualityGrade: 'गुणवत्ता ग्रेड',
    nashikMarket: 'नासिक मंडी बाजार',
    activeBuyers: 'सक्रिय खरीदार',
    topMatchForYou: 'सर्वश्रेष्ठ मैच आपके लिए',
    findBestSellingOptions: 'सर्वोत्तम बिक्री विकल्प खोजें',
    addNew: 'नया\nजोड़ें',
    addAnotherCrop: 'अन्य फसल जोड़ें',

    // Orders Screen
    myOrders: 'मेरे ऑर्डर',
    trackSalesPickup: 'बिक्री, पिकअप शेड्यूल और भुगतान ट्रैक करें',
    all: 'सभी',
    active: 'सक्रिय',
    pending: 'लंबित',
    completed: 'पूर्ण',
    activeOrder: 'सक्रिय ऑर्डर',
    orderValue: 'ऑर्डर मूल्य',
    trackVehicleLive: 'वाहन लाइव ट्रैक करें',
    invoice: 'चालान (इनवॉइस)',
    pendingOffer: 'लंबित प्रस्ताव',
    waitingBuyerResponse: 'खरीदार की प्रतिक्रिया की प्रतीक्षा',
    cancelRequest: 'अनुरोध रद्द करें',
    modifyOffer: 'प्रस्ताव बदलें',
    relistProduce: 'उपज पुनः सूचीबद्ध करें',

    // More Screen
    moreTitle: 'अधिक',
    moreSubtitle: 'अपना खाता, खेत और प्राथमिकताएं प्रबंधित करें',
    profileComplete: 'प्रोफ़ाइल पूर्ण',
    viewProfile: 'प्रोफ़ाइल देखें',
    yourAccount: 'आपका खाता',
    appSettings: 'ऐप सेटिंग्स',
    helpSupport: 'सहायता एवं समर्थन',
    logout: 'लॉग आउट',
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
    firstNameLabel: 'ପ୍ରଥମ ନାମ',
    middleNameLabel: 'ମଝି ନାମ (ଇଚ୍ଛାଧୀନ)',
    lastNameLabel: 'ଶେଷ ନାମ (ସାଙ୍ଗିଆ)',
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

    // Home Screen
    namaste: 'ନମସ୍କାର',
    whatSellToday: 'ଆଜି ଆପଣ କଣ\nବିକ୍ରି କରିବାକୁ ଚାହାଁନ୍ତି?',
    findBestBuyers: 'ଉତ୍ତମ କ୍ରେତା ଖୋଜନ୍ତୁ ଏବଂ\nଅଧିକ ଲାଭ ପାଆନ୍ତୁ',
    addProduce: 'ଫସଲ ଯୋଡ଼ନ୍ତୁ',
    todayGlance: 'ଆଜିର ମୁଖ୍ୟ ବିବରଣୀ',
    activeOrders: 'ଚାଲୁଥିବା\nଅର୍ଡର',
    pickupSchedule: 'ପିକଅପ୍\nସମୟସାରଣୀ',
    monthlyEarning: 'ମାସିକ\nଆୟ',
    tomorrow: 'ଆସନ୍ତାକାଲି',
    bestOpportunity: 'ଆପଣଙ୍କ ପାଇଁ ସର୍ବୋତ୍ତମ ସୁଯୋଗ',
    viewAll: 'ସବୁ ଦେଖନ୍ତୁ',
    estimatedNetReturn: 'ଆନୁମାନିକ ନିଟ୍ ମୂଲ୍ୟ',
    sellingPrice: 'ବିକ୍ରି ମୂଲ୍ୟ',
    transportCost: 'ପରିବହନ ଖର୍ଚ୍ଚ',
    demand: 'ଚାହିଦା',
    highDemand: 'ଅଧିକ',
    recommended: 'ପ୍ରସ୍ତାବିତ',

    // Produce Screen
    myProduce: 'ମୋର ଫସଲ',
    manageCropsOffers: 'ଫସଲ, ସୂଚୀ ଏବଂ କ୍ରେତାଙ୍କ ପ୍ରସ୍ତାବ ପରିଚାଳନା କରନ୍ତୁ',
    totalValue: 'ମୋଟ ମୂଲ୍ୟ',
    totalQuantity: 'ମୋଟ ପରିମାଣ',
    sold: 'ବିକ୍ରି ହୋଇଛି',
    listCropGetOffers: 'ଆପଣଙ୍କ ଫସଲ ଯୋଡ଼ି ଉତ୍ତମ କ୍ରେତା ପ୍ରସ୍ତାବ ପାଆନ୍ତୁ',
    available: 'ଉପଲବ୍ଧ',
    listed: 'ତାଲିକାଭୁକ୍ତ',
    partiallySold: 'ଆଂଶିକ ବିକ୍ରି ହୋଇଛି',
    buyersFound: 'ଜଣ କ୍ରେତା ପ୍ରସ୍ତୁତ',
    viewOptions: 'ସର୍ବୋତ୍ତମ ବିକଳ୍ପ ଦେଖନ୍ତୁ',
    edit: 'ସମ୍ପାଦନ',

    // Sell Screen
    whatWantToSell: 'ଆପଣ କଣ ବିକ୍ରି କରିବାକୁ ଚାହାଁନ୍ତି?',
    quantityKg: 'ପରିମାଣ (କେଜି)',
    qualityGrade: 'ଗୁଣବତ୍ତା ମାନ',
    nashikMarket: 'ମଣ୍ଡି ବଜାର ଦର',
    activeBuyers: 'ଜଣ ସକ୍ରିୟ କ୍ରେତା',
    topMatchForYou: 'ଆପଣଙ୍କ ପାଇଁ ସର୍ବୋତ୍ତମ କ୍ରେତା',
    findBestSellingOptions: 'ସର୍ବୋତ୍ତମ ବିକ୍ରି ବିକଳ୍ପ ଖୋଜନ୍ତୁ',
    addNew: 'ନୂଆ\nଯୋଡ଼ନ୍ତୁ',
    addAnotherCrop: 'ଅନ୍ୟ ଏକ ଫସଲ ଯୋଡ଼ନ୍ତୁ',

    // Orders Screen
    myOrders: 'ମୋର ଅର୍ଡରଗୁଡ଼ିକ',
    trackSalesPickup: 'ବିକ୍ରି, ପିକଅପ୍ ଏବଂ ପେମେଣ୍ଟ ଟ୍ରାକ୍ କରନ୍ତୁ',
    all: 'ସମସ୍ତ',
    active: 'ଚାଲୁଥିବା',
    pending: 'ବାକି ଥିବା',
    completed: 'ସମ୍ପୂର୍ଣ୍ଣ',
    activeOrder: 'ସକ୍ରିୟ ଅର୍ଡର',
    orderValue: 'ଅର୍ଡର ମୂଲ୍ୟ',
    trackVehicleLive: 'ଗାଡ଼ି ଲାଇଭ୍ ଟ୍ରାକ୍ କରନ୍ତୁ',
    invoice: 'ଇନଭଏସ୍',
    pendingOffer: 'ବାକି ଥିବା ପ୍ରସ୍ତାବ',
    waitingBuyerResponse: 'କ୍ରେତାଙ୍କ ଉତ୍ତରକୁ ଅପେକ୍ଷା',
    cancelRequest: 'ଅନୁରୋଧ ବାତିଲ୍ କରନ୍ତୁ',
    modifyOffer: 'ପ୍ରସ୍ତାବ ସଂଶୋଧନ କରନ୍ତୁ',
    relistProduce: 'ଫସଲ ପୁଣି ତାଲିକାଭୁକ୍ତ କରନ୍ତୁ',

    // More Screen
    moreTitle: 'ଅଧିକ',
    moreSubtitle: 'ଆପଣଙ୍କ ଆକାଉଣ୍ଟ, ଫାର୍ମ ଏବଂ ପସନ୍ଦ ପରିଚାଳନା କରନ୍ତୁ',
    profileComplete: 'ପ୍ରୋଫାଇଲ୍ ସମ୍ପୂର୍ଣ୍ଣ',
    viewProfile: 'ପ୍ରୋଫାଇଲ୍ ଦେଖନ୍ତୁ',
    yourAccount: 'ଆପଣଙ୍କ ଆକାଉଣ୍ଟ',
    appSettings: 'ଆପ୍ ସେଟିଂସ',
    helpSupport: 'ସହାୟତା ଏବଂ ସମର୍ଥନ',
    logout: 'ଲଗ୍ ଆଉଟ୍',
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
    firstNameLabel: 'पहिले नाव',
    middleNameLabel: 'मधले नाव (पर्यायी)',
    lastNameLabel: 'आडनाव',
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

    // Home Screen
    namaste: 'नमस्कार',
    whatSellToday: 'आज आपण काय\nविक्री करू इच्छिता?',
    findBestBuyers: 'सर्वोत्तम खरेदीदार शोधा आणि\nजास्त नफा मिळवा',
    addProduce: 'पीक जोडा',
    todayGlance: 'आजचा थोडक्यात आढावा',
    activeOrders: 'सक्रिय\nऑर्डर्स',
    pickupSchedule: 'पिकअप\nवेळापत्रक',
    monthlyEarning: 'मासिक\nकमाई',
    tomorrow: 'उद्या',
    bestOpportunity: 'आपल्यासाठी उत्तम संधी',
    viewAll: 'सर्व पहा',
    estimatedNetReturn: 'अंदाजे निव्वळ परतावा',
    sellingPrice: 'विक्री किंमत',
    transportCost: 'वाहतूक खर्च',
    demand: 'मागणी',
    highDemand: 'उच्च',
    recommended: 'शिफारस केलेले',

    // Produce Screen
    myProduce: 'माझी पिके',
    manageCropsOffers: 'पिके, लिस्टिंग व खरेदीदार ऑफर्स व्यवस्थापित करा',
    totalValue: 'एकूण मूल्य',
    totalQuantity: 'एकूण प्रमाण',
    sold: 'विक्री झालेले',
    listCropGetOffers: 'आपले पीक नोंदवा व सर्वोत्तम ऑफर मिळवा',
    available: 'उपलब्ध',
    listed: 'नोंदणीकृत',
    partiallySold: 'अंशतः विकले',
    buyersFound: 'खरेदीदार उपलब्ध',
    viewOptions: 'सर्वोत्तम पर्याय पहा',
    edit: 'संपादित करा',

    // Sell Screen
    whatWantToSell: 'आपण काय विकू इच्छिता?',
    quantityKg: 'प्रमाण (किलो)',
    qualityGrade: 'गुणवत्ता प्रतवारी',
    nashikMarket: 'नाशिक बाजार भाव',
    activeBuyers: 'सक्रिय खरेदीदार',
    topMatchForYou: 'आपल्यासाठी सर्वोत्तम खरेदीदार',
    findBestSellingOptions: 'सर्वोत्तम विक्री पर्याय शोधा',
    addNew: 'नवीन\nजोडा',
    addAnotherCrop: 'दुसरे पीक जोडा',

    // Orders Screen
    myOrders: 'माझ्या ऑर्डर्स',
    trackSalesPickup: 'विक्री, पिकअप वेळापत्रक आणि पेमेंट्स ट्रॅक करा',
    all: 'सर्व',
    active: 'सक्रिय',
    pending: 'प्रलंबित',
    completed: 'पूर्ण',
    activeOrder: 'सक्रिय ऑर्डर',
    orderValue: 'ऑर्डर मूल्य',
    trackVehicleLive: 'वाहन थेट ट्रॅक करा',
    invoice: 'चालान (इनव्हॉइस)',
    pendingOffer: 'प्रलंबित ऑफर',
    waitingBuyerResponse: 'खरेदीदाराच्या प्रतिसादाची प्रतीक्षा',
    cancelRequest: 'विनंती रद्द करा',
    modifyOffer: 'ऑफर बदला',
    relistProduce: 'पीक पुन्हा लिस्ट करा',

    // More Screen
    moreTitle: 'अधिक',
    moreSubtitle: 'आपले खाते, शेती आणि प्राधान्ये व्यवस्थापित करा',
    profileComplete: 'प्रोफाइल पूर्ण',
    viewProfile: 'प्रोफाइल पहा',
    yourAccount: 'आपले खाते',
    appSettings: 'अॅप सेटिंग्ज',
    helpSupport: 'मदत आणि सहाय्य',
    logout: 'लॉग आउट',
  },

  pa: {} as any,
  ta: {} as any,
  te: {} as any,
  bn: {} as any,
  gu: {} as any,
  kn: {} as any,
};

// Fallback helper for other languages to default cleanly to English
['pa', 'ta', 'te', 'bn', 'gu', 'kn'].forEach((code) => {
  translations[code as LanguageCode] = {
    ...translations.en,
    ...(translations as any)[code],
  };
});
