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
    const imageUri = photo.path ? 'file://' + photo.path : photo.uri;
    const fileName = photo.fileName
      ? photo.fileName
      : photo.path.split('/').pop();
    // console.log(imageUri, fileName);

    RNFetchBlob.fetch(
      'POST',
      'http://139.59.120.159:8080/v1/prediction',
      {
        'Content-Type': 'multipart/form-data',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NfdXVpZCI6IjUzYmRhZThlLWMxZTMtNDAzMC1hODVkLWNkMWZhOTNhOWJlNSIsImV4cCI6MTg1MzkyNTA4OCwidXNlcl91dWlkIjoiOGU0ZDgzMjAtOGExOS00NmZjLTgxNTEtN2E2MjI2ZDc2ZjZiIn0.YKjeADsaC5oKaD4bBEkWxTDVbZMH_34j4Vx3bKgeZhc',
      },
      [
        {
          name: fileName.split('.')[0],
          // filename: fileName,
          data: RNFetchBlob.wrap(imageUri),
        },
      ],
    )
      .then(response => {
        console.log('res', response.json());
        // handle response
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
  };

  if (loading)
    return (
      <View style={{flex: 1, paddingVertical: 120, paddingHorizontal: 20}}>
        <Text>Loading</Text>
        <Image
          style={{height: '40%', width: '40%', borderRadius: 10}}
          source={{
            uri: photo.path ? 'file://' + photo.path : photo.uri,
          }}
        />
      </View>
    );
  return (
    <View style={{flex: 1, paddingVertical: 120, paddingHorizontal: 20}}>
      <Image
        style={{height: '40%', width: '40%', borderRadius: 10}}
        source={{
          uri: photo.path ? 'file://' + photo.path : photo.uri,
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
