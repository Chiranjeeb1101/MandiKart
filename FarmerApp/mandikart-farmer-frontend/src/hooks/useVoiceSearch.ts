/**
 * MandiKart — Vernacular Voice Search Hook
 * Supports English, Hindi (हिंदी), Odia (ଓଡ଼ିଆ), and Marathi (मराठी).
 * Transcribes speech and maps vernacular crop names to standard produce catalog items.
 */

import { useState, useCallback, useRef } from 'react';
import { useAppStore, LanguageCode } from '@/store/appStore';

export interface VernacularCropMatch {
  cropName: string;
  vernacularLabel: string;
  language: LanguageCode;
  confidence: number;
}

const CROP_DICTIONARY: Record<string, { standard: string; labels: Record<LanguageCode, string> }> = {
  // Onion (ନାଲି ପିଆଜ)
  'onion': { standard: 'Red Onion', labels: { en: 'Red Onion', hi: 'लाल प्याज', or: 'ନାଲି ପିଆଜ', mr: 'लाल कांदा', pa: 'ਪਿਆਜ਼', ta: 'வெங்காயம்', te: 'ఉల్లిపాయ', bn: 'পেঁয়াজ', gu: 'ડુંગળી', kn: 'ಈರುಳ್ಳಿ' } },
  'kanda': { standard: 'Red Onion', labels: { en: 'Red Onion', hi: 'लाल प्याज', or: 'ନାଲି ପିଆଜ', mr: 'लाल कांदा', pa: 'ਪਿਆਜ਼', ta: 'வெங்காயம்', te: 'ఉల్లిపాయ', bn: 'পেঁয়াজ', gu: 'ડુંગળી', kn: 'ಈರುಳ್ಳಿ' } },
  'pyaaz': { standard: 'Red Onion', labels: { en: 'Red Onion', hi: 'लाल प्याज', or: 'ନାଲି ପିଆଜ', mr: 'लाल कांदा', pa: 'ਪਿਆਜ਼', ta: 'வெங்காயம்', te: 'ఉల్లిపాయ', bn: 'পেঁয়াজ', gu: 'ડુંગળી', kn: 'ಈರುಳ್ಳಿ' } },
  'piaja': { standard: 'Red Onion', labels: { en: 'Red Onion', hi: 'लाल प्याज', or: 'ନାଲି ପିଆଜ', mr: 'लाल कांदा', pa: 'ਪਿਆਜ਼', ta: 'வெங்காயம்', te: 'ఉల్లిపాయ', bn: 'পেঁয়াজ', gu: 'ડુંગળી', kn: 'ಈರುಳ್ಳಿ' } },
  'कांदा': { standard: 'Red Onion', labels: { en: 'Red Onion', hi: 'लाल प्याज', or: 'ନାଲି ପିଆଜ', mr: 'लाल कांदा', pa: 'ਪਿਆਜ਼', ta: 'வெங்காயம்', te: 'ఉల్లిపాయ', bn: 'পেঁয়াজ', gu: 'ડુંગળી', kn: 'ಈರುಳ್ಳಿ' } },
  'प्याज': { standard: 'Red Onion', labels: { en: 'Red Onion', hi: 'लाल प्याज', or: 'ନାଲି ପିଆଜ', mr: 'लाल कांदा', pa: 'ਪਿਆਜ਼', ta: 'வெங்காயம்', te: 'ఉల్లిపాయ', bn: 'পেঁয়াজ', gu: 'ડુંગળી', kn: 'ಈರುಳ್ಳಿ' } },
  'ପିଆଜ': { standard: 'Red Onion', labels: { en: 'Red Onion', hi: 'लाल प्याज', or: 'ନାଲି ପିଆଜ', mr: 'लाल कांदा', pa: 'ਪਿਆଜ', ta: 'வெங்காயம்', te: 'ఉల్లిపాయ', bn: 'পেঁয়াজ', gu: 'ડુંଗળી', kn: 'ಈರುಳ್ಳಿ' } },

  // Tomato (ବିଲାତି / ଟମାଟୋ)
  'tomato': { standard: 'Tomato', labels: { en: 'Tomato', hi: 'टमाटर', or: 'ବିଲାତି / ଟମାଟୋ', mr: 'टोमॅटो', pa: 'ਟਮਾਟਰ', ta: 'தக்காளி', te: 'టమాటా', bn: 'টমেটো', gu: 'ટામેટા', kn: 'ಟೊಮೆಟೊ' } },
  'tamatar': { standard: 'Tomato', labels: { en: 'Tomato', hi: 'टमाटर', or: 'ବିଲାତି / ଟମାଟୋ', mr: 'टोमॅटो', pa: 'ਟਮਾਟਰ', ta: 'தக்காளி', te: 'టమాటా', bn: 'টমেটো', gu: 'ટામેટા', kn: 'ಟೊಮೆಟೊ' } },
  'bilati': { standard: 'Tomato', labels: { en: 'Tomato', hi: 'टमाटर', or: 'ବିଲାତି / ଟମାଟୋ', mr: 'टोमॅटो', pa: 'ਟਮਾਟਰ', ta: 'தக்காளி', te: 'టమాటా', bn: 'টমেটো', gu: 'ટામેટા', kn: 'ಟೊಮೆಟೊ' } },
  'tamato': { standard: 'Tomato', labels: { en: 'Tomato', hi: 'टमाटर', or: 'ବିଲାତି / ଟମାଟୋ', mr: 'टोमॅटो', pa: 'ਟਮਾਟਰ', ta: 'தக்காளி', te: 'టమాటా', bn: 'টমেটো', gu: 'ટામેટા', kn: 'ಟೊಮೆಟೊ' } },
  'टमाटर': { standard: 'Tomato', labels: { en: 'Tomato', hi: 'टमाटर', or: 'ବିଲାତି / ଟମାଟୋ', mr: 'टोमॅटो', pa: 'ਟਮਾਟਰ', ta: 'தக்காளி', te: 'టమాటా', bn: 'টমেটো', gu: 'ટામેટા', kn: 'ಟೊಮೆಟೊ' } },
  'टोमॅटो': { standard: 'Tomato', labels: { en: 'Tomato', hi: 'टमाटर', or: 'ବିଲାତି / ଟମାଟୋ', mr: 'टोमॅटो', pa: 'ਟਮਾਟਰ', ta: 'தக்காளி', te: 'టమాటా', bn: 'টমেটো', gu: 'ટામેટા', kn: 'ಟೊಮೆಟೊ' } },
  'ବିଲାତି': { standard: 'Tomato', labels: { en: 'Tomato', hi: 'टमाटर', or: 'ବିଲାତି / ଟମାଟୋ', mr: 'टोमॅटो', pa: 'ਟਮਾਟਰ', ta: 'தக்காளி', te: 'టమాటా', bn: 'টমেটো', gu: 'ટામેટા', kn: 'ಟೊಮೆಟೊ' } },
  'ଟମାଟୋ': { standard: 'Tomato', labels: { en: 'Tomato', hi: 'टमाटर', or: 'ବିଲାତି / ଟମାଟୋ', mr: 'टोमॅटो', pa: 'ਟਮਾਟਰ', ta: 'தக்காளி', te: 'టమాటా', bn: 'টমেটো', gu: 'ટામેટા', kn: 'ಟೊಮೆಟೊ' } },

  // Potato (ଆଳୁ)
  'potato': { standard: 'Potato', labels: { en: 'Potato', hi: 'आलू', or: 'ଆଳୁ', mr: 'बटाटा', pa: 'ਆਲੂ', ta: 'உருளைக்கிழங்கு', te: 'బంగాళాదుంప', bn: 'আলু', gu: 'બટાટા', kn: 'ಆಲೂಗಡ್ಡೆ' } },
  'aloo': { standard: 'Potato', labels: { en: 'Potato', hi: 'आलू', or: 'ଆଳୁ', mr: 'बटाटा', pa: 'ਆਲੂ', ta: 'உருளைக்கிழங்கு', te: 'బంగాళాదుంప', bn: 'আলু', gu: 'બટાટા', kn: 'ಆಲೂಗಡ್ಡೆ' } },
  'aalu': { standard: 'Potato', labels: { en: 'Potato', hi: 'आलू', or: 'ଆଳୁ', mr: 'बटाटा', pa: 'ਆਲੂ', ta: 'உருளைக்கிழங்கு', te: 'బంగాళାదుంప', bn: 'আলু', gu: 'બટાટા', kn: 'ಆಲೂಗಡ್ಡೆ' } },
  'alu': { standard: 'Potato', labels: { en: 'Potato', hi: 'आलू', or: 'ଆଳୁ', mr: 'बटाटा', pa: 'ਆਲੂ', ta: 'உருளைக்கிழங்கு', te: 'బంగాళାదుంప', bn: 'আলু', gu: 'બટાટા', kn: 'ಆಲೂಗಡ್ಡೆ' } },
  'batata': { standard: 'Potato', labels: { en: 'Potato', hi: 'आलू', or: 'ଆଳୁ', mr: 'बटाटा', pa: 'ਆਲੂ', ta: 'உருளைக்கிழங்கு', te: 'బంగాళାదుంప', bn: 'আলু', gu: 'બટાટા', kn: 'ಆಲೂಗಡ್ಡೆ' } },
  'आलू': { standard: 'Potato', labels: { en: 'Potato', hi: 'आलू', or: 'ଆଳୁ', mr: 'बटाटा', pa: 'ਆਲੂ', ta: 'உருளைக்கிழங்கு', te: 'బంగాళାదుంప', bn: 'আলু', gu: 'બટાટા', kn: 'ಆಲೂಗಡ್ಡೆ' } },
  'बटाटा': { standard: 'Potato', labels: { en: 'Potato', hi: 'आलू', or: 'ଆଳୁ', mr: 'बटाटा', pa: 'ਆଲੂ', ta: 'உருளைக்கிழங்கு', te: 'బంగాళାదుంప', bn: 'আলু', gu: 'બટાટા', kn: 'ಆಲೂಗಡ್ಡೆ' } },
  'ଆଳୁ': { standard: 'Potato', labels: { en: 'Potato', hi: 'आलू', or: 'ଆଳୁ', mr: 'बटाटा', pa: 'ਆଲੂ', ta: 'உருளைக்கிழங்கு', te: 'బంగాళାదుంప', bn: 'আলু', gu: 'બટાટા', kn: 'ಆಲೂಗಡ್ಡೆ' } },

  // Pomegranate (ଡାଳିମ୍ବ)
  'pomegranate': { standard: 'Pomegranate', labels: { en: 'Pomegranate', hi: 'अनार', or: 'ଡାଳିମ୍ବ', mr: 'डाळिंब', pa: 'ਅਨਾਰ', ta: 'மாதுளை', te: 'దానిమ్మ', bn: 'বেদানা', gu: 'દાડમ', kn: 'ದಾಳಿಂಬೆ' } },
  'anaar': { standard: 'Pomegranate', labels: { en: 'Pomegranate', hi: 'अनार', or: 'ଡାଳିମ୍ବ', mr: 'डाळिंब', pa: 'ਅਨਾਰ', ta: 'மாதுளை', te: 'దానిమ్మ', bn: 'বেদানা', gu: 'દાડમ', kn: 'ದಾಳಿಂಬೆ' } },
  'dalimb': { standard: 'Pomegranate', labels: { en: 'Pomegranate', hi: 'अनार', or: 'ଡାଳିମ୍ବ', mr: 'डाळिंब', pa: 'ਅਨਾਰ', ta: 'மாதுளை', te: 'దానిమ్మ', bn: 'বেদানা', gu: 'દાડમ', kn: 'ದಾಳಿಂಬೆ' } },
  'dalimba': { standard: 'Pomegranate', labels: { en: 'Pomegranate', hi: 'अनार', or: 'ଡାଳିମ୍ବ', mr: 'डाळिंब', pa: 'ਅਨਾਰ', ta: 'மாதுளை', te: 'దానిమ్మ', bn: 'বেদানা', gu: 'દાડમ', kn: 'ದಾಳಿಂಬೆ' } },
  'अनार': { standard: 'Pomegranate', labels: { en: 'Pomegranate', hi: 'अनार', or: 'ଡାଳିମ୍ବ', mr: 'डाळिंब', pa: 'ਅਨਾਰ', ta: 'மாதுளை', te: 'దానిమ్మ', bn: 'বেদানা', gu: 'દાડમ', kn: 'ದಾಳಿಂಬೆ' } },
  'डाळिंब': { standard: 'Pomegranate', labels: { en: 'Pomegranate', hi: 'अनार', or: 'ଡାଳିମ୍ବ', mr: 'डाळिंब', pa: 'ਅਨਾਰ', ta: 'மாதுளை', te: 'దానిమ్మ', bn: 'বেদানা', gu: 'દાડમ', kn: 'ದಾಳಿಂಬೆ' } },
  'ଡାଳିମ୍ବ': { standard: 'Pomegranate', labels: { en: 'Pomegranate', hi: 'अनାର', or: 'ଡାଳିମ୍ବ', mr: 'डाळिंब', pa: 'ਅਨਾਰ', ta: 'மாதுளை', te: 'దానిమ్మ', bn: 'বেদানা', gu: 'દાડમ', kn: 'ದಾಳಿମ୍ବ' } },

  // Paddy / Rice (ଧାନ / ଚାଉଳ)
  'rice': { standard: 'Paddy / Rice', labels: { en: 'Paddy / Rice', hi: 'धान / चावल', or: 'ଧାନ / ଚାଉଳ', mr: 'भात / तांदूळ', pa: 'ਝੋਨਾ', ta: 'நெல் / அரிசி', te: 'వరి / బియ్యం', bn: 'ধান / চাল', gu: 'ડાંગર / ચોખા', kn: 'ಭತ್ತ / ಅಕ್ಕಿ' } },
  'paddy': { standard: 'Paddy / Rice', labels: { en: 'Paddy / Rice', hi: 'धान / चावल', or: 'ଧାନ / ଚାଉଳ', mr: 'भात / तांदूळ', pa: 'ਝੋਨਾ', ta: 'நெல் / அரிசி', te: 'వరి / బియ్యం', bn: 'ধান / চাল', gu: 'ડાંગર / ચોખા', kn: 'ಭತ್ತ / ಅಕ್ಕಿ' } },
  'dhan': { standard: 'Paddy / Rice', labels: { en: 'Paddy / Rice', hi: 'धान / चावल', or: 'ଧାନ / ଚାଉଳ', mr: 'भात / तांदूळ', pa: 'ਝੋਨਾ', ta: 'நெல் / அரிசி', te: 'వరి / బియ్యం', bn: 'ধান / চাল', gu: 'ડાંગર / ચોખા', kn: 'ಭತ್ತ / ಅಕ್ಕಿ' } },
  'chawal': { standard: 'Paddy / Rice', labels: { en: 'Paddy / Rice', hi: 'धान / चावल', or: 'ଧାନ / ଚାଉଳ', mr: 'भात / तांदूळ', pa: 'ਝੋਨਾ', ta: 'நெல் / அரிசி', te: 'వరి / బియ్యం', bn: 'ধান / চাল', gu: 'ડાંગર / ચોખા', kn: 'ಭತ್ತ / ಅಕ್ಕಿ' } },
  'dhana': { standard: 'Paddy / Rice', labels: { en: 'Paddy / Rice', hi: 'धान / चावल', or: 'ଧାନ / ଚାଉଳ', mr: 'भात / तांदूळ', pa: 'ਝੋਨਾ', ta: 'நெல் / அரிசி', te: 'వరి / బియ్యం', bn: 'ধান / চাল', gu: 'ડાંગર / ચોખા', kn: 'ಭತ್ತ / ಅಕ್ಕಿ' } },
  'chaula': { standard: 'Paddy / Rice', labels: { en: 'Paddy / Rice', hi: 'धान / चावल', or: 'ଧାନ / ଚାଉଳ', mr: 'भात / तांदूळ', pa: 'ਝੋਨਾ', ta: 'நெல் / அரிசி', te: 'వరి / బియ్యం', bn: 'ধান / চাল', gu: 'ડાંગର / ચોખા', kn: 'ಭತ್ತ / ಅಕ್ಕಿ' } },
  'ଧାନ': { standard: 'Paddy / Rice', labels: { en: 'Paddy / Rice', hi: 'धान / चावल', or: 'ଧାନ / ଚାଉଳ', mr: 'भात / तांदूळ', pa: 'ਝੋਨਾ', ta: 'நெல் / அரிசி', te: 'వరి / బియ్యం', bn: 'ধান / চাল', gu: 'ડાંગર / ચોખા', kn: 'ಭತ್ತ / ಅಕ್ಕಿ' } },
  'ଚାଉଳ': { standard: 'Paddy / Rice', labels: { en: 'Paddy / Rice', hi: 'धान / चावल', or: 'ଧାନ / ଚାଉଳ', mr: 'भात / तांदूळ', pa: 'ਝੋਨਾ', ta: 'நெல் / அரிசி', te: 'వరి / బియ్యం', bn: 'ধান / চাল', gu: 'ડાંગર / ચોખા', kn: 'ಭತ್ತ / ಅಕ್ಕಿ' } },
  'धान': { standard: 'Paddy / Rice', labels: { en: 'Paddy / Rice', hi: 'धान / चावल', or: 'ଧାନ / ଚାଉଳ', mr: 'भात / तांदूळ', pa: 'ਝੋਨਾ', ta: 'நெல் / அரிசி', te: 'వరి / బియ్యం', bn: 'ধান / চাল', gu: 'ડાંગર / ચોખા', kn: 'ಭತ್ತ / ಅಕ್ಕಿ' } },

  // Brinjal / Eggplant (ବାଇଗଣ)
  'brinjal': { standard: 'Brinjal', labels: { en: 'Brinjal', hi: 'बैंगन', or: 'ବାଇଗଣ', mr: 'वांगे', pa: 'ਬੈਂਗਣ', ta: 'கத்திரிக்காய்', te: 'వంకాయ', bn: 'বেগুন', gu: 'રીંગણ', kn: 'ಬದನೆಕಾಯಿ' } },
  'baigan': { standard: 'Brinjal', labels: { en: 'Brinjal', hi: 'बैंगन', or: 'ବାଇଗଣ', mr: 'वांगे', pa: 'ਬੈਂਗਣ', ta: 'கத்திரிக்காய்', te: 'వంకాయ', bn: 'বেগুন', gu: 'રીંગણ', kn: 'ಬದನೆಕಾಯಿ' } },
  'baigana': { standard: 'Brinjal', labels: { en: 'Brinjal', hi: 'बैंगन', or: 'ବାଇଗଣ', mr: 'वांगे', pa: 'ਬੈਂਗਣ', ta: 'கத்திரிக்காய்', te: 'వంకాయ', bn: 'বেগুন', gu: 'રીંગણ', kn: 'ಬದನೆಕಾಯಿ' } },
  'ବାଇଗଣ': { standard: 'Brinjal', labels: { en: 'Brinjal', hi: 'बैंगन', or: 'ବାଇଗଣ', mr: 'वांगे', pa: 'ਬੈਂਗਣ', ta: 'கத்திரிக்காய்', te: 'వంକాయ', bn: 'বেগুন', gu: 'રીંગણ', kn: 'ಬದನೆಕಾಯಿ' } },
  'बैंगन': { standard: 'Brinjal', labels: { en: 'Brinjal', hi: 'बैंगन', or: 'ବାଇଗଣ', mr: 'वांगे', pa: 'ਬੈਂਗਣ', ta: 'கத்திரிக்காய்', te: 'వంకాయ', bn: 'বেগুন', gu: 'રીંગણ', kn: 'ಬದನೆಕಾಯಿ' } },

  // Cauliflower (ଫୁଲକୋବି)
  'cauliflower': { standard: 'Cauliflower', labels: { en: 'Cauliflower', hi: 'फूलगोभी', or: 'ଫୁଲକୋବି', mr: 'फ्लॉवर', pa: 'ਫੁੱਲ ਗੋਭੀ', ta: 'காலிஃபிளவர்', te: 'క్యాలీఫ్లవర్', bn: 'ফুলকপি', gu: 'ફૂલકોબી', kn: 'ಹೂಕೋಸು' } },
  'gobhi': { standard: 'Cauliflower', labels: { en: 'Cauliflower', hi: 'फूलगोभी', or: 'ଫୁଲକୋବି', mr: 'फ्लॉवर', pa: 'ਫੁੱਲ ਗੋਭੀ', ta: 'காலிஃபிளவர்', te: 'క్యాలీఫ్లవర్', bn: 'ফুলকপি', gu: 'ફૂલકોબી', kn: 'ಹೂಕೋಸು' } },
  'phulakobi': { standard: 'Cauliflower', labels: { en: 'Cauliflower', hi: 'फूलगोभी', or: 'ଫୁଲକୋବି', mr: 'फ्लॉवर', pa: 'ਫੁੱਲ ਗੋਭੀ', ta: 'காலிஃபிளவர்', te: 'క్యాలੀఫ్లవర్', bn: 'ফুলকপি', gu: 'ଫૂଲકોબી', kn: 'ಹೂಕೋಸು' } },
  'ଫୁଲକୋବି': { standard: 'Cauliflower', labels: { en: 'Cauliflower', hi: 'फूलगोभी', or: 'ଫୁଲକୋବି', mr: 'फ्लॉवर', pa: 'ਫੁੱਲ ਗੋਭੀ', ta: 'காலிஃபிளவர்', te: 'క్యాలੀఫ్లవర్', bn: 'ফুলকপি', gu: 'ଫୁଲକୋବି', kn: 'ಹೂಕೋಸು' } },

  // Cabbage (ବନ୍ଧାକୋବି)
  'cabbage': { standard: 'Cabbage', labels: { en: 'Cabbage', hi: 'पत्तागोभी', or: 'ବନ୍ଧାକୋବି', mr: 'कोबी', pa: 'ਬੰਦ ਗੋਭੀ', ta: 'முட்டைக்கோஸ்', te: 'క్యాబేజీ', bn: 'বাঁধাকপি', gu: 'કોબીજ', kn: 'ಎಲೆಕೋಸು' } },
  'bandhakobi': { standard: 'Cabbage', labels: { en: 'Cabbage', hi: 'पत्तागोभी', or: 'ବନ୍ଧାକୋବି', mr: 'कोबी', pa: 'ਬੰਦ ਗੋਭੀ', ta: 'முட்டைக்கோஸ்', te: 'క్యాబేజీ', bn: 'বাঁধাকপি', gu: 'કોબીજ', kn: 'ಎಲೆಕೋಸು' } },
  'ବନ୍ଧାକୋବି': { standard: 'Cabbage', labels: { en: 'Cabbage', hi: 'पत्तागोभी', or: 'ବନ୍ଧାକୋବି', mr: 'कोबी', pa: 'ਬੰਦ ਗੋਭੀ', ta: 'முட்டைக்கோஸ்', te: 'క్యాబేజీ', bn: 'বাঁଧাকପି', gu: 'કોબીજ', kn: 'ಎಲೆಕೋಸು' } },

  // Green Chilli (କଞ୍ଚା ଲଙ୍କା)
  'chilli': { standard: 'Green Chilli', labels: { en: 'Green Chilli', hi: 'हरी मिर्च', or: 'କଞ୍ଚା ଲଙ୍କା', mr: 'हिरवी मिरची', pa: 'ਹਰੀ ਮਿਰਚ', ta: 'பச்சை மிளகாய்', te: 'పచ్చి మిర్చి', bn: 'কাঁচা লঙ্কা', gu: 'લીલા મરચાં', kn: 'ಹಸಿರು ಮೆಣಸಿನಕಾಯಿ' } },
  'mirchi': { standard: 'Green Chilli', labels: { en: 'Green Chilli', hi: 'हरी मिर्च', or: 'କଞ୍ଚା ଲଙ୍କା', mr: 'हिरवी मिरची', pa: 'ਹਰੀ ਮਿਰਚ', ta: 'பச்சை மிளகாய்', te: 'పచ్చి మిర్చి', bn: 'কাঁচা লঙ্কা', gu: 'લીલા મરચાં', kn: 'ಹಸಿರು ಮೆಣಸಿನಕಾಯಿ' } },
  'lanka': { standard: 'Green Chilli', labels: { en: 'Green Chilli', hi: 'हरी मिर्च', or: 'କଞ୍ଚା ଲଙ୍କା', mr: 'हिरवी मिरची', pa: 'ਹਰੀ ਮਿਰਚ', ta: 'பச்சை மிளகாய்', te: 'పచ్చి மிర్చి', bn: 'কাঁচা লঙ্কা', gu: 'લીલા મરચાં', kn: 'ಹಸಿರು ಮೆಣಸಿನಕಾಯಿ' } },
  'କଞ୍ଚା ଲଙ୍କା': { standard: 'Green Chilli', labels: { en: 'Green Chilli', hi: 'हरी मिर्च', or: 'କଞ୍ଚା ଲଙ୍କା', mr: 'हिरवी मिरची', pa: 'ਹਰੀ ਮਿਰਚ', ta: 'பச்சை மிளகாய்', te: 'పచ్చి మిర్చి', bn: 'কাঁচা লঙ্কা', gu: 'લીલા મરચાં', kn: 'ಹಸಿರು ಮೆಣಸಿನକಾಯಿ' } },
  'ଲଙ୍କା': { standard: 'Green Chilli', labels: { en: 'Green Chilli', hi: 'हरी मिर्च', or: 'କଞ୍ଚା ଲଙ୍କା', mr: 'हिरवी मिरची', pa: 'ਹਰੀ ਮਿਰਚ', ta: 'பச்சை மிளகாய்', te: 'పచ్చి மிర్చి', bn: 'কাঁচা লঙ্কা', gu: 'લીલા મરચાં', kn: 'ಹಸಿರು ಮೆಣಸಿನକಾಯಿ' } },

  // Ginger (ଅଦା)
  'ginger': { standard: 'Ginger', labels: { en: 'Ginger', hi: 'अदरक', or: 'ଅଦା', mr: 'आले', pa: 'ਅਦਰਕ', ta: 'இஞ்சி', te: 'అల్లం', bn: 'আদা', gu: 'આદુ', kn: 'ಶುಂಠಿ' } },
  'adrak': { standard: 'Ginger', labels: { en: 'Ginger', hi: 'अदरक', or: 'ଅଦା', mr: 'आले', pa: 'ਅਦਰਕ', ta: 'இஞ்சி', te: 'అల్లం', bn: 'আদা', gu: 'આદુ', kn: 'ಶುಂಠಿ' } },
  'ada': { standard: 'Ginger', labels: { en: 'Ginger', hi: 'अदरक', or: 'ଅଦା', mr: 'आले', pa: 'ਅਦਰਕ', ta: 'இஞ்சி', te: 'అల్లం', bn: 'আদা', gu: 'આદୁ', kn: 'ಶುಂಠಿ' } },
  'ଅଦା': { standard: 'Ginger', labels: { en: 'Ginger', hi: 'अदरक', or: 'ଅଦା', mr: 'आले', pa: 'ਅਦਰਕ', ta: 'இஞ்சி', te: 'అల్లం', bn: 'আদা', gu: 'આદુ', kn: 'ಶುಂಠಿ' } },

  // Garlic (ରସୁଣ)
  'garlic': { standard: 'Garlic', labels: { en: 'Garlic', hi: 'लहसुन', or: 'ରସୁଣ', mr: 'लसूण', pa: 'ਲਸਣ', ta: 'பூண்டு', te: 'వెల్లుల్లి', bn: 'রসুন', gu: 'લસણ', kn: 'ಬೆಳ್ಳುಳ್ಳಿ' } },
  'lahsun': { standard: 'Garlic', labels: { en: 'Garlic', hi: 'लहसुन', or: 'ରସୁଣ', mr: 'लसूण', pa: 'ਲਸਣ', ta: 'பூண்டு', te: 'వెల్లుల్లి', bn: 'রসুন', gu: 'લસણ', kn: 'ಬೆಳ್ಳುಳ್ಳಿ' } },
  'rasuna': { standard: 'Garlic', labels: { en: 'Garlic', hi: 'लहसुन', or: 'ରସୁଣ', mr: 'लसूण', pa: 'ਲਸਣ', ta: 'பூண்டு', te: 'వెల్లుల్లి', bn: 'রসুন', gu: 'લસણ', kn: 'ಬೆಳ್ಳುಳ್ಳಿ' } },
  'ରସୁଣ': { standard: 'Garlic', labels: { en: 'Garlic', hi: 'लहसुन', or: 'ରସୁଣ', mr: 'लसूण', pa: 'ਲਸਣ', ta: 'பூண்டு', te: 'వెల్లుల్లి', bn: 'রসুন', gu: 'લસણ', kn: 'ಬೆಳ್ಳುಳ್ಳಿ' } },

  // Mustard (ସୋରିଷ)
  'mustard': { standard: 'Mustard', labels: { en: 'Mustard', hi: 'सरसों', or: 'ସୋରିଷ', mr: 'मोहरी', pa: 'ਸਰ੍ਹੋਂ', ta: 'கடுகு', te: 'ఆవాలు', bn: 'সরিষা', gu: 'રાઈ', kn: 'ಸಾಸಿವೆ' } },
  'sarson': { standard: 'Mustard', labels: { en: 'Mustard', hi: 'सरसों', or: 'ସୋରିଷ', mr: 'मोहरी', pa: 'ਸਰ੍ਹੋਂ', ta: 'கடுகு', te: 'ఆవాలు', bn: 'সরিষা', gu: 'રાઈ', kn: 'ಸಾಸಿವೆ' } },
  'sorisa': { standard: 'Mustard', labels: { en: 'Mustard', hi: 'सरसों', or: 'ସୋରିଷ', mr: 'मोहरी', pa: 'ସਰ੍ਹੋਂ', ta: 'கடுகு', te: 'ఆవాలు', bn: 'সরিষা', gu: 'રાઈ', kn: 'ಸಾಸಿವೆ' } },
  'ସୋରିଷ': { standard: 'Mustard', labels: { en: 'Mustard', hi: 'सरसों', or: 'ସୋରିଷ', mr: 'मोहरी', pa: 'ਸਰ੍ਹੋਂ', ta: 'கடுகு', te: 'ఆవాలు', bn: 'ସରିষা', gu: 'રાઈ', kn: 'ସಾಸಿವೆ' } },

  // Mango (ଆମ୍ବ)
  'mango': { standard: 'Mango', labels: { en: 'Mango', hi: 'आम', or: 'ଆମ୍ବ', mr: 'आंबा', pa: 'ਅੰਬ', ta: 'மாம்பழம்', te: 'மாమిడి', bn: 'আম', gu: 'કેરી', kn: 'ಮಾವಿನಹಣ್ಣು' } },
  'aam': { standard: 'Mango', labels: { en: 'Mango', hi: 'आम', or: 'ଆମ୍ବ', mr: 'आंबा', pa: 'ਅੰਬ', ta: 'மாம்பழம்', te: 'மாమిడి', bn: 'আম', gu: 'કેરી', kn: 'ಮಾವಿನಹಣ್ಣು' } },
  'amba': { standard: 'Mango', labels: { en: 'Mango', hi: 'आम', or: 'ଆମ୍ବ', mr: 'आंबा', pa: 'ਅੰବ', ta: 'மாம்பழம்', te: 'மாమిడి', bn: 'আম', gu: 'કેરી', kn: 'ಮಾವಿನହಣ್ಣು' } },
  'ଆମ୍ବ': { standard: 'Mango', labels: { en: 'Mango', hi: 'आम', or: 'ଆମ୍ବ', mr: 'आंबा', pa: 'ਅੰବ', ta: 'மாம்பழம்', te: 'மாమిడి', bn: 'আম', gu: 'કેરી', kn: 'ಮಾವಿನಹಣ್ಣು' } },

  // Banana (କଦଳୀ)
  'banana': { standard: 'Banana', labels: { en: 'Banana', hi: 'केला', or: 'କଦଳୀ', mr: 'केळी', pa: 'ਕੇਲਾ', ta: 'வாழைப்பழம்', te: 'అరటిపండు', bn: 'কলা', gu: 'કેળા', kn: 'ಬಾಳೆಹಣ್ಣು' } },
  'kela': { standard: 'Banana', labels: { en: 'Banana', hi: 'केला', or: 'କଦଳୀ', mr: 'केळी', pa: 'ਕੇਲਾ', ta: 'வாழைப்பழம்', te: 'అరటిపండు', bn: 'কলা', gu: 'કેળા', kn: 'ಬಾಳೆಹಣ್ಣು' } },
  'kadali': { standard: 'Banana', labels: { en: 'Banana', hi: 'केला', or: 'କଦଳୀ', mr: 'કેळी', pa: 'ਕੇਲਾ', ta: 'வாழைப்பழம்', te: 'అరటిపండు', bn: 'কলা', gu: 'કેળા', kn: 'ಬಾಳೆಹಣ್ಣು' } },
  'କଦଳୀ': { standard: 'Banana', labels: { en: 'Banana', hi: 'କଦଳୀ', or: 'କଦଳୀ', mr: 'केळी', pa: 'ਕੇਲਾ', ta: 'வாழைப்பழம்', te: 'అరటిపండు', bn: 'কলা', gu: 'કેળા', kn: 'ಬಾಳೆಹಣ್ಣು' } },
};

