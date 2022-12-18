import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

export const ResultPage = ({route, navigation}) => {
  const {photo, Base64} = route.params;
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const {routes} = navigation.getState();

    const filteredRoutes = routes.filter(
      route => route.name !== 'ValidatePhoto',
    );
    getData();
    navigation.reset({
      index: filteredRoutes.length - 1,
      routes: filteredRoutes,
    });
  }, []);

  const getData = async () => {
    RNFetchBlob.fetch(
      'POST',
      'http://139.59.120.159:8080/v1/base64img',
      {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NfdXVpZCI6ImVkMmE2MWJlLWYxMzMtNGMyNS04MDU0LWU0YjRkMWNmZjZhZCIsImV4cCI6MTY3MTQ0MTM1MiwidXNlcl91dWlkIjoiOGU0ZDgzMjAtOGExOS00NmZjLTgxNTEtN2E2MjI2ZDc2ZjZiIn0.JOvj31asDuKjblE_cjruRKxNWAa9GUn2GfknYrqOi94',
      },
      JSON.stringify({image: Base64}),
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
        console.log(res.info().status, res.json());
        setResult(res.json());
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
      {/* {console.log(photo)} */}
      <Image
        style={{height: '40%', width: '40%', borderRadius: 10}}
        source={{
          uri: photo.path ? photo.path : photo.uri,
        }}
      />
      <Text>{result}</Text>
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
