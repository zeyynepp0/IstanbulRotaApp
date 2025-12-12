import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useGeocoding } from '../hooks/useGeocoding';
import { Location, GeocodeResult } from '../types/api';
import { ICONS } from '../constants/icons';
import { useTranslation } from 'react-i18next';

interface LocationInputProps {
  placeholder?: string;
  icon?: string;
  onLocationSelect: (location: Location) => void;
  value?: Location | null;
}

export default function LocationInput({
  placeholder = 'Konum ara...',
  icon = ICONS.pin,
  onLocationSelect,
  value = null,
}: LocationInputProps) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { search, results, loading } = useGeocoding();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        search(query);
        setShowResults(true);
      } else {
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (value) {
      setQuery(value.name || '');
    } else {
      setQuery('');
    }
  }, [value]);

  const handleSelect = (item: GeocodeResult) => {
    const location: Location = {
      lat: item.lat,
      lon: item.lon,
      name: item.name,
      address: item.address,
    };

    setQuery(item.name);
    setShowResults(false);
    onLocationSelect(location);
  };

  const handleClear = () => {
    setQuery('');
    setShowResults(false);
  };

  return (
    <View className="z-50">
      <View className="flex-row items-center bg-white rounded-xl px-4 py-3.5 border border-gray-200 shadow-sm shadow-black/5 elevation-2">
        <Text className="text-xl mr-3">{icon}</Text>
        <TextInput
          className="flex-1 text-base text-text-main p-0"
          placeholder={placeholder}
          placeholderTextColor="text-light"
          value={query}
          // onSubmitEditing={}
          onChangeText={setQuery}
          onFocus={() => {
            if (query.trim().length >= 2 && results.length > 0) {
              setShowResults(true);
            }
          }}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {loading && (
          <ActivityIndicator size="small" color="bg-primary.DEFAULT" />
        )}
        {query.length > 0 && !loading && (
          <TouchableOpacity
            onPress={handleClear}
            className="w-6 h-6 justify-center items-center ml-2"
          >
            <Text className="text-2xl text-text-light font-light">
              {ICONS.clear}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {showResults && results.length > 0 && (
        <View className="bg-white rounded-xl mt-2 max-h-64 border border-gray-200 shadow-lg shadow-black/10 elevation-4 overflow-hidden">
          <FlatList
            data={results}
            keyExtractor={(item, index) => `${item.lat}-${item.lon}-${index}`}
            nestedScrollEnabled={true}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex-row p-4 border-b border-gray-100 items-center active:bg-gray-50"
                onPress={() => handleSelect(item)}
                activeOpacity={0.7}
              >
                <View className="w-8 h-8 rounded-full bg-blue-50 justify-center items-center mr-3">
                  <Text className="text-base">{ICONS.pin}</Text>
                </View>
                <View className="flex-1">
                  <Text
                    className="text-base font-semibold text-text-main mb-0.5"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  {item.address && (
                    <Text
                      className="text-[13px] text-text-sub"
                      numberOfLines={1}
                    >
                      {item.address}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}

      {showResults && !loading && results.length === 0 && query.length >= 2 && (
        <View className="bg-white rounded-xl mt-2 p-5 border border-gray-200 items-center">
          <Text className="text-sm text-text-light">
            {t('components.noResults')}
          </Text>
        </View>
      )}
    </View>
  );
}
