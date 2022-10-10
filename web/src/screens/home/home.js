import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {Button, Divider, Layout, TopNavigation} from '@ui-kitten/components';

export const HomeScreen = ({navigation}) => {
  const navigateDetails = () => {
    navigation.navigate('Camera');
  };

  return (
    <Layout style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button onPress={navigateDetails}>OPEN DETAILS</Button>
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
