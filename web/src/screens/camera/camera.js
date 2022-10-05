import React from 'react';
import {Text, View, StyleSheet, Button} from 'react-native';

function CameraPage({navigation}) {
  return (
    <View style={styles.container}>
      <Text>Camera Screen</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CameraPage;
