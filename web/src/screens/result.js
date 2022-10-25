import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, Image} from 'react-native';
import ImageResizer from '@bam.tech/react-native-image-resizer';
import {
  Button,
  Icon,
  Layout,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';

export const ResultPage = ({route, navigation}) => {
  const {photo} = route.params;
  const [resizedImage, setResizedImage] = useState(null);
  useEffect(() => {
    resize();
  }, []);

  const resize = async () => {
    if (!photo || !photo.path) return;

    setResizedImage(null);

    try {
      let result = await ImageResizer.createResizedImage(
        'file://' + photo.path,
        150,
        150,
        'JPEG',
        100,
        0,
        undefined,
        false,
      );

      setResizedImage(result);
    } catch (error) {
      console.log('Unable to resize the photo', error);
    }
  };
  if (!resizedImage)
    return (
      <>
        <Text>Load</Text>
      </>
    );
  return (
    <Layout style={{flex: 1, paddingVertical: 120, paddingHorizontal: 20}}>
      {console.log(resizedImage)}

      <Image
        style={{
          height: resizedImage.height,
          width: resizedImage.width,
          borderRadius: 10,
        }}
        source={{
          uri: resizedImage.path,
        }}
      />
    </Layout>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',

    backgroundColor: '#F0F9F8',
  },
});
