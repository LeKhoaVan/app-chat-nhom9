import React, { useContext, useEffect, useState } from 'react';
import { AuthContextProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import StartScreen from './src/screens/StartScreen';

export default function App() {
  const [isLoadingg, setIsLoadingg] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoadingg(false)
    }, 1500)
  }, []);
  if (isLoadingg) {
    return (
      <StartScreen />
    )
  }
  return (
    < AuthContextProvider >
      <AppNavigator />
    </AuthContextProvider >
  );
}

