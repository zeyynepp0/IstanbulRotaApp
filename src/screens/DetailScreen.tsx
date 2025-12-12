import React from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { ICONS } from '../constants/icons';
import { useTranslation } from 'react-i18next';

type DetailRouteProp = RouteProp<RootStackParamList, 'Detail'>;

const fmtMin = (val: any) => {
  if (val == null) return '-';
  const num = Number(val);
  if (Number.isNaN(num)) return String(val);
  return num.toFixed(1);
};

const DetailScreen: React.FC = () => {
  const route = useRoute<DetailRouteProp>();
  const { type, data } = route.params;
  const { t } = useTranslation();

  const renderTitle = () => {
    switch (type) {
      case 'car':
        return t('detail.titles.car');

      case 'transit':
        return t('detail.titles.transit');

      case 'park-ride':
        return t('detail.titles.parkRide');

      default:
        return t('detail.titles.default');
    }
  };

  const renderSubtitle = () => {
    switch (type) {
      case 'car':
        return t('detail.subtitles.car');
      case 'transit':
        return t('detail.subtitles.transit');
      case 'park-ride':
        return t('detail.subtitles.parkRide');
      default:
        return '';
    }
  };

  const renderTransitSummary = (transit: any) => {
    if (!transit) return null;

    return (
      <View className="bg-background-card p-4 rounded-2xl mt-4 shadow-sm shadow-black/5 elevation-2">
        <Text className="text-lg font-semibold text-text-main mb-2">
          {t('detail.transitSummary.title')}
        </Text>

        <Text className="text-sm text-text-sub mb-1">
          {ICONS.time} {t('detail.transitSummary.totalTime')}:{' '}
          <Text className="font-bold text-primary">
            {fmtMin(transit.total_min)} dk
          </Text>
        </Text>

        <Text className="text-sm text-text-sub mb-1">
          {ICONS.walk} {t('detail.transitSummary.walkStart')}:{' '}
          {fmtMin(transit.walk_to_station_min)} dk
        </Text>

        <Text className="text-sm text-text-sub mb-1">
          {ICONS.train} {t('detail.transitSummary.inVehicle')}:{' '}
          {fmtMin(transit.in_vehicle_min)} dk
        </Text>

        <Text className="text-sm text-text-sub mb-1">
          {ICONS.walkFemale} {t('detail.transitSummary.walkEnd')}:{' '}
          {fmtMin(transit.walk_from_station_min)} dk
        </Text>

        {Array.isArray(transit.segments) && transit.segments.length > 0 && (
          <View className="mt-3">
            <Text className="text-[15px] font-semibold text-text-main mb-1.5">
              {t('detail.transitSummary.lineDetails')}
            </Text>
            {transit.segments.map((seg: any, idx: number) => {
              const isTransfer =
                seg.is_transfer ||
                seg.line === t('detail.transitSummary.transferLabel');
              const fromName = seg.from_name || seg.from || '-';
              const toName = seg.to_name || seg.to || '-';

              return (
                <View key={idx} className="py-1.5 border-b border-gray-200">
                  <Text className="text-[13px] font-semibold text-primary">
                    {isTransfer
                      ? t('detail.transitSummary.transfer')
                      : seg.line}
                  </Text>
                  <Text className="text-[13px] text-text-sub">
                    {fromName} → {toName}
                  </Text>
                  {'time_min' in seg && (
                    <Text className="text-xs text-text-light">
                      ~ {fmtMin(seg.time_min)} dk
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  const renderParkRide = () => {
    if (!data) return null;
    const pr = data;
    const transit = pr.transit;

    return (
      <>
        <View className="bg-background-card p-4 rounded-2xl mt-4 shadow-sm shadow-black/5 elevation-2">
          <Text className="text-lg font-semibold text-text-main mb-2">
            {t('detail.parkRideSummary.title')}
          </Text>

          {pr.parking && (
            <>
              <Text className="text-sm text-text-sub mb-1">
                {ICONS.park} Otopark:{' '}
                <Text className="font-bold text-primary">
                  {pr.parking.name || t('detail.parkRideSummary.unknown')}
                </Text>
              </Text>
              {pr.parking.ilce && (
                <Text className="text-sm text-text-sub mb-1">
                  {ICONS.pin} {t('detail.parkRideSummary.district')}:{' '}
                  {pr.parking.ilce}
                </Text>
              )}
            </>
          )}

          <Text className="text-sm text-text-sub mb-1">
            {ICONS.car} {t('detail.parkRideSummary.carToParking')}:{' '}
            {fmtMin(pr.car_min)} dk
          </Text>

          <Text className="text-sm text-text-sub mb-1">
            {ICONS.walk} {t('detail.parkRideSummary.walkToStation')}:{' '}
            {fmtMin(pr.walk_min)} dk
            {pr.walk_dist_m != null && ` (${Math.round(pr.walk_dist_m)} m)`}
          </Text>

          {transit && (
            <Text className="text-sm text-text-sub mb-1">
              {ICONS.transit} {t('detail.parkRideSummary.transit')}:{' '}
              {fmtMin(transit.total_min)} dk
            </Text>
          )}

          <Text className="text-sm text-text-sub mt-2">
            {ICONS.time} {t('detail.parkRideSummary.totalTime')}:{' '}
            <Text className="font-bold text-primary">
              {fmtMin(pr.total_min)} dk
            </Text>
          </Text>

          <Text className="mt-2 text-xs text-text-light">
            {t('detail.parkRideSummary.note')}
          </Text>
        </View>

        {transit && renderTransitSummary(transit)}
      </>
    );
  };

  const renderCarOnly = () => {
    if (!data) return null;

    return (
      <View className="bg-background-card p-4 rounded-2xl mt-4 shadow-sm shadow-black/5 elevation-2">
        <Text className="text-lg font-semibold text-text-main mb-2">
          {t('detail.carSummary.title')}
        </Text>
        <Text className="text-sm text-text-sub mb-1">
          {ICONS.car} {t('detail.carSummary.estimatedTime')}:{' '}
          <Text className="font-bold text-primary">
            {fmtMin(data.car_only_min ?? data.total_min)} dk
          </Text>
        </Text>
        <Text className="mt-2 text-xs text-text-light">
          {t('detail.carSummary.note')}
        </Text>
      </View>
    );
  };

  const renderContent = () => {
    if (!data) {
      return (
        <View className="bg-background-card p-4 rounded-2xl mt-4 shadow-sm shadow-black/5 elevation-2">
          <Text className="text-lg font-semibold text-text-main mb-2">
            {t('detail.errors.noDataTitle')}
          </Text>
          <Text className="text-sm text-text-sub">
            {t('detail.errors.noDataText')}
          </Text>
        </View>
      );
    }
    if (type === 'park-ride') return renderParkRide();
    if (type === 'transit') return renderTransitSummary(data);
    if (type === 'car') return renderCarOnly();
    return null;
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-5 pt-4 pb-5 bg-primary rounded-b-3xl">
        <Text className="text-[22px] font-bold text-white mb-1.5">
          {renderTitle()}
        </Text>
        {!!renderSubtitle() && (
          <Text className="text-sm text-primary-light">{renderSubtitle()}</Text>
        )}
      </View>

      <ScrollView
        className="flex-1 -mt-3"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailScreen;
