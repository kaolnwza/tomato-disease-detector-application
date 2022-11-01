import React, {useEffect} from 'react';

import {StyleSheet, Text, View, Platform} from 'react-native';

import {AppNavigator} from './src/components/Navigations/navigation';

const App = () => {
  return (
    <>
      <AppNavigator />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 100,
    backgroundColor: '#F0F9F8',
  },
});

export default App;
