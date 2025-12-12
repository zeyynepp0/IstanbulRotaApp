import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import 'intl-pluralrules'; // <-- Kurduğun paketi buraya ekledik

import tr from './locales/tr.json';
import en from './locales/en.json';

const resources = {
  tr: { translation: tr },
  en: { translation: en },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'tr', // Varsayılan dil (uygulama açılınca bu dil gelir)
    fallbackLng: 'en', // Eğer bir çeviri bulunamazsa İngilizce göster
    interpolation: {
      escapeValue: false, // React XSS koruması zaten var
    },
  });

export default i18n;