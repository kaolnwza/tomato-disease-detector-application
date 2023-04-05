import React, {useEffect, useState, useRef} from 'react';
import {Text, StyleSheet, ImageBackground, View, Image} from 'react-native';
import Modal from 'react-native-modal';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Avatar, Divider, Input} from '@rneui/themed';
import {font, buttons} from './styles';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import FarmPasscode from '../components/passcode';
import DeviceInfo from 'react-native-device-info';
const image = {
  uri: 'https://www.gardendesign.com/pictures/images/900x705Max/site_3/goodhearted-tomatoes-on-vine-red-and-green-tomatoes-goodhearted-tomato-proven-winners_15786.jpg',
};
const source = {
  uri: 'https://cdn-icons-png.flaticon.com/512/921/921347.png',
};
const Login = ({navigation}) => {
  GoogleSignin.configure({
    iosClientId:
      '79142185056-8hliasgjdru3aoq5b024c0o8s8jg9pjg.apps.googleusercontent.com',
  });
  const [passcodeModal, setPasscodeModal] = useState(false);
  const [formModal, setFormModal] = useState(false);
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    checkUser();
  }, []);
  useEffect(() => {
    if (formModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [formModal]);

  const checkUser = async () => {
    console.log(await AsyncStorage.getAllKeys());
  };

  const signIn = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('user_data'));

    if (user ? user.role === 'owner' : false) {
      navigation.navigate('SelectFarm');
    } else {
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();

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
            await AsyncStorage.setItem(
              'user_token',
              response.data.access_token,
            );
            await AsyncStorage.setItem(
              'user_data',
              JSON.stringify({
                ...userInfo.user,
                role: response.data.role,
                member_id: response.data.user.member_id,
              }),
            );

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
    }
  };

  const checkEmployee = async () => {
    const device = await DeviceInfo.getUniqueId();

    try {
      axios
        .get(
          `http://35.244.169.189.nip.io/auth/provider?provider_type=device_id&provider_id=${device}`,
        )
        .then(async response => {
          if (!response.data) {
            setFormModal(true);
          } else {
            await AsyncStorage.setItem(
              'user_token',
              response.data.access_token,
            );
            await AsyncStorage.setItem(
              'user_data',
              JSON.stringify({
                id: response.data.user.user_uuid,
                name: response.data.user.first_name,
                photo:
                  'https://icon-library.com/images/google-user-icon/google-user-icon-21.jpg',
                role: 'employee',
                member_id: response.data.user.member_id,
              }),
            );
            navigation.navigate('SelectFarm');
          }
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {}
  };

  const codeIn = async () => {
    // if (user) {
    //   navigation.navigate('SelectFarm');
    // } else {
    try {
      const data = new FormData();
      data.append('name', name);
      data.append('device_id', await DeviceInfo.getUniqueId());
      axios
        .post('http://35.244.169.189.nip.io/auth', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
            // Authorization: 'Bearer',
          },
        })
        .then(async response => {
          // console.log(response.data);
          await AsyncStorage.setItem('user_token', response.data.access_token);
          await AsyncStorage.setItem(
            'user_data',
            JSON.stringify({
              user_id: response.data.user_uuid,
              name: name,
              photo:
                'https://icon-library.com/images/google-user-icon/google-user-icon-21.jpg',
              role: 'employee',
              member_id: response.data.member_id,
            }),
          );
          setFormModal(false);
          setPasscodeModal(false);
          setName('');
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
    // }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={image} style={styles.image}></ImageBackground>
      <View style={styles.shadowProp}>
        <Text style={(font.kanit, {fontSize: 20, fontWeight: '800'})}>
          TOMATO WATCHER
        </Text>
      </View>

      <View style={{top: '52%'}}>
        <Text style={[font.kanit, {color: '#00000077'}]}>เจ้าของไร่</Text>
        <Divider inset={true} insetType="left" />

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
        <Text style={[font.kanit, {color: '#00000077'}]}>พี่ๆชาวไร่</Text>

        <Divider inset={true} insetType="middle" />

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <MaterialCommunityIcons
            name="cellphone-key"
            size={40}
            color="#2089DC"
          />

          <Text style={[font.kanit, {fontSize: 16, marginLeft: 20}]}>
            Sign in with Code
          </Text>
          <Button
            style={{
              elevation: 14,
              padding: 14,
            }}
            buttonStyle={{
              width: 50,
              height: 50,
              borderRadius: 100,
            }}
            // ViewComponent={LinearGradient} // Don't forget this!
            // linearGradientProps={{
            //   colors: ['#3ED48D', '#56DEF0'],
            //   start: {x: 0, y: 0.5},
            //   end: {x: 1, y: 0.5},
            // }}
            icon={<AntDesign name="arrowright" size={30} color="#fFF" />}
            onPress={() => checkEmployee()}

            // onPress={() => {
            // }}
          />
        </View>
      </View>

      <Modal
        isVisible={formModal}
        style={{justifyContent: 'flex-end'}}
        onBackdropPress={() => {
          setFormModal(false);
          setPasscodeModal(false);
          setName('');
        }}>
        <View
          style={{
            margin: -20,
            borderRadius: 30,
            padding: 20,
            height: '80%',
            backgroundColor: '#fff',
          }}>
          <Text
            style={[
              font.kanit,
              {
                textAlign: 'center',
                fontSize: 24,
                fontWeight: '700',
                paddingTop: 10,
              },
            ]}>
            โปรดใส่ชื่อ
          </Text>
          <Image style={styles.icon} source={source} />
          <Input
            ref={inputRef}
            placeholder="ชื่อ"
            onChangeText={newText => setName(newText)}
            defaultValue={name}
            inputStyle={[font.kanit]}
          />
          <View style={{alignSelf: 'center'}}>
            <Button
              onPress={() => codeIn()}
              title="ยืนยัน"
              icon={
                <MaterialCommunityIcons
                  name="account-check-outline"
                  size={25}
                  color="#fff"
                />
              }
              disabled={!name}
              iconRight
              iconContainerStyle={{marginLeft: 10}}
              titleStyle={[font.kanit, {fontWeight: '700', marginRight: 5}]}
              buttonStyle={{
                backgroundColor: '#3ED48D',
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 30,
              }}
              containerStyle={{
                width: 200,
              }}
            />
          </View>
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
  icon: {
    marginTop: 10,
    width: 150 / 1.5,
    height: 150 / 1.5,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

export default Login;