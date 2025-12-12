import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoutePlanning } from '../hooks/useRoutePlanning';
import RouteCard from '../components/RouteCard';
import { formatTime } from '../utils/formatters';
import {
  ResultsScreenNavigationProp,
  ResultsScreenRouteProp,
} from '../types/navigation';
import { ICONS } from '../constants/icons';
import { useTranslation } from 'react-i18next';

interface ResultsScreenProps {
  navigation: ResultsScreenNavigationProp;
  route: ResultsScreenRouteProp;
}

export default function ResultsScreen({
  route,
  navigation,
}: ResultsScreenProps) {
  const { origin, destination } = route.params;
  const { planRoute, data, loading, error } = useRoutePlanning();
  const { t } = useTranslation();
  useEffect(() => {
    planRoute(origin, destination);
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="bg-primary" />
        <Text className="mt-4 text-base text-text-sub">
          {t('results.calculating')}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-6xl mb-4">{ICONS.warning}</Text>
        <Text className="text-lg text-red-500 mb-6">
          {t('results.errorTitle')}
        </Text>
        <TouchableOpacity
          className="bg-primary px-6 py-3 rounded-lg"
          onPress={() => planRoute(origin, destination)}
        >
          <Text className="text-white text-base font-semibold">
            {t('results.retry')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!data) return null;

  const options = [
    { type: 'car' as const, time: data.car_only_min, data: null },
    {
      type: 'transit' as const,
      time: data.transit_only.total_min,
      data: data.transit_only,
    },
    ...data.park_and_ride_options.map(opt => ({
      type: 'park-ride' as const,
      time: opt.total_min,
      data: opt,
    })),
  ];

  const fastest = options.reduce((min, opt) =>
    opt.time < min.time ? opt : min,
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center p-5 bg-white border-b border-gray-200">
          <TouchableOpacity
            className="w-10 h-10 justify-center items-center mr-3"
            onPress={() => navigation.goBack()}
          >
            <Text className="text-2xl text-primary">{ICONS.back}</Text>
          </TouchableOpacity>
          <View className="flex-1 flex-row items-center">
            <Text
              className="text-sm text-text-main font-medium flex-1"
              numberOfLines={1}
            >
              {origin.name}
            </Text>
            <Text className="text-base text-text-light mx-2">
              {ICONS.arrowRight}
            </Text>
            <Text
              className="text-sm text-text-main font-medium flex-1"
              numberOfLines={1}
            >
              {destination.name}
            </Text>
          </View>
        </View>

        {/* Traffic Warning */}
        {data.traffic_break.distance_km && (
          <View className="flex-row m-4 p-4 bg-traffic-bg rounded-xl border-l-4 border-traffic-border">
            <Text className="text-2xl mr-3">{ICONS.traffic}</Text>
            <View className="flex-1">
              <Text className="text-base font-semibold text-traffic-text mb-1">
                {t('results.trafficWarningTitle')}
              </Text>
              <Text className="text-sm text-amber-700">
                {data.traffic_break.distance_km.toFixed(1)}{' '}
                {t('trafficWarningText')}
              </Text>
              {data.traffic_break.address && (
                <Text className="text-xs text-amber-600 mt-0.5">
                  {data.traffic_break.address}
                </Text>
              )}
            </View>
          </View>
        )}

        <Text className="text-xl font-semibold text-text-main mx-5 mt-6 mb-3">
          {t('results.routeOptions')}
        </Text>

        {/* Car Only */}
        <RouteCard
          type="car"
          title={t('results.carOnly')}
          time={data.car_only_min}
          isFastest={fastest.type === 'car'}
          onPress={() =>
            navigation.navigate('Detail', {
              type: 'car',
              data: { car_only_min: data.car_only_min },
            })
          }
        />

        {/* Transit Only */}
        <RouteCard
          type="transit"
          title={t('results.transitOnly')}
          time={data.transit_only.total_min}
          subtitle={`${data.transit_only.segments.length} ${t(
            'results.transfers',
          )}`}
          isFastest={fastest.type === 'transit'}
          onPress={() =>
            navigation.navigate('Detail', {
              type: 'transit',
              data: data.transit_only,
            })
          }
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
              transit: formatTime(option.transit.total_min),
            }}
            isFastest={
              fastest.type === 'park-ride' && fastest.time === option.total_min
            }
            onPress={() =>
              navigation.navigate('Detail', {
                type: 'park-ride',
                data: option,
              })
            }
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
