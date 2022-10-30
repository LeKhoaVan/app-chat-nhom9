import React, { useContext } from 'react';
import { AuthContextProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';



export default function App() {
  return (
    <AuthContextProvider>
      <AppNavigator/>
    </AuthContextProvider>
  );
}

