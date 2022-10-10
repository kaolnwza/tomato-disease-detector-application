import React from 'react';

import {SafeAreaView, StyleSheet} from 'react-native';
import {
  Divider,
  Icon,
  Layout,
  Text,
  Button,
  TopNavigationAction,
} from '@ui-kitten/components';

export const CameraScreen = ({navigation}) => {
  return (
    <Layout style={styles.container}>
      <Button onPress={() => {}}>Open Camera</Button>
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
