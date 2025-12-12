import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import LocationInput from '../components/LocationInput';
import { Location } from '../types/api';
import { SearchScreenNavigationProp } from '../types/navigation';
import { ICONS } from '../constants/icons';
import { useTranslation } from 'react-i18next';

interface SearchScreenProps {
  navigation: SearchScreenNavigationProp;
}

export default function SearchScreen({ navigation }: SearchScreenProps) {
  const { t } = useTranslation();
  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);

  const handleSearch = () => {
    if (origin && destination) {
      navigation.navigate('Results', { origin, destination });
    } else {
      Alert.alert(t('search.alertTitle'), t('search.alertMessage'));
    }
  };

  const swapLocations = () => {
    if (origin || destination) {
      const temp = origin;
      setOrigin(destination);
      setDestination(temp);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-5 pt-5 pb-8 bg-primary rounded-b-3xl">
          <Text className="text-3xl font-bold text-white mb-2">
            {t('search.title')}{' '}
          </Text>
          <Text className="text-base text-primary-light">
            {t('search.subtitle')}
          </Text>
        </View>

        {/* Location Inputs */}
        <View className="px-5 -mt-5">
          <LocationInput
            placeholder={t('search.destination')}
            icon={ICONS.start}
            onLocationSelect={setOrigin}
            value={origin}
          />

          {/* Swap Button */}
          <TouchableOpacity
            className={`self-center w-11 h-11 rounded-full bg-white justify-center items-center my-2 shadow-sm shadow-black/10 elevation-3 ${
              !origin && !destination ? 'opacity-50' : ''
            }`}
            onPress={swapLocations}
            disabled={!origin && !destination}
          >
            <Text className="text-xl text-primary">{ICONS.swap}</Text>
          </TouchableOpacity>

          <LocationInput
            placeholder={t('search.destination')}
            icon={ICONS.destination}
            onLocationSelect={setDestination}
            value={destination}
          />
        </View>

        {/* Search Button */}
        <TouchableOpacity
          className={`mx-5 mt-6 bg-primary py-4 rounded-xl items-center shadow-lg shadow-blue-500/30 elevation-4 ${
            !origin || !destination ? 'bg-gray-400 shadow-none' : ''
          }`}
          onPress={handleSearch}
          disabled={!origin || !destination}
        >
          <Text className="text-white text-lg font-semibold">
            {t('search.showRoutes')}
          </Text>
        </TouchableOpacity>

        {/* Quick Tips */}
        <View className="mx-5 mt-8 mb-5 p-5 bg-white rounded-2xl shadow-sm shadow-black/5 elevation-2">
          <Text className="text-lg font-semibold text-text-main mb-4">
            {ICONS.bulb} {t('search.tips')}
          </Text>
          <View className="flex-row items-start mb-3">
            <Text className="text-xl mr-3">{ICONS.car}</Text>
            <Text className="flex-1 text-sm text-text-sub leading-5">
              {t('search.compareOptions')}
            </Text>
          </View>
          <View className="flex-row items-start mb-3">
            <Text className="text-xl mr-3">{ICONS.time}</Text>
            <Text className="flex-1 text-sm text-text-sub leading-5">
              {t('search.realTimeTraffic')}
            </Text>
          </View>
          <View className="flex-row items-start">
            <Text className="text-xl mr-3">{ICONS.park}</Text>
            <Text className="flex-1 text-sm text-text-sub leading-5">
              {t('search.parkRideSavings')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
