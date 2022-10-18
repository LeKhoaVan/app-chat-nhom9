import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView} from 'react-native';
import HomeScreen from './src/navigation/HomeNavigator';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
      <NavigationContainer>
			  <RootNavigator/>
		  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
