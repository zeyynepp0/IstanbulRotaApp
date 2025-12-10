// src/screens/DetailScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

// RootStackParamList içinde:
// Detail: { type: 'car' | 'transit' | 'park-ride'; data: any }
type DetailRouteProp = RouteProp<RootStackParamList, 'Detail'>;
type DetailType = RootStackParamList['Detail']['type'];

// Küçük yardımcı: dakikayı güzel formatla
const fmtMin = (val: any) => {
  if (val == null) return '-';
  const num = Number(val);
  if (Number.isNaN(num)) return String(val);
  return num.toFixed(1);
};

const DetailScreen: React.FC = () => {
  const route = useRoute<DetailRouteProp>();
  const { type, data } = route.params;

  // ---------------- HEADER METİNLERİ ----------------
  const renderTitle = () => {
    switch (type) {
      case 'car':
        return 'Araç Rota Detayı';
      case 'transit':
        return 'Toplu Taşıma Detayı';
      case 'park-ride':
        return 'Park & Ride Detayı';
      default:
        return 'Rota Detayı';
    }
  };

  const renderSubtitle = () => {
    switch (type) {
      case 'car':
        return 'Sadece araç kullanarak gitme süresi';
      case 'transit':
        return 'Toplu taşıma adımları, aktarmalar ve süreler';
      case 'park-ride':
        return 'Otoparka kadar araç, sonra toplu taşıma ve yürüyüş';
      default:
        return '';
    }
  };

  // ---------------- ORTAK BLOKLAR ----------------

  // 1) Transit özet kartı (hem transit hem park-ride için kullanılacak)
  const renderTransitSummary = (transit: any) => {
    if (!transit) return null;

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Toplu Taşıma Özeti</Text>

        <Text style={styles.cardText}>
          ⏱️ Toplam süre:{' '}
          <Text style={styles.cardHighlight}>
            {fmtMin(transit.total_min)} dk
          </Text>
        </Text>

        <Text style={styles.cardText}>
          🚶 Başlangıç yürüyüşü:{' '}
          {fmtMin(transit.walk_to_station_min)} dk
        </Text>

        <Text style={styles.cardText}>
          🚆 Araç içi süre:{' '}
          {fmtMin(transit.in_vehicle_min)} dk
        </Text>

        <Text style={styles.cardText}>
          🚶‍♀️ Çıkış yürüyüşü:{' '}
          {fmtMin(transit.walk_from_station_min)} dk
        </Text>

        {Array.isArray(transit.segments) &&
          transit.segments.length > 0 && (
            <View style={styles.segmentSection}>
              <Text style={styles.segmentTitle}>Hat Detayları</Text>
              {transit.segments.map((seg: any, idx: number) => {
                const isTransfer =
                  seg.is_transfer || seg.line === 'TRANSFER';
                const fromName = seg.from_name || seg.from || '-';
                const toName = seg.to_name || seg.to || '-';

                return (
                  <View key={idx} style={styles.segmentItem}>
                    <Text style={styles.segmentLine}>
                      {isTransfer ? 'Aktarma (yürüyüş)' : seg.line}
                    </Text>
                    <Text style={styles.segmentText}>
                      {fromName} → {toName}
                    </Text>
                    {'time_min' in seg && (
                      <Text style={styles.segmentTime}>
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

  // 2) Park & Ride özet kartı
  const renderParkRide = () => {
    if (!data) return null;

    const pr = data; // park-ride objesi
    const transit = pr.transit;

    return (
      <>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Park & Ride Özeti</Text>

          {pr.parking && (
            <>
              <Text style={styles.cardText}>
                🅿️ Otopark:{' '}
                <Text style={styles.cardHighlight}>
                  {pr.parking.name || 'Bilinmiyor'}
                </Text>
              </Text>
              {pr.parking.ilce && (
                <Text style={styles.cardText}>
                  📍 İlçe: {pr.parking.ilce}
                </Text>
              )}
            </>
          )}

          <Text style={styles.cardText}>
            🚗 Otoparka araçla: {fmtMin(pr.car_min)} dk
          </Text>

          <Text style={styles.cardText}>
            🚶 Otopark → istasyon yürüyüş: {fmtMin(pr.walk_min)} dk
            {pr.walk_dist_m != null &&
              ` (${Math.round(pr.walk_dist_m)} m)`}
          </Text>

          {transit && (
            <Text style={styles.cardText}>
              🚆 Toplu taşıma: {fmtMin(transit.total_min)} dk
            </Text>
          )}

          <Text style={[styles.cardText, { marginTop: 8 }]}>
            ⏱️ Toplam süre:{' '}
            <Text style={styles.cardHighlight}>
              {fmtMin(pr.total_min)} dk
            </Text>
          </Text>

          <Text style={styles.cardNote}>
            Park & Ride seçeneği, yoğun trafik bölgelerine girmeden toplu
            taşımaya geçmenizi sağlar.
          </Text>
        </View>

        {/* Park & Ride içinde toplu taşıma detayları */}
        {transit && renderTransitSummary(transit)}
      </>
    );
  };

  // 3) Sadece toplu taşıma (park & ride olmayan senaryo)
  const renderTransitOnly = () => {
    if (!data) return null;
    return renderTransitSummary(data);
  };

  // 4) Araç detayı (şimdilik basit)
  const renderCarOnly = () => {
    if (!data) return null;

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Araç ile Yolculuk</Text>

        <Text style={styles.cardText}>
          🚗 Tahmini süre:{' '}
          <Text style={styles.cardHighlight}>
            {fmtMin(data.car_only_min ?? data.total_min)} dk
          </Text>
        </Text>

        <Text style={styles.cardNote}>
          Süreler TomTom veya tahmini hızlara göre hesaplanmıştır.
        </Text>
      </View>
    );
  };

  // ---------------- ANA RENDER ----------------
  const renderContent = () => {
    if (!data) {
      return (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Veri bulunamadı</Text>
          <Text style={styles.cardText}>
            Bu rota için detay bilgisi alınamadı.
          </Text>
        </View>
      );
    }

    if (type === 'park-ride') {
      return renderParkRide();
    }

    if (type === 'transit') {
      return renderTransitOnly();
    }

    if (type === 'car') {
      return renderCarOnly();
    }

    // Bilinmeyen tip için fallback
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Rota Detayı</Text>
        <Text style={styles.cardText}>
          Bu rota tipi için özel bir görünüm tanımlanmadı.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{renderTitle()}</Text>
        {!!renderSubtitle() && (
          <Text style={styles.headerSubtitle}>{renderSubtitle()}</Text>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {renderContent()}

        {/* Ham Veri */}
        {/* {data && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Ham Veri</Text>
            <Text style={styles.rawJson} selectable>
              {JSON.stringify(data, null, 2)}
            </Text>
          </View>
        )} */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailScreen;

// ---------------- STYLES ----------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    backgroundColor: '#2563EB',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#DBEAFE',
  },
  scrollView: {
    flex: 1,
    marginTop: -12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
  cardHighlight: {
    fontWeight: '700',
    color: '#2563EB',
  },
  cardNote: {
    marginTop: 8,
    fontSize: 12,
    color: '#9CA3AF',
  },
  segmentSection: {
    marginTop: 12,
  },
  segmentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 6,
  },
  segmentItem: {
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  segmentLine: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  segmentText: {
    fontSize: 13,
    color: '#4B5563',
  },
  segmentTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  rawJson: {
    fontSize: 12,
    color: '#4B5563',
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
    }),
  },
});
