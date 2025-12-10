// src/screens/ResultsScreen.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRoutePlanning } from '../hooks/useRoutePlanning';
import RouteCard from '../components/RouteCard';
import { formatTime } from '../utils/formatters';
import { 
  ResultsScreenNavigationProp, 
  ResultsScreenRouteProp 
} from '../types/navigation';

// Props interface tanımla
interface ResultsScreenProps {
  navigation: ResultsScreenNavigationProp;
  route: ResultsScreenRouteProp;
}

export default function ResultsScreen({ route, navigation }: ResultsScreenProps) {
  const { origin, destination } = route.params;
  const { planRoute, data, loading, error } = useRoutePlanning();

  useEffect(() => {
    planRoute(origin, destination);
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Rotalar hesaplanıyor...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>Bir hata oluştu</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => planRoute(origin, destination)}
        >
          <Text style={styles.retryButtonText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!data) return null;

  // En hızlı seçeneği bul
  const options = [
    { type: 'car' as const, time: data.car_only_min, data: null },
    { type: 'transit' as const, time: data.transit_only.total_min, data: data.transit_only },
    ...data.park_and_ride_options.map(opt => ({
      type: 'park-ride' as const,
      time: opt.total_min,
      data: opt
    }))
  ];
  
  const fastest = options.reduce((min, opt) => 
    opt.time < min.time ? opt : min
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header with locations */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.locationText} numberOfLines={1}>
              {origin.name}
            </Text>
            <Text style={styles.arrowText}>→</Text>
            <Text style={styles.locationText} numberOfLines={1}>
              {destination.name}
            </Text>
          </View>
        </View>

        {/* Traffic Warning */}
        {data.traffic_break.distance_km && (
          <View style={styles.trafficWarning}>
            <Text style={styles.trafficIcon}>🚦</Text>
            <View style={styles.trafficContent}>
              <Text style={styles.trafficTitle}>Trafik Uyarısı</Text>
              <Text style={styles.trafficText}>
                {data.traffic_break.distance_km.toFixed(1)} km sonra yoğun trafik
              </Text>
              {data.traffic_break.address && (
                <Text style={styles.trafficAddress}>
                  {data.traffic_break.address}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Route Options */}
        <Text style={styles.sectionTitle}>Rota Seçenekleri</Text>

        {/* Car Only */}
        <RouteCard
          type="car"
          title="Sadece Araç"
          time={data.car_only_min}
          isFastest={fastest.type === 'car'}
          onPress={() => navigation.navigate('Detail', {
            type: 'car',
            data: { car_only_min: data.car_only_min }
          })}
        />

        {/* Transit Only */}
        <RouteCard
          type="transit"
          title="Toplu Taşıma"
          time={data.transit_only.total_min}
          subtitle={`${data.transit_only.segments.length} aktarma`}
          isFastest={fastest.type === 'transit'}
          onPress={() => navigation.navigate('Detail', {
            type: 'transit',
            data: data.transit_only
          })}
        />

        {/* Park & Ride Options */}
        {data.park_and_ride_options.map((option, index) => (
          <RouteCard
            key={index}
            type="park-ride"
            title="Park & Ride"
            subtitle={option.parking.name}
            time={option.total_min}
            details={{
              car: formatTime(option.car_min),
              walk: `${Math.round(option.walk_dist_m)}m`,
              transit: formatTime(option.transit.total_min)
            }}
            isFastest={fastest.type === 'park-ride' && fastest.time === option.total_min}
            onPress={() => navigation.navigate('Detail', {
              type: 'park-ride',
              data: option
            })}
          />
        ))}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backIcon: {
    fontSize: 24,
    color: '#2563EB',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    flex: 1,
  },
  arrowText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginHorizontal: 8,
  },
  trafficWarning: {
    flexDirection: 'row',
    margin: 16,
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  trafficIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  trafficContent: {
    flex: 1,
  },
  trafficTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  trafficText: {
    fontSize: 14,
    color: '#B45309',
  },
  trafficAddress: {
    fontSize: 12,
    color: '#D97706',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
});