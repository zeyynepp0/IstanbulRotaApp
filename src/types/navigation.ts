// src/types/navigation.ts
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Location } from './api';

// Stack parametrelerini tanımla
export type RootStackParamList = {
  Search: undefined;
  Results: {
    origin: Location;
    destination: Location;
  };
  Detail: {
    type: 'car' | 'transit' | 'park-ride';
    data: any;
  };
};

// SearchScreen tipleri
export type SearchScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Search'
>;

// ResultsScreen tipleri
export type ResultsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Results'
>;

export type ResultsScreenRouteProp = RouteProp<
  RootStackParamList,
  'Results'
>;

// DetailScreen tipleri
export type DetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Detail'
>;

export type DetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'Detail'
>;