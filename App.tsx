import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SearchScreen from './src/screens/SearchScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import DetailScreen from './src/screens/DetailScreen';
import { RootStackParamList } from './src/types/navigation';
import { Text, View } from 'react-native';
import './src/i18n/i18n';
import LanguageToggle from './src/components/LanguageToggle';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  //return <Text>Test</Text>;
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Results" component={ResultsScreen} />
          <Stack.Screen name="Detail" component={DetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <View className="absolute top-0 right-0 ">
        <LanguageToggle dark={false} />
      </View>
    </SafeAreaProvider>
  );
}
