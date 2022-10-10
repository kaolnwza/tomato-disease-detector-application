import React from 'react';

import {Linking, SafeAreaView, StyleSheet} from 'react-native';
import {
  Divider,
  Icon,
  Layout,
  Text,
  Button,
  TopNavigationAction,
} from '@ui-kitten/components';

import {Camera, useCameraDevices} from 'react-native-vision-camera';

export const CameraScreen = ({navigation}) => {
  const devices = useCameraDevices();
  const device = devices.back;

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
        device={device}
        isActive={true}
        enableZoomGesture
      />
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