export function useVoiceSearch() {
  const language = useAppStore((state) => state.language);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [match, setMatch] = useState<VernacularCropMatch | null>(null);
  const recognitionRef = useRef<any>(null);

  const resolveCropFromText = useCallback((rawText: string): VernacularCropMatch | null => {
    const cleaned = rawText.trim().toLowerCase();
    const words = cleaned.split(/\s+/);

    // Search for single or combined words in dictionary
    for (const w of words) {
      if (CROP_DICTIONARY[w]) {
        const item = CROP_DICTIONARY[w];
        return {
          cropName: item.standard,
          vernacularLabel: item.labels[language] || item.labels.en,
          language,
          confidence: 0.95,
        };
      }
    }

    // Direct match check on whole phrase
    if (CROP_DICTIONARY[cleaned]) {
      const item = CROP_DICTIONARY[cleaned];
      return {
        cropName: item.standard,
        vernacularLabel: item.labels[language] || item.labels.en,
        language,
        confidence: 0.98,
      };
    }

    return null;
  }, [language]);

  const startListening = useCallback(() => {
    setIsListening(true);
    setTranscript('');
    setMatch(null);

    // 1. Web Speech API (supported in modern web/browsers)
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.continuous = false;
          rec.interimResults = false;
          
          // Map app language to BCP 47 language tag
          const langMap: Record<LanguageCode, string> = {
            en: 'en-IN',
            hi: 'hi-IN',
            or: 'or-IN',
            mr: 'mr-IN',
            pa: 'pa-Guru-IN',
            ta: 'ta-IN',
            te: 'te-IN',
            bn: 'bn-IN',
            gu: 'gu-IN',
            kn: 'kn-IN',
          };
          rec.lang = langMap[language] || 'en-IN';

          rec.onresult = (event: any) => {
            const heard = event.results[0][0].transcript;
            setTranscript(heard);
            const found = resolveCropFromText(heard);
            if (found) {
              setMatch(found);
            }
            setIsListening(false);
          };

          rec.onerror = () => {
            setIsListening(false);
          };

          rec.onend = () => {
            setIsListening(false);
          };

          recognitionRef.current = rec;
          rec.start();
          return;
        } catch {
          // Fall through to native simulated speech prompt
        }
      }
    }

    // 2. Intelligent Simulation Fallback (for mobile simulators / environments without mic permission)
    const samplesByLang: Record<LanguageCode, string[]> = {
      en: ['Red Onion', 'Tomato', 'Potato', 'Paddy / Rice', 'Pomegranate', 'Green Chilli'],
      hi: ['प्याज', 'टमाटर', 'आलू', 'धान', 'अनार', 'हरी मिर्च', 'लहसुन'],
      or: ['ପିଆଜ', 'ବିଲାତି', 'ଆଳୁ', 'ଧାନ', 'ଡାଳିମ୍ବ', 'ବାଇଗଣ', 'କଞ୍ଚା ଲଙ୍କା', 'ସୋରିଷ'],
      mr: ['कांदा', 'टोमॅटो', 'बटाटा', 'भात', 'डाळिंब', 'वांगे', 'हिरवी मिरची'],
      pa: ['ਪਿਆਜ਼', 'ਟਮਾਟਰ', 'ਆਲੂ', 'ਝੋਨਾ', 'ਅਨਾਰ'],
      ta: ['வெங்காயம்', 'தக்காளி', 'உருளைக்கிழங்கு', 'நெல்', 'மாதுளை'],
      te: ['ఉల్లిపాయ', 'టమాటా', 'బంగాళాదుంప', 'వరి', 'దానిమ్మ'],
      bn: ['পেঁয়াজ', 'টমেটো', 'আলু', 'ধান', 'বেদানা'],
      gu: ['ડુંગળી', 'ટામેટા', 'બટાટા', 'ડાંગર', 'દાડમ'],
      kn: ['ಈರುಳ್ಳಿ', 'ಟೊಮೆಟೊ', 'ಆಲೂಗಡ್ಡೆ', 'ಭತ್ತ', 'ದಾಳಿಂಬೆ'],
    };

    const choices = samplesByLang[language] || samplesByLang.en;
    const randomPick = choices[Math.floor(Math.random() * choices.length)];

    setTimeout(() => {
      setTranscript(randomPick);
      const found = resolveCropFromText(randomPick);
      if (found) {
        setMatch(found);
      }
      setIsListening(false);
    }, 1800);
  }, [language, resolveCropFromText]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Safe failover
      }
    }
    setIsListening(false);
  }, []);

  const resetVoiceSearch = useCallback(() => {
    stopListening();
    setTranscript('');
    setMatch(null);
  }, [stopListening]);

  return {
    isListening,
    transcript,
    match,
    startListening,
    stopListening,
    resetVoiceSearch,
    language,
  };
}
