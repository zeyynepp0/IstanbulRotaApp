/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

/* import { NewAppScreen } from '@react-native/new-app-screen';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import useTrafficInfo from './src/hooks/useTrafficInfo'; */

/* function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
} */

/* function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const { data, loading } = useTrafficInfo();

  return ( */
  /*   <View style={styles.container}>
      <View>{loading ? <ActivityIndicator /> : JSON.stringify(data)}</View>
    </View> */
/*      <View
      style={[
        styles.container,
        { paddingTop: safeAreaInsets.top, paddingBottom: safeAreaInsets.bottom },
      ]}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text selectable>
          {JSON.stringify(data, null, 2)}
        </Text>
      )}
    </View>
  );
} */

/* const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default App; */
// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SearchScreen from './src/screens/SearchScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import DetailScreen from './src/screens/DetailScreen'; 

import { RootStackParamList } from './src/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            cardStyle: { backgroundColor: '#F9FAFB' }
          }}
        >
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Results" component={ResultsScreen} />
           <Stack.Screen name="Detail" component={DetailScreen} /> 
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}