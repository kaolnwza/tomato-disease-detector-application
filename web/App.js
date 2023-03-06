import React, {useEffect} from 'react';

import {StyleSheet, Text, View, Platform} from 'react-native';
import 'react-native-gesture-handler';
import {AppNavigator} from './src/components/Navigations/navigation';
import {ThemeProvider, createTheme} from '@rneui/themed';
const App = () => {
  return (
    <>
      <AppNavigator />
    </>
  );
};

export default App;
