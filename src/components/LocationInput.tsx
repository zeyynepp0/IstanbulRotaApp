// src/components/LocationInput.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useGeocoding } from '../hooks/useGeocoding';
import { Location, GeocodeResult } from '../types/api';

interface LocationInputProps {
  placeholder?: string;
  icon?: string;
  onLocationSelect: (location: Location) => void;
}

export default function LocationInput({
  placeholder = "Konum ara...",
  icon = "📍",
  onLocationSelect,
}: LocationInputProps) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { search, results, loading } = useGeocoding();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        search(query);
        setShowResults(true);
      } else {
        setShowResults(false);
      }
    }, 1000); // Debounce: 300ms bekle

    return () => clearTimeout(timer);
  }, [query]);

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
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.icon}>{icon}</Text>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
          onFocus={() => {
            if (query.trim().length >= 2 && results.length > 0) {
              setShowResults(true);
            }
          }}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {loading && <ActivityIndicator size="small" color="#2563EB" />}
        {query.length > 0 && !loading && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Text style={styles.clearIcon}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {showResults && results.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={results}
            keyExtractor={(item, index) => `${item.lat}-${item.lon}-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleSelect(item)}
                activeOpacity={0.7}
              >
                <View style={styles.resultIconContainer}>
                  <Text style={styles.resultIcon}>📍</Text>
                </View>
                <View style={styles.resultContent}>
                  <Text style={styles.resultName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  {item.address && (
                    <Text style={styles.resultAddress} numberOfLines={1}>
                      {item.address}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
            style={styles.resultsList}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}

      {showResults && !loading && results.length === 0 && query.length >= 2 && (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>Sonuç bulunamadı</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    zIndex: 1000,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    padding: 0,
  },
  clearButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  clearIcon: {
    fontSize: 24,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  resultsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 250,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  resultsList: {
    flexGrow: 0,
  },
  resultItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    alignItems: 'center',
  },
  resultIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultIcon: {
    fontSize: 16,
  },
  resultContent: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  resultAddress: {
    fontSize: 13,
    color: '#6B7280',
  },
  noResultsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
});