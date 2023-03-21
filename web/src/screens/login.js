import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  ImageBackground,
  View,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Avatar} from '@rneui/themed';
import {font, buttons} from './styles';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import FarmPasscode from '../components/passcode';
const image = {
  uri: 'https://www.gardendesign.com/pictures/images/900x705Max/site_3/goodhearted-tomatoes-on-vine-red-and-green-tomatoes-goodhearted-tomato-proven-winners_15786.jpg',
};
const Login = ({navigation}) => {
  GoogleSignin.configure({
    iosClientId:
      '79142185056-8hliasgjdru3aoq5b024c0o8s8jg9pjg.apps.googleusercontent.com',
  });
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const user = await AsyncStorage.getItem('user_data');
    console.log(await AsyncStorage.getAllKeys());
    if (user) {
      navigation.navigate('SelectFarm');
    }
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      await AsyncStorage.setItem('user_data', JSON.stringify(userInfo.user));

      const data = new FormData();
      data.append('email', userInfo.user.email);
      data.append('name', userInfo.user.name);
      data.append('auth_id', userInfo.user.id);

      axios
        .post('http://35.244.169.189.nip.io/oauth/login', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            // Authorization: 'Bearer',
          },
        })
        .then(async response => {
          await AsyncStorage.setItem('user_token', response.data);

          navigation.navigate('SelectFarm');
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('User Cancel');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log('Progressing');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log('Service Not Avalible');
      } else {
        // some other error happened
        console.log(error);
      }
    }
  };

  const handleVerify = data => {
    setModalVisible(false);
  };
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
            onPress={signIn}
            // onPress={() => {
            // }}
          />
        </View>
        <View style={{alignSelf: 'center', marginTop: 150}}>
          <Button
            title="ลงชื่อใช้ไร่"
            onPress={() => setModalVisible(true)}
            iconPosition="right"
            icon={
              <MaterialCommunityIcons
                name="lock-outline"
                size={25}
                color="#fFF"
              />
            }
            titleStyle={[font.kanit, {marginHorizontal: 5, fontSize: 16}]}
            buttonStyle={{
              paddingVertical: 4,
              paddingHorizontal: 40,
              borderRadius: 100,
              backgroundColor: '#3ED48D',
            }}
          />
        </View>
      </View>

      <Modal
        isVisible={isModalVisible}
        style={{justifyContent: 'flex-end'}}
        onBackdropPress={() => setModalVisible(false)}
        onModalHide={() => navigation.setParams({handleTitlePress: false})}>
        <View
          style={{
            margin: -20,
            borderRadius: 30,
            padding: 20,
            height: '80%',
            backgroundColor: '#fff',
          }}>
          <FarmPasscode onVerify={handleVerify} />

          <View></View>
        </View>
      </Modal>
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
