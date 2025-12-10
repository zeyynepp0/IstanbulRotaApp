// src/utils/formatters.ts
export const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${Math.round(minutes)} dk`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours} sa ${mins} dk`;
};

export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
};

export const getRouteIcon = (type: 'car' | 'transit' | 'park-ride'): string => {
  switch (type) {
    case 'car': return '🚗';
    case 'transit': return '🚇';
    case 'park-ride': return '🅿️';
  }
};

export const getLineColor = (line: string): string => {
  const colors: Record<string, string> = {
    'M1A': '#E2231A', 'M1B': '#6ECEB2',
    'M2': '#00A54F', 'M3': '#3ABBF5',
    'M4': '#F59E0B', 'M5': '#9F2D96',
    'M6': '#D39C1F', 'M7': '#FF6B9D',
    'M8': '#EC008C', 'M9': '#9C4274',
    'M11': '#9E1F63',
    'T1': '#FF0000', 'T3': '#FFA500',
    'Metrobus': '#FF0000',
    'TRANSFER': '#9CA3AF',
  };
  return colors[line] || '#6B7280';
};