// src/screens/SearchScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import LocationInput from '../components/LocationInput';
import { Location } from '../types/api';
import { SearchScreenNavigationProp } from '../types/navigation';

interface SearchScreenProps {
  navigation: SearchScreenNavigationProp;
}

export default function SearchScreen({ navigation }: SearchScreenProps) {
  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);

  /* const handleSearch = () => {
    if (origin && destination) {
      navigation.navigate('Results', { origin, destination });
    } else {
      Alert.alert('Eksik Bilgi', 'Lütfen başlangıç ve varış noktalarını seçin.');
    }
  }; */

  const handleSearch = () => {
  if (origin && destination) {
    console.log('SEARCH origin:', origin);
    console.log('SEARCH destination:', destination);
    navigation.navigate('Results', { origin, destination });
  } else {
    Alert.alert('Eksik Bilgi', 'Lütfen başlangıç ve varış noktalarını seçin.');
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
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>İstanbul Rota Planlayıcı</Text>
          <Text style={styles.headerSubtitle}>
            En hızlı rotayı bulun
          </Text>
        </View>

        {/* Location Inputs */}
        <View style={styles.inputSection}>
          <LocationInput
            placeholder="Nereden başlıyorsunuz?"
            icon="🚩"
            onLocationSelect={setOrigin}
          />

          {/* Swap Button */}
          <TouchableOpacity 
            style={[
              styles.swapButton,
              (!origin && !destination) && styles.swapButtonDisabled
            ]}
            onPress={swapLocations}
            disabled={!origin && !destination}
          >
            <Text style={styles.swapIcon}>⇅</Text>
          </TouchableOpacity>

          <LocationInput
            placeholder="Nereye gidiyorsunuz?"
            icon="🎯"
            onLocationSelect={setDestination}
          />
        </View>

        {/* Search Button */}
        <TouchableOpacity
          style={[
            styles.searchButton,
            (!origin || !destination) && styles.searchButtonDisabled
          ]}
          onPress={handleSearch}
          disabled={!origin || !destination}
        >
          <Text style={styles.searchButtonText}>
            Rotaları Göster
          </Text>
        </TouchableOpacity>

        {/* Quick Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 İpuçları</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>🚗</Text>
            <Text style={styles.tipText}>
              Araç, toplu taşıma ve Park&Ride seçeneklerini karşılaştırın
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>⏱️</Text>
            <Text style={styles.tipText}>
              Gerçek zamanlı trafik bilgisi ile en hızlı rotayı bulun
            </Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipIcon}>🅿️</Text>
            <Text style={styles.tipText}>
              Park&Ride ile hem zaman hem para tasarrufu yapın
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: '#2563EB',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#DBEAFE',
  },
  inputSection: {
    paddingHorizontal: 20,
    marginTop: -20,
  },
  swapButton: {
    alignSelf: 'center',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  swapButtonDisabled: {
    opacity: 0.5,
  },
  swapIcon: {
    fontSize: 20,
    color: '#2563EB',
  },
  searchButton: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  searchButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  tipsSection: {
    marginHorizontal: 20,
    marginTop: 32,
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});