import React, {useRef} from 'react';

import {Linking, SafeAreaView, StyleSheet, View} from 'react-native';
import {Divider, Icon, Layout, Text, Button} from '@ui-kitten/components';

import {Camera, useCameraDevices} from 'react-native-vision-camera';

export const CameraScreen = ({navigation}) => {
  const devices = useCameraDevices();
  const device = devices.back;
  // const isFocused = useIsFocused();
  const camera = useRef(null);

  const onPressButton = async () => {
    const photo = await camera.current.takePhoto({
      flash: 'off',
      qualityPrioritization: 'speed',
    });

    navigation.navigate('ValidatePhoto', {photo});
  };

  React.useEffect(() => {
    reqCameraPermission();
  });

  const reqCameraPermission = React.useCallback(async () => {
    const permission = await Camera.requestCameraPermission();

    if (permission === 'denied') {
      await Linking.openSettings();
    }
  }, []);
  if (device == null) return null;
  return (
    <Layout style={{flex: 1}}>
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
            onPress={onPressButton}
            style={{borderRadius: 50, margin: 5}}
            status="basic"
            size="giant"
          />
        </View>
      </View>
      {/* <Button onPress={() => {}}>Open Camera</Button> */}
    </Layout>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
