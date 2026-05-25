import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { DataProvider } from './src/context/DataContext';

export default function App() {
  return (
    <DataProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </DataProvider>
  );
}
