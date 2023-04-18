import React, {useEffect, useState} from 'react';
import {font, buttons} from './styles';
import {Button, SpeedDial, Skeleton} from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import MapView, {Polygon, Marker} from 'react-native-maps';
import * as geolib from 'geolib';
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/dist/Feather';

const ManageFarm = ({navigation}) => {
  const [open, setOpen] = useState(false);
  const [farm, setFarm] = useState([]);
  const [loadData, setLoadData] = useState(true);

  const [refreshing, setRefreshing] = useState(true);

  const onRefresh = React.useCallback(() => {
    getFarm();

    setRefreshing(true);
    // Put your refresh logic here
  }, []);

  useEffect(() => {
    navigation.addListener('focus', getFarm);

    // getFarm();
  }, []);

  const getFarm = async () => {
    const value = await AsyncStorage.getItem('user_token');

    axios
      .get('http://35.244.169.189.nip.io/v1/farms', {
        headers: {
          Authorization: `Bearer ${value}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        // console.log(response.data);
        setFarm(response.data);
        setTimeout(() => {
          setRefreshing(false);
          setLoadData(false);
        }, 500);
      })
      .catch(error => {
        console.log(error);
        setRefreshing(false);
        setLoadData(false);
      });
  };

  const onSetting = item => {
    // console.log(item);
    navigation.navigate('CreateFarm', {item, type: 'edit'});
  };

  if (loadData) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: 60,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {[...Array(3)].map((_, index) => (
            <Skeleton
              LinearGradientComponent={LinearGradient}
              animation="wave"
              style={{borderRadius: 30, marginBottom: 8}}
              // skeletonStyle={{}}
              width="100%"
              height={200}
              key={index} // add a key prop to avoid a warning
            />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('CreateFarm');
        }}
        style={{
          borderRadius: 50,
          backgroundColor: '#047675',
          padding: 10,
          bottom: 50,
          right: 17,
          zIndex: 1,
          position: 'absolute',
        }}>
        <MaterialCommunityIcons name="plus" size={35} color="#fff" />
      </TouchableOpacity>

      {(farm.length <= 0) & !refreshing ? (
        <SafeAreaView style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 100,
              }}>
              <MaterialCommunityIcons
                size={60}
                color="#00000066"
                name="window-close"
              />

              <Text style={[font.kanit, {fontSize: 20, color: '#00000066'}]}>
                ไม่มีไร่
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      ) : (
        <FlatList
          numColumns={1}
          // contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}
          contentContainerStyle={{
            alignItems: 'center',
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          data={farm}
          renderItem={({item}) => (
            <View
              style={[
                styles.card,
                styles.shadowProp,
                {
                  position: 'relative',
                },
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  position: 'absolute',
                  width: '100%',
                  zIndex: 99,
                  backgroundColor: '#00000055',
                  padding: 8,
                  borderTopStartRadius: 30,
                  borderTopEndRadius: 30,
                }}>
                <Text
                  style={[font.kanit, {marginHorizontal: 10, color: '#fff'}]}>
                  <Text style={{fontSize: 20}}>{item.farm_name}</Text>
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Button
                    type="clear"
                    onPress={() => navigation.navigate('ManageUser', item)}
                    icon={
                      <Feather name="user" size={25} color="#fff" />
                    }></Button>
                  <Button
                    type="clear"
                    onPress={() => onSetting(item)}
                    icon={
                      <Feather name="settings" size={25} color="#fff" />
                    }></Button>
                </View>
              </View>

              <MapView
                style={{
                  flex: 1,
                  height: 200,
                  borderRadius: 30,
                }}
                mapType="satellite"
                moveOnMarkerPress={false}
                pitchEnabled={false}
                scrollEnabled={false}
                initialRegion={{
                  latitude: geolib.getCenterOfBounds(item.farm_location)
                    .latitude,
                  longitude: geolib.getCenterOfBounds(item.farm_location)
                    .longitude,
                  latitudeDelta: 0.004,
                  longitudeDelta: 0.004,
                }}>
                {item.farm_location.map((coordinate, index) => (
                  <Marker key={index} coordinate={coordinate} />
                ))}
                <Polygon
                  coordinates={item.farm_location}
                  fillColor="rgba(255, 0, 0, 0.5)"
                  strokeColor="rgba(255, 0, 0, 1)"
                  strokeWidth={2}
                />
              </MapView>
            </View>
          )}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
  scrollView: {
    flex: 1,

    alignItems: 'center',
  },

  card: {
    backgroundColor: 'white',
    borderRadius: 30,
    margin: 5,

    width: 350,
    // height: '40%',
  },
  btn: {
    flexDirection: 'column',
    borderColor: 0,
    borderRadius: 40,
    justifyContent: 'center',
    height: 145,
    width: 145,
    margin: 15,
  },
  shadowProp: {
    shadowOffset: {width: 0, height: 4},
    shadowColor: '#171717',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 14,
  },
});
export default ManageFarm;
