import React, {useRef, useEffect} from 'react';

import {Linking, Text, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/dist/Ionicons';

import {Button} from '@rneui/themed';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {launchImageLibrary} from 'react-native-image-picker';

export const CameraScreen = ({navigation}) => {
  const devices = useCameraDevices('wide-angle-camera');
  const device = devices.back;
  const camera = useRef(null);

  const SnapShot = async () => {
    const photo = await camera.current.takePhoto({
      flash: 'off',
      qualityPrioritization: 'speed',
    });
    // console.log(photo.path);
    navigation.navigate('ValidatePhoto', {photo, type: 'snapshot'});
  };

  const OpenPhoto = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: true,
    });
    if (result.didCancel) {
      console.log('You Canceled');
    } else {
      const photo = result.assets[0];
      navigation.navigate('ValidatePhoto', {photo, type: 'gallery'});
    }
  };

  useEffect(() => {
    reqCameraPermission();
  });

  const reqCameraPermission = React.useCallback(async () => {
    const permission = await Camera.requestCameraPermission();

    if (permission === 'denied') {
      await Linking.openSettings();
    }
  }, []);
  if (device == null) return <Text>Loading</Text>;
  return (
    <View style={{flex: 1}}>
      <Camera
        style={{flex: 1}}
        ref={camera}
        device={device}
        isActive={true}
        enableZoomGesture
        photo={true}
      />
      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
          bottom: 80,
          left: 0,
          right: 0,
        }}>
        <View style={{backgroundColor: '#d1d1d1d1', borderRadius: 50}}>
          <Button
            title="Solid"
            onPress={SnapShot}
            buttonStyle={{
              borderRadius: 50,
              paddingVertical: 18,
              backgroundColor: '#fff',
              margin: 5,
            }}
          />
        </View>
      </View>
      <View
        style={{
          position: 'absolute',
          alignItems: 'center',
          bottom: 80,
          left: 0,
        }}>
        <View>
          <Button
            type="clear"
            icon={<Icon name="images-outline" size={50} color="#fFF" />}
            onPress={OpenPhoto}
            buttonStyle={{
              marginHorizontal: 20,
            }}
          />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({});
