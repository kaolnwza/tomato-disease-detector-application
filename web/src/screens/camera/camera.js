import React from 'react';

import {SafeAreaView, StyleSheet} from 'react-native';
import {
  Divider,
  Icon,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';

export const CameraScreen = ({navigation}) => {
  return (
    <Layout style={styles.container}>
      <Text category="h1">DETAILS</Text>
    </Layout>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
