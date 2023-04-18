import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, FlatList, View, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/dist/Octicons';
import MapView, {Marker, Polygon} from 'react-native-maps';
import {font, buttons} from './styles';
import {Tab, TabView, Button, Divider, Chip} from '@rneui/themed';
import moment from 'moment';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import {ScrollView} from 'react-native-gesture-handler';

const Daily = ({route, navigation}) => {
  const [index, setIndex] = useState(0);
  const {date} = route.params;
  const allDisease = [
    {label: 'ใบสุขภาพดี', value: 'Healthy', color: '#047675'},
    {
      label: 'โรคใบหงิกเหลือง',
      value: 'Yellow Leaf Curl Virus',
      color: '#FFD93D',
    },
    {label: 'โรคใบจุด', value: 'Bacterial Spot', color: '#F99417'},
    {label: 'โรคใบไหม้', value: 'Late Blight', color: '#562B08'},
    {label: 'โรคไรสองจุด', value: 'Spider Mites', color: '#DF2E38'},
    {label: 'โรคใบจุดวงกลม', value: 'Septoria Leaf Spot', color: '#A61F69'},
    {label: 'โรคใบด่าง', value: 'Mosaic Virus', color: '#645CBB'},
    {label: 'โรคใบจุดวง', value: 'Early Blight', color: '#3A1078'},
    {label: 'โรครากำมะหยี่', value: 'Leaf Mold', color: '#F6E1C3'},
  ];
  const [pins, setPins] = useState();
  const [center, setCenter] = useState();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [farmLocation, setFarmLocation] = useState([]);

  useEffect(() => {
    navigation.addListener('focus', getSummery);
  }, []);

  const handleSelectItem = itemValue => {
    if (selectedItems.includes(itemValue)) {
      // If the item is already selected, remove it from the selected items list
      setSelectedItems(prevSelectedItems =>
        prevSelectedItems.filter(selectedItem => selectedItem !== itemValue),
      );
    } else {
      // If the item is not selected, add it to the selected items list
      setSelectedItems(prevSelectedItems => [...prevSelectedItems, itemValue]);
    }
  };

  const isItemSelected = itemValue => selectedItems.includes(itemValue);
  const handleCloseModal = () => {
    setIsVisible(false);
  };
  const getSummery = async () => {
    const token = await AsyncStorage.getItem('user_token');
    const current_farm = JSON.parse(await AsyncStorage.getItem('user_farm'));
    const dateTime = moment(date).format('YYYY-MM-DD');
    setFarmLocation(current_farm.farm_location);

    axios
      .get(
        `http://35.244.169.189.nip.io/v1/farms/${current_farm.farm_uuid}/summary?start_time=${dateTime} 00:00:00&end_time=${dateTime} 23:59:59`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(response => {
        setPins(response.data.info);
        setCenter(response.data.center_location);
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  const getDiseaseObject = item => {
    const disease = allDisease.find(e => e.value === item.disease_name);
    return disease ? disease : null;
  };

  // const filteredPin = pins.filter(p => selectedItems.includes(p.disease_name));

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        style={[
          styles.shadowProp,
          {
            borderRadius: 50,
            backgroundColor: '#AD1357',
            padding: 10,
            bottom: 50,
            right: 20,
            zIndex: 1,
            position: 'absolute',
          },
        ]}>
        <MaterialCommunityIcons name="filter-variant" size={35} color="#fff" />
      </TouchableOpacity>
      <View style={[styles.card]}>
        <Text style={[font.kanit, {fontSize: 20}]}>
          ตรววจจับโรคได้ {pins ? pins.length : null} รูป
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}>
          {allDisease.map((item, i) => {
            const count = pins
              ? pins.filter(pin => pin.disease_name === item.value).length
              : 0;
            return (
              <View
                key={i}
                style={{flexDirection: 'row', alignItems: 'center', margin: 2}}>
                <Octicons
                  name="dot-fill"
                  color={item.color}
                  size={30}
                  style={{marginHorizontal: 10}}
                />

                <Text key={i} style={font.kanit}>
                  {item.label} {count != 0 ? `(${count})` : null}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
      {center ? (
        <MapView
          mapType="satellite"
          // region={Pin}
          // provider={PROVIDER_GOOGLE}
          style={[
            styles.shadowProp,
            {
              marginTop: -30,
              height: 500,
              width: '100%',
              borderRadius: 40,
              alignSelf: 'center',
            },
          ]}
          initialRegion={{
            latitude: center.latitude,
            longitude: center.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          }}>
          {selectedItems.length <= 0
            ? pins.map((item, index) => (
                <Marker
                  key={index}
                  title={item.disease_name}
                  pinColor={getDiseaseObject(item).color}
                  coordinate={{
                    latitude: item.latitude,
                    longitude: item.longitude,
                  }}
                />
              ))
            : pins
                .filter(p => selectedItems.includes(p.disease_name))
                .map((item, index) => (
                  <Marker
                    key={index}
                    title={item.disease_name}
                    pinColor={getDiseaseObject(item).color}
                    coordinate={{
                      latitude: item.latitude,
                      longitude: item.longitude,
                    }}
                  />
                ))}
          <Polygon
            coordinates={farmLocation}
            fillColor="rgba(255, 255, 255, 0.1)"
            strokeColor="rgba(255, 0, 0, 1)"
            strokeWidth={2}
          />
        </MapView>
      ) : null}

      <Modal
        isVisible={isVisible}
        onBackdropPress={handleCloseModal}
        onSwipeComplete={handleCloseModal}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        swipeDirection="right"
        style={styles.modal}>
        <View style={styles.modalContent}>
          <View>
            <Text
              style={[font.kanit, {color: '#00000077', marginHorizontal: 10}]}>
              หมวดหมู่โรค
            </Text>
            <Divider style={{marginVertical: 10}} />
            <View
              style={
                {
                  // flexDirection: 'row',
                  // flexWrap: 'wrap',
                }
              }>
              {allDisease.map((item, i) => (
                <Chip
                  key={i}
                  title={item.label}
                  buttonStyle={[
                    styles.chipButton,
                    isItemSelected(item.value) && {backgroundColor: item.color},
                  ]}
                  titleStyle={[
                    styles.chipTitle,
                    isItemSelected(item.value) && styles.chipTitleSelected,
                    font.kanit,
                  ]}
                  onPress={() => handleSelectItem(item.value)}
                  type="outline"
                />
              ))}
              {/* <Text>{JSON.stringify(selectedItems)}</Text> */}
            </View>
          </View>
          <Button
            style={{marginVertical: 10}}
            buttonStyle={{borderRadius: 30}}
            titleStyle={font.kanit}
            title="รีเซ็ตข้อมูล"
            size="sm"
            onPress={() => setSelectedItems([])}
          />
          {/* <Text
            style={[font.kanit, {color: '#00000077', marginHorizontal: 10}]}>
            วัน
          </Text>
          <Divider style={{marginVertical: 5}} /> */}
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignContent: 'center',
    paddingTop: 90,
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: 'white',

    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,

    paddingVertical: 15,
    paddingHorizontal: 25,
    paddingBottom: 40,
    width: '100%',
  },
  shadowProp: {
    shadowOffset: {width: 0, height: 4},
    shadowColor: '#171717',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 14,
  },
  headerTabs: {
    width: '100%',
    height: 70,
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    justifyContent: 'flex-start',
    margin: 0,
    alignSelf: 'flex-end',
  },
  modalContent: {
    height: '100%',
    width: 300,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  chipButton: {
    paddingHorizontal: 20,
    margin: 5,
    borderColor: 'gray',
    backgroundColor: 'white',
  },
  chipButtonSelected: {
    backgroundColor: '#047675',
  },
  chipTitle: {
    color: 'gray',
  },
  chipTitleSelected: {
    color: 'white',
  },
});

export default Daily;
