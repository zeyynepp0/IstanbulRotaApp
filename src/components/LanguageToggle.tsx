import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

interface LanguageToggleProps {
  dark?: boolean;
}

export default function LanguageToggle({ dark = false }: LanguageToggleProps) {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'tr' ? 'en' : 'tr';
    i18n.changeLanguage(nextLang);
  };

  // Tasarım: Mavi header üzerindeyse beyaz/saydam, beyaz zemin üzerindeyse gri/mavi
  const containerStyle = dark
    ? 'bg-gray-100 border border-gray-300' // Beyaz zemin için
    : 'bg-white/20 border border-white/30'; // Mavi header için

  const textStyle = dark ? 'text-gray-700' : 'text-white';

  return (
    <TouchableOpacity
      onPress={toggleLanguage}
      className={`px-3 py-2 rounded-lg ${containerStyle}`}
      activeOpacity={0.7}
    >
      <Text className={`font-bold text-sm ${textStyle}`}>
        {i18n.language === 'tr' ? '🇺🇸 EN' : '🇹🇷 TR'}
      </Text>
    </TouchableOpacity>
  );
}
