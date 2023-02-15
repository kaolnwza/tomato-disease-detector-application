import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import {useSharedValue} from 'react-native-reanimated';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Feather from 'react-native-vector-icons/dist/Feather';
import Geolocation from '@react-native-community/geolocation';

import {
  TabbedHeaderPager,
  DetailsHeaderScrollView,
} from 'react-native-sticky-parallax-header';
import {Button, ListItem, Avatar, Tab, TabView} from '@rneui/themed';
import {font, buttons} from './styles';
import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios';
import moment from 'moment';
const HistoryMap = props => {
  const [userLocation, setUserLocation] = useState();

  const [location, setLocation] = useState();

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLocation({
          latitude:
            (position.coords.latitude + Number(props.detail.latitude)) / 2,
          longitude:
            (position.coords.longitude + Number(props.detail.longtitude)) / 2,
          latitudeDelta:
            Math.abs(position.coords.latitude - Number(props.detail.latitude)) *
            2,
          longitudeDelta:
            Math.abs(
              position.coords.longitude - Number(props.detail.longtitude),
            ) * 2,
        });
      },
      error => console.log(error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }, []);

  return (
    <MapView
      // provider={PROVIDER_GOOGLE}
      style={{
        height: '100%',
        width: '100%',

        alignSelf: 'center',
        overflow: 'hidden',
      }}
      // moveOnMarkerPress={false}
      // pitchEnabled={false}
      // scrollEnabled={false}
      // zoomEnabled={false}
      showsUserLocation={true}
      initialRegion={location}>
      <Marker
        coordinate={{
          latitude: props.detail ? props.detail.latitude : '',
          longitude: props.detail ? props.detail.longtitude : '',
        }}
      />
    </MapView>
  );
};

export default HistoryMap;
