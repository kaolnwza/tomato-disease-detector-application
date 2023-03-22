import React, {useEffect, useState, useRef} from 'react';
import {Picker} from '@react-native-picker/picker';
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  SafeAreaView,
  RefreshControl,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button, Skeleton} from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Feather from 'react-native-vector-icons/dist/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import {font, buttons} from './styles';
import Modal from 'react-native-modal';
import moment from 'moment';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import LinearGradient from 'react-native-linear-gradient';

export const HomeScreen = ({navigation, route}) => {
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const pickerRef = useRef();
  const [farmList, setFarmList] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [location, setLocation] = useState();
  const [refreshMap, setRefreshMap] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshFarm, setRefreshFarm] = useState(false);

  const [menu, setMenu] = useState([
    {
      name: 'ประวัติการบันทึก',
      page: 'History',
      color: '#047675',
      icon: 'list-outline',
    },
    {
      name: 'ตรวจสอบโรค',
      page: 'Camera',
      color: '#E72970',
      icon: 'camera-outline',
    },
    {
      name: 'โรคพืช',
      color: '#3ED48D',
      page: 'Information',
      icon: 'leaf-outline',
    },
  ]);

  const jewelStyle = options => {
    return {
      backgroundColor: options,
    };
  };

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    getSummery();
    setRefreshing(true);
    // wait(2000).then(() => setRefreshing(false));
  }, []);
  useEffect(() => {
    // console.log('home');
    navigation.addListener('focus', getSummery);
  }, []);

  useEffect(() => {
    if (route.params.handleTitlePress) {
      setModalVisible(true);
    }
  }, [route]);

  const getSummery = async () => {
    console.log('get summary');
    const token = await AsyncStorage.getItem('user_token');
    const current_farm = JSON.parse(await AsyncStorage.getItem('user_farm'));

    axios
      .get(
        `http://35.244.169.189.nip.io/v1/farms/${current_farm.farm_uuid}/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(response => {
        setMarkers(response.data.info);
        Geolocation.getCurrentPosition(
          position => {
            setLocation({
              latitude:
                (position.coords.latitude +
                  parseFloat(response.data.center_location.latitude)) /
                2,
              longitude:
                (position.coords.longitude +
                  parseFloat(response.data.center_location.longitude)) /
                2,
              latitudeDelta: 0.0009,
              longitudeDelta:
                Math.abs(
                  position.coords.longitude -
                    parseFloat(response.data.center_location.longitude),
                ) * 2,
            });
            setRefreshing(false);
            setRefreshMap(false);
          },
          error => console.log(error),
          {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
        );
      })
      .catch(error => {
        console.log('error summary', error);
        setLocation(null);
        setRefreshing(false);
        setRefreshMap(false);
      });
  };

  const changeFarm = async item => {
    setRefreshMap(true);
    setLocation(null);
    let farm = farmList[farmList.findIndex(x => x.farm_name === item)];
    setSelectedLanguage(item);

    await AsyncStorage.setItem('user_farm', JSON.stringify(farm));
    navigation.setParams({name: item});
    getSummery();
  };
  const getFarm = async () => {
    const value = await AsyncStorage.getItem('user_token');

    axios
      .get('http://35.244.169.189.nip.io/v1/farms', {
        headers: {
          Authorization: `Bearer ${value}`,
        },
      })
      .then(response => {
        setFarmList(response.data);
        setRefreshing(false);
        setRefreshFarm(false);
      })
      .catch(error => {
        console.log('error farm', error);
        setRefreshing(false);
        setRefreshFarm(false);
      });
  };

  const shownModal = async () => {
    const current_farm = JSON.parse(await AsyncStorage.getItem('user_farm'));

    setSelectedLanguage(current_farm.farm_name);
    getFarm();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={[styles.card, styles.shadowProp]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={font.kanit}>
              <MaterialCommunityIcons name="chart-arc" size={24} />
              <Text style={{fontSize: 24}}>สรุปข้อมูล</Text> ภาพรวมวันนี้
            </Text>
            <Button
              style={{marginRight: -15}}
              type="clear"
              onPress={() => {
                navigation.navigate('Summary');
              }}
              icon={
                <Feather name="chevron-right" size={30} color="#000" />
              }></Button>
          </View>
          {/* <Text>{JSON.stringify(location)}</Text> */}

          {location ? (
            <>
              <View style={(styles.container, {paddingBottom: 5})}>
                <MapView
                  // provider={PROVIDER_GOOGLE}
                  style={{
                    height: 200,
                    width: '100%',
                    borderRadius: 30,
                  }}
                  showsUserLocation={true}
                  initialRegion={location}>
                  {markers.map((coordinate, index) => (
                    <Marker key={index} coordinate={coordinate} />
                  ))}
                </MapView>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <Text style={styles.info}>
                  {moment().format('DD/MM/YYYY')}
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
                <Text style={styles.info}>
                  เกิดโรคทั้งหมด {markers.length} ต้น
                </Text>
              </View>
            </>
          ) : refreshMap ? (
            <View
              style={
                (styles.container, {paddingBottom: 5, alignItems: 'center'})
              }>
              <Skeleton
                LinearGradientComponent={LinearGradient}
                animation="wave"
                style={{borderRadius: 30}}
                width="100%"
                height={200}
              />
              <Skeleton
                LinearGradientComponent={LinearGradient}
                animation="wave"
                style={{borderRadius: 30, marginTop: 8}}
                width="95%"
                height={10}
              />
            </View>
          ) : (
            <Text
              style={[
                font.kanit,
                {fontSize: 12, alignSelf: 'center', color: '#00000055'},
              ]}>
              ข้อมูลมีน้อยเกินไปที่จะคำนวณ
            </Text>
          )}
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
          }}>
          {menu.map((item, index) => (
            <Button
              key={index}
              type="clear"
              title={item.name}
              titleStyle={[{color: '#fff'}, font.kanit]}
              style={[styles.btn, styles.shadowProp, jewelStyle(item.color)]}
              icon={<Ionicons name={item.icon} size={60} color="#fff" />}
              iconPosition="top"
              onPress={() => {
                navigation.navigate(item.page);
              }}
            />
          ))}
        </View>
        {/* <FlatList
          numColumns={2}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          data={menu}
          renderItem={({item}) => (
            <Button
              type="clear"
              title={item.name}
              titleStyle={[{color: '#fff'}, font.kanit]}
              style={[styles.btn, styles.shadowProp, jewelStyle(item.color)]}
              icon={<Ionicons name={item.icon} size={60} color="#fff" />}
              iconPosition="top"
              onPress={() => {
                navigation.navigate(item.page);
              }}
            />
          )}
        /> */}
        {/* Modal Section */}
        <Modal
          isVisible={isModalVisible}
          onModalWillShow={() => shownModal()}
          style={{justifyContent: 'flex-end'}}
          onBackdropPress={() => setModalVisible(false)}
          onModalHide={() => navigation.setParams({handleTitlePress: false})}>
          <View
            style={{
              margin: -20,
              borderRadius: 30,
              padding: 20,
              height: '40%',
              backgroundColor: '#fff',
            }}>
            <Text style={[font.kanit, {fontSize: 20, alignSelf: 'center'}]}>
              เลือกไร่
            </Text>
            {refreshFarm ? (
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  height: 170,
                  marginTop: 25,
                }}>
                <Skeleton
                  LinearGradientComponent={LinearGradient}
                  animation="wave"
                  height={20}
                  width="75%"
                  style={{borderRadius: 8}}
                />
                <Skeleton
                  LinearGradientComponent={LinearGradient}
                  animation="wave"
                  height={30}
                  width="85%"
                  style={{borderRadius: 8}}
                />
                <Skeleton
                  LinearGradientComponent={LinearGradient}
                  animation="wave"
                  height={45}
                  width="95%"
                  style={{borderRadius: 8}}
                />
                <Skeleton
                  LinearGradientComponent={LinearGradient}
                  animation="wave"
                  height={30}
                  width="85%"
                  style={{borderRadius: 8}}
                />
                <Skeleton
                  LinearGradientComponent={LinearGradient}
                  animation="wave"
                  height={20}
                  width="75%"
                  style={{borderRadius: 8}}
                />
              </View>
            ) : (
              <Picker
                style={{height: -80}}
                ref={pickerRef}
                selectedValue={selectedLanguage}
                onValueChange={(itemValue, itemIndex) => changeFarm(itemValue)}>
                {farmList.map((item, index) => (
                  <Picker.Item
                    key={index}
                    label={item.farm_name}
                    value={item.farm_name}
                  />
                ))}
              </Picker>
            )}
            <View></View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#f2f2f2',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 40,
    margin: 5,
    paddingVertical: 15,
    paddingHorizontal: 25,
    width: '82%',
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
  info: {
    fontSize: 12,
    color: '#696969',
    fontFamily: 'Kanit-Regular',
  },
  scrollView: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
