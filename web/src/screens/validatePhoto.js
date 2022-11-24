import React, {useRef} from 'react';

import {Linking, Dimensions, StyleSheet, View, Image, Text} from 'react-native';
import {Button} from '@rneui/base';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import RNFS from 'react-native-fs';
const Width = Dimensions.get('screen').width;
const Height = Dimensions.get('screen').height;

export const ValidatePhoto = ({route, navigation}) => {
  const {photo, type} = route.params;
  const routes = navigation.getState();
  const ImgToBase64 = async () => {
    if (type == 'snapshot') {
      const Base64 = await RNFS.readFile(photo.path, 'base64');
      navigation.navigate('Result', {photo, Base64});
    } else {
      const Base64 = photo.base64;
      navigation.navigate('Result', {photo, Base64});
    }
    // console.log(type);
  };

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      {/* {console.log(photo)} */}
      <Image
        style={{
          minHeight: Width,
          width: Width,
          height: photo.height,
          maxHeight: Height,
        }}
        source={{
          uri: photo.path ? photo.path : photo.uri,
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
          onPress={ImgToBase64}
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
