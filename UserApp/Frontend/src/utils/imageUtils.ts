// ─────────────────────────────────────────────
// MandiKart — Reliable Product Image & Fallback Helper
// Ensures product photos load 100% reliably across Expo iOS/Android & Web
// ─────────────────────────────────────────────

const CATEGORY_FALLBACKS: Record<string, string> = {
  Vegetables: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600',
  Fruits: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600',
  Grains: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600',
  Spices: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600',
  Pulses: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=600',
  Oils: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600',
  Herbs: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=600',
  Poultry: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600',
};

const PRODUCT_SPECIFIC_FALLBACKS: Record<string, string> = {
  'Alphonso Mangoes': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600',
  'Organic Guava (Amrood)': 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600',
  'Fresh Coriander': 'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?w=600',
  'Fresh Mint Leaves (Pudina)': 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=600',
  'Fresh Curry Leaves': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600',
  'Organic Lemongrass': 'https://images.unsplash.com/photo-1515586000433-45406d8e6662?w=600',
  'Coconut Oil': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600',
  'Farm Fresh Eggs': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600',
  'Yellow Moong Dal': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600',
  'Unpolished Toor Dal (Arhar)': 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?w=600',
  'Organic Rajma (Chitra)': 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600',
  'Red Carrots': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600',
  'Basmati Rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600',
  'Fresh Brinjal (Eggplant)': 'https://images.unsplash.com/photo-1613743983387-0b15cfef3ff5?w=600',
};

export function getFallbackProductImage(category?: string, productName?: string): string {
  if (productName && PRODUCT_SPECIFIC_FALLBACKS[productName]) {
    return PRODUCT_SPECIFIC_FALLBACKS[productName];
  }
  if (category && CATEGORY_FALLBACKS[category]) {
    return CATEGORY_FALLBACKS[category];
  }
  return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600';
}
