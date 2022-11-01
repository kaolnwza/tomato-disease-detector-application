import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import RNFS from 'react-native-fs';

import RNFetchBlob from 'rn-fetch-blob';
export const ResultPage = ({route, navigation}) => {
  const {photo} = route.params;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const imgToBase64 = await RNFS.readFile(photo.path, 'base64');
    RNFetchBlob.fetch(
      'POST',
      'http://139.59.120.159:8765/prediction',
      {
        'Content-Type': 'application/json',
      },
      JSON.stringify({image: imgToBase64}),
    )
      // listen to upload progress event, emit every 250ms
      .uploadProgress({interval: 250}, (written, total) => {
        console.log('uploaded', written / total);
      })
      // listen to download progress event, every 10%
      .progress({count: 10}, (received, total) => {
        console.log('progress', received / total);
      })
      .then(res => {
        console.log(res.info().status, res.text());
        if (res.info().status == 200) {
          setLoading(false);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  if (loading)
    return (
      <View style={{flex: 1, paddingVertical: 120, paddingHorizontal: 20}}>
        <Text>Load</Text>
      </View>
    );
  return (
    <View style={{flex: 1, paddingVertical: 120, paddingHorizontal: 20}}>
      <Image
        style={{height: '40%', width: '40%', borderRadius: 10}}
        source={{
          uri: photo.path,
        }}
      />
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
});
