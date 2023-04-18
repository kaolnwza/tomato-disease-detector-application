import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, FlatList, View, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import moment from 'moment';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const DiseaseChart = props => {
  // const [time, setTime] = useState();
  const [userLocation, setUserLocation] = useState();
  const [markerLocation, setMarkerLocation] = useState({
    latitude: 13.731328,
    longitude: 100.78181,
  });
  const [location, setLocation] = useState();

  useEffect(() => {
    console.log('Summery');
    Geolocation.getCurrentPosition(
      position => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLocation({
          latitude: (position.coords.latitude + markerLocation.latitude) / 2,
          longitude: (position.coords.longitude + markerLocation.longitude) / 2,
          latitudeDelta:
            Math.abs(position.coords.latitude - markerLocation.latitude) * 2,
          longitudeDelta:
            Math.abs(position.coords.longitude - markerLocation.longitude) * 2,
        });
      },
      error => console.log(error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }, [
    // userLocation,
    markerLocation,
  ]);

  return (
    <View style={{flexDirection: 'column', marginTop: 5}}>
      <View style={(styles.container, {paddingBottom: 5})}>
        <MapView
          // provider={PROVIDER_GOOGLE}
          mapType="satellite"
          style={{
            height: 200,
            width: '100%',
            borderRadius: 30,
          }}
          showsUserLocation={true}
          initialRegion={location}>
          <Marker
            coordinate={{
              latitude: 13.7312,
              longitude: 100.7819,
            }}
          />
          <Marker
            coordinate={{
              latitude: 13.7312,
              longitude: 100.7817,
            }}
          />
          <Marker
            coordinate={{
              latitude: 13.731,
              longitude: 100.7816,
            }}
          />
        </MapView>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <Text style={styles.info}>
          {props.date == 'current'
            ? moment().format('DD/MM/YYYY')
            : Array.isArray(props.date)
            ? moment(new Date(props.date[0])).format('DD/MM/YYYY') +
              ' - ' +
              moment(new Date(props.date[1])).format('DD/MM/YYYY')
            : moment(new Date(props.date)).format('DD/MM/YYYY')}
          {/* {'  '}
          00.00 -{' '}
          {props.time == 'currnt'
            ? time
              ? time.substring(0, 5)
              : moment().format(' HH:mm')
            : props.time}{' '}
          น. */}
        </Text>
        <Text style={styles.info}>โรคใบไหม้ 10%</Text>
        <Text style={styles.info}>เกิดขึ้นมากที่สุดในไร่</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  info: {
    fontSize: 12,
    color: '#696969',
    fontFamily: 'Kanit-Regular',
  },
  percentage: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Kanit-Regular',
    lineHeight: 21,
  },
});
export default DiseaseChart;
