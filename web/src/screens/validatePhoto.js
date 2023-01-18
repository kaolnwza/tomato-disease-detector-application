import React, {useRef} from 'react';

import {Linking, Dimensions, StyleSheet, View, Image, Text} from 'react-native';
import {Button} from '@rneui/base';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import RNFS from 'react-native-fs';
const Width = Dimensions.get('screen').width;
const Height = Dimensions.get('screen').height;

export const ValidatePhoto = ({route, navigation}) => {
  const {photo} = route.params;
  const routes = navigation.getState();
  const ImgToBase64 = async () => {
    navigation.navigate('Result', {photo});
  };

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
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
