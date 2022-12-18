import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  ImageBackground,
  View,
  ActivityIndicator,
} from 'react-native';

import {Button, Avatar} from '@rneui/themed';
import {font, buttons} from './styles';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import LinearGradient from 'react-native-linear-gradient';
const image = {
  uri: 'https://www.gardendesign.com/pictures/images/900x705Max/site_3/goodhearted-tomatoes-on-vine-red-and-green-tomatoes-goodhearted-tomato-proven-winners_15786.jpg',
};
const Login = ({navigation}) => {
  return (
    <View style={styles.container}>
      <ImageBackground source={image} style={styles.image}></ImageBackground>
      <View style={styles.shadowProp}>
        <Text style={(font.kanit, {fontSize: 20, fontWeight: '800'})}>
          TOMATO WATCHER
        </Text>
      </View>
      <View style={{top: '55%'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {/* <AntDesign name="google" size={50} /> */}
          <Avatar
            rounded
            size={40}
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png',
            }}
          />
          <Text style={[font.kanit, {fontSize: 20, marginLeft: 20}]}>
            Sign in with Google
          </Text>
          <Button
            style={{
              shadowOffset: {width: 0, height: 4},
              shadowColor: '#171717',
              shadowOpacity: 0.5,
              shadowRadius: 5,
              elevation: 14,
              padding: 14,
            }}
            buttonStyle={{
              width: 70,
              height: 70,
              borderRadius: 100,
            }}
            ViewComponent={LinearGradient} // Don't forget this!
            linearGradientProps={{
              colors: ['#3ED48D', '#56DEF0'],
              start: {x: 0, y: 0.5},
              end: {x: 1, y: 0.5},
            }}
            icon={<AntDesign name="arrowright" size={50} color="#fFF" />}
            onPress={() => {
              navigation.navigate('Home');
            }}></Button>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',

    backgroundColor: '#F0F9F8',
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    height: '70%',
    position: 'absolute',
    transform: [{rotate: '-8deg'}, {scale: 1.3}, {translateY: -38}],
  },
  shadowProp: {
    shadowOffset: {width: 0, height: 4},
    shadowColor: '#171717',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 14,
    top: '44%',
    backgroundColor: '#fff',
    padding: 14,
  },
});

export default Login;
