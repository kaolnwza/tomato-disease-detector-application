import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
// import RNFetchBlob from 'rn-fetch-blob';
import {Button, Input, ListItem} from '@rneui/base';
import {font} from './styles';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import MapView, {Marker} from 'react-native-maps';
import moment from 'moment';

const Width = Dimensions.get('screen').width;
const Height = Dimensions.get('screen').height;

export const ResultPage = ({route, navigation}) => {
  const {photo, info} = route.params;
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [gps, setGps] = useState(true);

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
        // console.log('response:', responseData);
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
      </View>
    );

  return (
    <View style={{flex: 1}}>
      {/* <View style={{flex: 1, paddingVertical: 120, paddingHorizontal: 20}}> */}
      <Image
        style={{
          minHeight: Width,
          width: Width,
          // height: photo.height,
          maxHeight: Height,
        }}
        source={{
          uri: photo.path ? 'file://' + photo.path : photo.uri,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 100,
          flexDirection: 'column',
          alignSelf: 'center',
          alignItems: 'center',
        }}>
        <Text style={[font.kanit, {fontSize: 12, color: '#fff'}]}>
          ความแม่นยำ 97.2 %
        </Text>
        <Text style={[font.kanit, {fontSize: 20, color: '#fff'}]}>
          {result}
        </Text>
      </View>
      <ScrollView
        style={{
          borderRadius: 20,
          transform: [{translateY: -20}],
          backgroundColor: '#fff',
          padding: 20,
          marginBottom: -20,
        }}>
        <Input
          placeholder="เพิ่มคำอธิบาย"
          inputStyle={[font.kanit]}
          style={{alignSelf: 'center', textAlign: 'center'}}
        />
        <ListItem.Accordion
          content={
            <>
              <Entypo name="location-pin" size={20} />
              <ListItem.Content>
                <ListItem.Title style={font.kanit}>ตำแหน่ง</ListItem.Title>
              </ListItem.Content>
            </>
          }
          onPress={() => setGps(!gps)}
          isExpanded={gps}>
          <ListItem>
            <View style={styles.container}>
              <MapView
                style={{height: 300, width: '100%'}}
                // moveOnMarkerPress={false}
                // pitchEnabled={false}
                // scrollEnabled={false}
                // zoomEnabled={false}
                initialRegion={{
                  latitude: info.coords.latitude,
                  longitude: info.coords.longitude,
                  latitudeDelta: 0.001,
                  longitudeDelta: 0.001,
                }}>
                <Marker
                  coordinate={{
                    latitude: info.coords.latitude,
                    longitude: info.coords.longitude,
                  }}
                />
              </MapView>
            </View>
          </ListItem>
        </ListItem.Accordion>
        <Button
          size="lg"
          onPress={saveResult}
          style={{marginBottom: 100}}
          buttonStyle={{borderRadius: 10, backgroundColor: '#047675'}}>
          <Text style={[font.kanit, {fontSize: 20, color: '#fff'}]}>ตกลง</Text>
        </Button>
      </ScrollView>
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
