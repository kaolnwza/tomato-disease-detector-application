import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, FlatList, View, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import moment from 'moment';
import {ProgressChart} from 'react-native-chart-kit';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

const DiseaseChart = props => {
  // const [time, setTime] = useState();
  const [location, setLocation] = useState();

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      error => console.log(error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
    // setInterval(() => {
    //   const date = new Date();
    //   setTime(date.toLocaleTimeString());
    // }, 1000);
  }, []);
  return (
    <View style={{flexDirection: 'column', marginTop: 5}}>
      <View style={(styles.container, {paddingBottom: 5})}>
        <MapView
          style={{
            height: 200,
            width: '100%',
            borderRadius: 30,
            // marginTop: -100,
          }}
          showsUserLocation={true}
          followsUserLocation={true}
          initialRegion={location}>
          {/* <Marker coordinate={location} /> */}

          <Marker
            coordinate={{
              latitude: 13.731328,
              longitude: 100.78181,
            }}
          />
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
          {/* {props.date} */}
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
