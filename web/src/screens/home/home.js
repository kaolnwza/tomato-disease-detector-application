import React from 'react';
import {Text, View, StyleSheet, Button} from 'react-native';

function Home({navigation}) {
  return (
    <View style={styles.container}>
      <Text>Home Screenasdmsanj</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
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

export default Home;
