import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Location } from './api';

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

// SearchScreen
export type SearchScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Search'
>;

// ResultsScreen
export type ResultsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Results'
>;

export type ResultsScreenRouteProp = RouteProp<RootStackParamList, 'Results'>;

// DetailScreen
export type DetailScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Detail'
>;

export type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Detail'>;
