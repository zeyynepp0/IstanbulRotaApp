import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { formatTime } from '../utils/formatters';
import { ICONS } from '../constants/icons';
import { useTranslation } from 'react-i18next';
interface RouteCardProps {
  type: 'car' | 'transit' | 'park-ride';
  title: string;
  subtitle?: string;
  time: number;
  details?: {
    car?: string;
    walk?: string;
    transit?: string;
  };
  isFastest?: boolean;
  onPress: () => void;
}

export default function RouteCard({
  type,
  title,
  subtitle,
  time,
  details,
  isFastest,
  onPress,
}: RouteCardProps) {
  const { t } = useTranslation();
  const getIcon = () => {
    switch (type) {
      case 'car':
        return ICONS.car;
      case 'transit':
        return ICONS.transit;
      case 'park-ride':
        return ICONS.park;
    }
  };

  const getIconBgClass = () => {
    switch (type) {
      case 'car':
        return 'bg-blue-500/10';
      case 'transit':
        return 'bg-emerald-500/10';
      case 'park-ride':
        return 'bg-violet-500/10';
    }
  };

  const getDetailsColorClass = () => {
    switch (type) {
      case 'car':
        return 'text-blue-600';
      case 'transit':
        return 'text-emerald-600';
      case 'park-ride':
        return 'text-violet-600';
    }
  };

  return (
    <TouchableOpacity
      className={`mx-4 mb-3 bg-background-card rounded-2xl p-4 shadow-sm elevation-3 ${
        isFastest ? 'border-2 border-emerald-500' : ''
      }`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {isFastest && (
        <View className="absolute -top-2 right-4 bg-emerald-500 px-3 py-1 rounded-xl z-10">
          <Text className="text-white text-[10px] font-bold">
            {ICONS.flash} {t('components.fastestBadge')}
          </Text>
        </View>
      )}

      <View className="flex-row items-center mb-3">
        <View
          className={`w-12 h-12 rounded-full justify-center items-center mr-3 ${getIconBgClass()}`}
        >
          <Text className="text-2xl">{getIcon()}</Text>
        </View>

        <View className="flex-1">
          <Text className="text-lg font-semibold text-text-main">{title}</Text>
          {subtitle && (
            <Text className="text-sm text-text-sub mt-0.5">{subtitle}</Text>
          )}
        </View>

        <View className="items-end">
          <Text className="text-xl font-bold text-text-main">
            {formatTime(time)}
          </Text>
          <Text className="text-xs text-text-light">
            {t('components.duration')}
          </Text>
        </View>
      </View>

      {details && (
        <View className="flex-row py-3 border-t border-b border-gray-100 mb-3">
          {details.car && (
            <View className="flex-row items-center mr-4">
              <Text className="text-base mr-1">{ICONS.car}</Text>
              <Text className="text-sm text-text-sub">{details.car}</Text>
            </View>
          )}
          {details.walk && (
            <View className="flex-row items-center mr-4">
              <Text className="text-base mr-1">{ICONS.walk}</Text>
              <Text className="text-sm text-text-sub">{details.walk}</Text>
            </View>
          )}
          {details.transit && (
            <View className="flex-row items-center">
              <Text className="text-base mr-1">{ICONS.transit}</Text>
              <Text className="text-sm text-text-sub">{details.transit}</Text>
            </View>
          )}
        </View>
      )}

      <View className="items-end">
        <Text className={`text-sm font-semibold ${getDetailsColorClass()}`}>
          {t('components.viewDetails')}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
