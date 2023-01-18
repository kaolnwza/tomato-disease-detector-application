import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
// import RNFetchBlob from 'rn-fetch-blob';
import {Button} from '@rneui/base';
import {font, buttons} from './styles';

export const ResultPage = ({route, navigation}) => {
  const {photo} = route.params;
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

    const data = new FormData();

    data.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: fileName,
    });

    fetch('http://139.59.120.159:8080/v1/prediction', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NfdXVpZCI6IjUzYmRhZThlLWMxZTMtNDAzMC1hODVkLWNkMWZhOTNhOWJlNSIsImV4cCI6MTg1MzkyNTA4OCwidXNlcl91dWlkIjoiOGU0ZDgzMjAtOGExOS00NmZjLTgxNTEtN2E2MjI2ZDc2ZjZiIn0.YKjeADsaC5oKaD4bBEkWxTDVbZMH_34j4Vx3bKgeZhc',
      },
      body: data,
    })
      .then(response => response.json())
      .then(responseData => {
        console.log('response:', responseData);
        setResult(responseData);
      })
      .catch(error => {
        console.log('error:', error);
      });
    setLoading(false);
  };

  const saveResult = () => {
    const imageUri = photo.path ? 'file://' + photo.path : photo.uri;
    const fileName = photo.fileName
      ? photo.fileName
      : photo.path.split('/').pop();

    const data = new FormData();

    data.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: fileName,
    });
    data.append('disease', 'Late Blight');
    data.append('description', 'test save image to log');

    fetch('http://139.59.120.159:8080/v1/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NfdXVpZCI6IjUzYmRhZThlLWMxZTMtNDAzMC1hODVkLWNkMWZhOTNhOWJlNSIsImV4cCI6MTg1MzkyNTA4OCwidXNlcl91dWlkIjoiOGU0ZDgzMjAtOGExOS00NmZjLTgxNTEtN2E2MjI2ZDc2ZjZiIn0.YKjeADsaC5oKaD4bBEkWxTDVbZMH_34j4Vx3bKgeZhc',
      },
      body: data,
    })
      .then(response => response.json())
      .then(responseData => {
        console.log('response:', responseData);
      })
      .catch(error => {
        console.log('error:', error);
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
      <Button size="md" onPress={saveResult}>
        ตกลง
      </Button>
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
