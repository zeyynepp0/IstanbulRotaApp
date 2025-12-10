// src/components/RouteCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatTime } from '../utils/formatters';

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
  onPress
}: RouteCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'car': return '🚗';
      case 'transit': return '🚇';
      case 'park-ride': return '🅿️';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'car': return '#3B82F6';
      case 'transit': return '#10B981';
      case 'park-ride': return '#8B5CF6';
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        isFastest && styles.cardFastest
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {isFastest && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>⚡ EN HIZLI</Text>
        </View>
      )}

      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: getColor() + '20' }]}>
          <Text style={styles.icon}>{getIcon()}</Text>
        </View>
        
        <View style={styles.headerContent}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        <View style={styles.timeContainer}>
          <Text style={styles.time}>{formatTime(time)}</Text>
          <Text style={styles.timeLabel}>süre</Text>
        </View>
      </View>

      {details && (
        <View style={styles.detailsRow}>
          {details.car && (
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🚗</Text>
              <Text style={styles.detailText}>{details.car}</Text>
            </View>
          )}
          {details.walk && (
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🚶</Text>
              <Text style={styles.detailText}>{details.walk}</Text>
            </View>
          )}
          {details.transit && (
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🚇</Text>
              <Text style={styles.detailText}>{details.transit}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.footer}>
        <Text style={[styles.viewDetails, { color: getColor() }]}>
          Detayları Gör →
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardFastest: {
    borderWidth: 2,
    borderColor: '#10B981',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  timeContainer: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  timeLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  detailsRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    alignItems: 'flex-end',
  },
  viewDetails: {
    fontSize: 14,
    fontWeight: '600',
  },
});