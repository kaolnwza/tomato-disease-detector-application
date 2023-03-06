import React, {useEffect, useState} from 'react';

import {
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
const ManageFarm = () => {
  return (
    <View style={styles.container}>
      <Text>Farm Management</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 100,
    backgroundColor: '#f2f2f2',
  },
});
export default ManageFarm;
