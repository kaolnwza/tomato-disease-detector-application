import React, {useRef} from 'react';

import {Linking, SafeAreaView, StyleSheet, View, Image} from 'react-native';
import {Divider, Icon, Layout, Text, Button} from '@ui-kitten/components';

export const ValidatePhoto = ({route, navigation}) => {
  const {photo} = route.params;
  return (
    <Layout style={{flex: 1}}>
      <Image
        style={{height: 1000}}
        source={{
          uri: photo.path,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 80,
          flexDirection: 'row',
          alignSelf: 'center',
          justifyContent: 'space-between',
        }}>
        <Button
          style={{
            borderRadius: 50,
            margin: 5,
            marginRight: 120,
            paddingHorizontal: 16,
            backgroundColor: '#E72970',
            borderWidth: 0,
          }}
          status="basic"
          size="giant"
          accessoryLeft={() => (
            <Icon
              style={{width: 40, height: 40}}
              fill="#fff"
              name="refresh-outline"
            />
          )}
          onPress={() => {
            navigation.goBack();
          }}
        />

        <Button
          style={{
            borderRadius: 50,
            margin: 5,
            paddingHorizontal: 16,
            backgroundColor: '#047675',
            borderWidth: 0,
          }}
          status="basic"
          size="giant"
          accessoryLeft={() => (
            <Icon
              style={{width: 40, height: 40}}
              fill="#fff"
              name="arrow-forward-outline"
            />
          )}
          onPress={() => navigation.navigate('Result', {photo})}
        />
      </View>
    </Layout>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 50,
    height: 50,
  },
});
