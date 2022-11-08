import React, {useRef} from 'react';

import {Linking, SafeAreaView, StyleSheet, View, Image} from 'react-native';
import {Button} from '@rneui/base';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';

export const ValidatePhoto = ({route, navigation}) => {
  const {photo} = route.params;
  return (
    <View style={{flex: 1}}>
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
          buttonStyle={{
            width: 75,
            height: 75,
            margin: 5,
            marginRight: 120,
            borderRadius: 100,
            backgroundColor: '#E72970',
          }}
          type="clear"
          icon={<AntDesign name="reload1" size={50} color="#fFF" />}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Button
          icon={<AntDesign name="arrowright" size={50} color="#fFF" />}
          buttonStyle={{
            width: 75,
            height: 75,
            margin: 5,
            borderRadius: 100,

            backgroundColor: '#047675',

            borderWidth: 0,
          }}
          type="clear"
          onPress={() => navigation.navigate('Result', {photo})}
        />
      </View>
    </View>
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
