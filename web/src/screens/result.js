import React, {useEffect, useState, useRef} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  Dimensions,
  ScrollView,
  useWindowDimensions,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import * as geolib from 'geolib';
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import Feather from 'react-native-vector-icons/dist/Feather';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import {Button, Input, ListItem, Dialog} from '@rneui/base';
import {font} from './styles';

import MapView, {Marker, Polygon, PROVIDER_GOOGLE} from 'react-native-maps';
import moment from 'moment';
import {useSharedValue} from 'react-native-reanimated';
import {
  TabbedHeaderPager,
  DetailsHeaderScrollView,
} from 'react-native-sticky-parallax-header';
import DiseaseDetail from '../components/list/disease-detail';

export const ResultPage = ({route, navigation}) => {
  const {photo, info} = route.params;
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [percentage, setPercentage] = useState(null);
  const [inform, setInform] = useState([]);
  const [nameTh, setNameTh] = useState('');
  const pickerRef = useRef();
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [isInsidePolygon, setIsInsidePolygon] = useState(false);
  const [description, setDescription] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [Pin, setPin] = useState({
    latitude: info.coords.latitude,
    longitude: info.coords.longitude,
    latitudeDelta: 0.003,
    longitudeDelta: 0.003,
  });
  const [location, setLocation] = useState({
    latitude: info.coords.latitude,
    longitude: info.coords.longitude,
    latitudeDelta: 0.003,
    longitudeDelta: 0.003,
  });

  const [editMarker, setEditMarkers] = useState({
    latitude: info.coords.latitude,
    longitude: info.coords.longitude,
  });

  const [ready, setReady] = useState(true);
  const [isEdit, setEdit] = useState(false);
  const [farmLocation, setFarmLocation] = useState();
  const [outOfRange, setOutOfRange] = useState(false);

  const scrollValue = useSharedValue(0);

  const TABS = [
    {
      title: 'เพิ่มข้อมูล',
      component: 'form',
    },
    {
      title: 'ตำแหน่ง',
      component: 'map',
    },
    {
      title: 'ข้อมูลโรค',
      component: 'inform',
    },
  ];

  useEffect(() => {
    getFarmLocation();
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

  function onScroll(e) {
    'worklet';
    scrollValue.value = e.contentOffset.y;
  }
  const getFarmLocation = async () => {
    const current_farm = JSON.parse(await AsyncStorage.getItem('user_farm'));
    setFarmLocation(current_farm.farm_location);
    if (
      geolib.isPointInPolygon(
        {latitude: info.coords.latitude, longitude: info.coords.longitude},
        current_farm.farm_location,
      )
    ) {
      setIsInsidePolygon(true);
    } else {
      setOutOfRange(true);
      setModalVisible(true);
    }
  };
  const diseaseTh = name => {
    switch (name) {
      case 'Healthy':
        return 'ใบสุขภาพดี';

      case 'Bacterial Spot':
        return 'โรคใบจุด';

      case 'Yellow Leaf Curl Virus':
        return 'โรคใบหงิกเหลือง';

      case 'Spider Mites':
        return 'โรคไรสองจุด';

      case 'Septoria Leaf Spot':
        return 'โรคใบจุดวงกลม';

      case 'Mosaic Virus':
        return 'โรคใบด่าง';

      case 'Late Blight':
        return 'โรคใบไหม้';

      case 'Early Blight':
        return 'โรคใบจุดวง';

      case 'Leaf Mold':
        return 'โรครากำมะหยี่';

      default:
        break;
    }
  };

  const saveEditedPin = () => {
    setPin(location);
    setModalVisible(false);
  };

  const cancelEditedPin = () => {
    setEditMarkers(Pin);
    setModalVisible(false);
    setTimeout(() => {
      setOutOfRange(false);
    }, 1000);
  };
  const addMarker = () => {
    setEditMarkers(location);
  };

  const onLocationChange = r => {
    setReady(true);
    setLocation(r);
  };

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

    fetch('http://35.244.169.189.nip.io/v1/prediction', {
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
        setResult(responseData.prediction_result);
        setPercentage(Number(responseData.prediction_score));
        setInform(responseData.disease_info.inform);
        setNameTh(responseData.disease_info.name_th);
      })
      .catch(error => {
        console.log('error:', error);
      });
    setLoading(false);
  };

  const saveResult = async () => {
    const imageUri = photo.path ? 'file://' + photo.path : photo.uri;
    const fileName = photo.fileName
      ? photo.fileName
      : photo.path.split('/').pop();
    const current_farm = JSON.parse(await AsyncStorage.getItem('user_farm'));

    const data = new FormData();

    data.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: fileName,
    });

    data.append('disease', result.replaceAll('"', ''));
    data.append('description', description);
    data.append('latitude', Pin.latitude);
    data.append('longtitude', Pin.longitude);
    data.append('score', percentage.toFixed(2));

    fetch(
      `http://35.244.169.189.nip.io/v1/farms/${current_farm.farm_uuid}/log`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NfdXVpZCI6IjUzYmRhZThlLWMxZTMtNDAzMC1hODVkLWNkMWZhOTNhOWJlNSIsImV4cCI6MTg1MzkyNTA4OCwidXNlcl91dWlkIjoiOGU0ZDgzMjAtOGExOS00NmZjLTgxNTEtN2E2MjI2ZDc2ZjZiIn0.YKjeADsaC5oKaD4bBEkWxTDVbZMH_34j4Vx3bKgeZhc',
        },
        body: data,
      },
    )
      .then(response => response.json())
      .then(responseData => {
        console.log('response:', responseData);
      })
      .catch(error => {
        console.log('error:', error);
      });
    navigation.goBack();
  };

  if (loading)
    return (
      <View style={{flex: 1, paddingVertical: 120, paddingHorizontal: 20}}>
        <Text>Loading</Text>
      </View>
    );

  return (
    <View style={{flex: 1}}>
      <TabbedHeaderPager
        containerStyle={styles.stretchContainer}
        backgroundImage={{
          uri: photo.path ? 'file://' + photo.path : photo.uri,
        }}
        title={
          <TouchableOpacity
            style={{flexDirection: 'column', paddingHorizontal: 10}}>
            <Text style={[font.kanit, {color: '#fff', fontSize: 40}]}>
              {nameTh}
            </Text>

            <Text
              style={[font.kanit, {color: '#fff', fontSize: 13, margin: 0}]}>
              {' '}
              ความแม่นยำ {percentage ? percentage.toFixed(2) : ''} %
            </Text>
          </TouchableOpacity>
        }
        titleStyle={styles.titleStyle}
        tabTextContainerStyle={styles.tabTextContainerStyle}
        tabTextContainerActiveStyle={styles.tabTextContainerActiveStyle}
        tabTextStyle={styles.tabText}
        tabTextActiveStyle={styles.tabTextActiveStyle}
        tabWrapperStyle={styles.tabWrapperStyle}
        tabsContainerStyle={styles.tabsContainerStyle}
        parallaxHeight={280}
        onScroll={onScroll}
        renderHeaderBar={() => (
          <View
            style={{
              height: 90,
              width: '100%',
            }}></View>
        )}
        tabs={TABS}
        showsVerticalScrollIndicator={false}>
        {TABS.map((tab, i) => {
          switch (tab.component) {
            case 'map':
              return (
                <View key={i} style={[{height: 710}]}>
                  <MapView
                    mapType="satellite"
                    region={Pin}
                    // provider={PROVIDER_GOOGLE}
                    style={{
                      height: 300,
                      width: '90%',
                      borderRadius: 30,
                      alignSelf: 'center',
                      overflow: 'hidden',
                      marginVertical: 20,
                    }}
                    moveOnMarkerPress={false}
                    pitchEnabled={false}
                    scrollEnabled={false}
                    // zoomEnabled={false}
                    initialRegion={{
                      latitude: info.coords.latitude,
                      longitude: info.coords.longitude,
                      latitudeDelta: 0.003,
                      longitudeDelta: 0.003,
                    }}>
                    <Marker coordinate={Pin} />
                    <Polygon
                      coordinates={farmLocation}
                      fillColor="rgba(255, 0, 0, 0.15)"
                      strokeColor="rgba(255, 0, 0, 1)"
                      strokeWidth={2}
                    />
                  </MapView>
                  <TouchableOpacity
                    style={{
                      alignSelf: 'flex-end',
                      marginHorizontal: 40,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                    onPress={() => {
                      setModalVisible(!isModalVisible);
                    }}>
                    <Text style={[font.kanit]}>แก้หมุด</Text>
                    <Feather name="edit-3" size={30} color="#000" />
                  </TouchableOpacity>
                </View>
              );
            case 'form':
              return (
                <View key={i} style={[styles.contentContainer]}>
                  <Text
                    style={[
                      font.kanit,
                      {fontSize: 25, alignSelf: 'center', marginBottom: 10},
                    ]}>
                    {/* {JSON.stringify(result)} */}
                    {/* {selectedDisease} */}
                    {nameTh}
                    <TouchableOpacity onPress={() => setEdit(true)}>
                      <Feather name="edit-3" size={30} color="#000" />
                    </TouchableOpacity>
                  </Text>

                  <Input
                    placeholder="เพิ่มคำอธิบาย"
                    onChangeText={newText => setDescription(newText)}
                    defaultValue={description}
                    inputStyle={[font.kanit]}
                    style={{
                      alignSelf: 'center',
                      textAlign: 'center',
                    }}
                  />
                  <Button
                    size="lg"
                    loading={!result}
                    onPress={saveResult}
                    style={{marginHorizontal: 20}}
                    buttonStyle={{
                      borderRadius: 10,
                      backgroundColor: '#047675',
                    }}>
                    <Text style={[font.kanit, {fontSize: 20, color: '#fff'}]}>
                      บันทึก
                    </Text>
                  </Button>
                </View>
              );
            case 'inform':
              return (
                <View key={i} style={{backgroundColor: '#fff'}}>
                  <View style={{alignSelf: 'center', paddingVertical: 15}}>
                    <Text style={[font.kanit, {fontSize: 24}]}>{nameTh}</Text>
                    <Text style={[font.kanit, {alignSelf: 'center'}]}>
                      {result}
                    </Text>
                  </View>
                  <ScrollView scrollEnabled={true} style={{height: 600}}>
                    <FlatList
                      data={inform.inform_data}
                      renderItem={({item, index}) => (
                        <DiseaseDetail item={item} />
                      )}
                      keyExtractor={item => item.title.toString()}
                    />
                  </ScrollView>
                </View>
              );
            default:
              return <Text key={i}>No Component</Text>;
          }
        })}
      </TabbedHeaderPager>

      {/* Modal */}
      {/* <Modal
        isVisible={outOfRange}
        swipeDirection={['down', 'up']}
        onSwipeComplete={() => {
          setOutOfRange(false);
        }}
        onBackdropPress={() => {
          setOutOfRange(false);
        }}>
        <View
          style={{
            borderRadius: 30,
            padding: 20,
            height: '25%',
            backgroundColor: '#fff',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          <Text style={[font.kanit, {fontSize: 24}]}>แจ้งเตือน</Text>
          <Text style={[font.kanit, {textAlign: 'center'}]}>
            จุดที่ถ่ายรูปอยู่นอกบริเวณไร่
          </Text>
          <Text style={[font.kanit, {textAlign: 'center'}]}>
            ต้องการที่จะเปลี่ยนหมุดหรือไม่
          </Text>

          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignSelf: 'flex-end',
            }}>
            <Button
              onPress={() => {
                setOutOfRange(false);
              }}
              radius={'xl'}
              type="solid"
              size="sm"
              titleStyle={[font.kanit]}
              buttonStyle={{backgroundColor: '#E72970'}}
              containerStyle={{width: '45%', marginBottom: 10}}>
              ยกเลิก
              <MaterialCommunityIcons
                name="close"
                size={20}
                style={{marginHorizontal: 2}}
                color="white"
              />
            </Button>
            <Button
              onPress={() => {
                setOutOfRange(false);
              }}
              radius={'xl'}
              type="solid"
              size="sm"
              buttonStyle={{backgroundColor: '#047675'}}
              titleStyle={font.kanit}
              containerStyle={{width: '45%', marginBottom: 10}}>
              เปลี่ยนหมุด
              <MaterialIcons
                name="location-pin"
                size={20}
                style={{marginHorizontal: 2}}
                color="white"
              />
            </Button>
          </View>
        </View>
      </Modal> */}
      <Modal
        isVisible={isModalVisible}
        style={{justifyContent: 'flex-end'}}
        onBackdropPress={cancelEditedPin}>
        {!outOfRange ? (
          <View
            style={{
              margin: -20,
              borderRadius: 30,
              padding: 20,
              height: '75%',
              backgroundColor: '#fff',
            }}>
            {/* <Text>
            {location.latitude} {location.longitude}
          </Text> */}
            <MapView
              mapType="satellite"
              onRegionChange={region => onLocationChange(region)}
              onRegionChangeComplete={() => setReady(false)}
              // provider={PROVIDER_GOOGLE}
              showsUserLocation
              region={Pin}
              style={{
                height: 400,
                width: '100%',
                borderRadius: 30,
                alignSelf: 'center',
                overflow: 'hidden',
              }}
              initialRegion={Pin}>
              <Marker coordinate={editMarker} />
              {/* {markers.map((marker, index) => (
              <Marker key={index} coordinate={marker} />
            ))} */}
              <Polygon
                coordinates={farmLocation}
                fillColor="rgba(255, 0, 0, 0.15)"
                strokeColor="rgba(255, 0, 0, 1)"
                strokeWidth={2}
              />
            </MapView>
            <View style={{position: 'absolute', top: '35%', left: '50%'}}>
              <Feather name="crosshair" size={40} color="#000" />
            </View>

            <Button
              onPress={addMarker}
              size="lg"
              disabled={ready}
              buttonStyle={{
                paddingHorizontal: 30,
                marginHorizontal: 30,
                marginVertical: 10,

                borderRadius: 10,
                backgroundColor: '#047675',
              }}>
              {/* <ActivityIndicator /> */}
              <Text style={[font.kanit, {fontSize: 20, color: '#fff'}]}>
                <MaterialIcons name="location-pin" size={20} color="#fff" />
                เลือกตำแหน่ง
              </Text>
            </Button>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginVertical: 10,
              }}>
              <Button
                onPress={cancelEditedPin}
                size="lg"
                icon={<Feather name="x" size={20} color="#fff" />}
                buttonStyle={{
                  paddingHorizontal: 30,
                  borderRadius: 10,
                  backgroundColor: '#E72970',
                }}>
                <Text
                  style={[
                    font.kanit,
                    {fontSize: 20, color: '#fff', marginLeft: 5},
                  ]}>
                  ยกเลิก
                </Text>
              </Button>
              <Button
                onPress={saveEditedPin}
                size="lg"
                icon={<Feather name="check" size={20} color="#fff" />}
                buttonStyle={{
                  paddingHorizontal: 30,

                  borderRadius: 10,
                  backgroundColor: '#047675',
                }}>
                <Text
                  style={[
                    font.kanit,
                    {fontSize: 20, color: '#fff', marginLeft: 5},
                  ]}>
                  บันทึก
                </Text>
              </Button>
            </View>
            <View></View>
          </View>
        ) : (
          <View
            style={{
              borderRadius: 30,
              padding: 20,
              height: '30%',
              backgroundColor: '#fff',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
            }}>
            <Text style={[font.kanit, {fontSize: 24}]}>แจ้งเตือน</Text>
            <View>
              <Text style={[font.kanit, {textAlign: 'center'}]}>
                จุดที่ถ่ายรูปอยู่นอกบริเวณไร่
              </Text>
              <Text style={[font.kanit, {textAlign: 'center'}]}>
                ต้องการที่จะเปลี่ยนหมุดหรือไม่
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignSelf: 'flex-end',
              }}>
              <Button
                onPress={() => {
                  setModalVisible(false);

                  setTimeout(() => {
                    setOutOfRange(false);
                  }, 1000);
                }}
                radius={'xl'}
                type="solid"
                size="sm"
                titleStyle={[font.kanit]}
                buttonStyle={{backgroundColor: '#E72970'}}
                containerStyle={{width: '45%', marginBottom: 10}}>
                ยกเลิก
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  style={{marginHorizontal: 2}}
                  color="white"
                />
              </Button>
              <Button
                onPress={() => {
                  setOutOfRange(false);
                }}
                radius={'xl'}
                type="solid"
                size="sm"
                buttonStyle={{backgroundColor: '#047675'}}
                titleStyle={font.kanit}
                containerStyle={{width: '45%', marginBottom: 10}}>
                เปลี่ยนหมุด
                <MaterialIcons
                  name="location-pin"
                  size={20}
                  style={{marginHorizontal: 2}}
                  color="white"
                />
              </Button>
            </View>
          </View>
        )}
      </Modal>

      <Modal
        isVisible={isEdit}
        style={{justifyContent: 'flex-end'}}
        onBackdropPress={() => setEdit(false)}>
        <View
          style={{
            margin: -20,
            borderRadius: 30,
            padding: 20,
            height: '45%',
            backgroundColor: '#fff',
          }}>
          <Picker
            ref={pickerRef}
            itemStyle={font.kanit}
            selectedValue={selectedDisease}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedDisease(itemValue)
            }>
            <Picker.Item label="ใบสุขภาพดี" value="Healthy" />

            <Picker.Item label="โรคใบจุด" value="Bacterial Spot" />
            <Picker.Item
              label="โรคใบหงิกเหลือง"
              value="Yellow Leaf Curl Virus"
            />
            <Picker.Item label="โรคไรสองจุด" value="Spider Mites" />
            <Picker.Item label="โรคใบจุดวงกลม" value="Septoria Leaf Spot" />
            <Picker.Item label="โรคใบด่าง" value="Mosaic Virus" />
            <Picker.Item label="โรคใบไหม้" value="Late Blight" />
            <Picker.Item label="โรคใบจุดวง" value="Early Blight" />
            <Picker.Item label="โรครากำมะหยี่" value="Leaf Mold" />
          </Picker>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignSelf: 'flex-end',
            }}>
            <Button
              onPress={() => {
                setSelectedDisease(null);
              }}
              radius={'xl'}
              type="solid"
              size="sm"
              titleStyle={[font.kanit]}
              buttonStyle={{backgroundColor: '#E72970'}}
              containerStyle={{width: '45%', marginBottom: 10}}>
              ยกเลิก
              <MaterialCommunityIcons
                name="close"
                size={20}
                style={{marginHorizontal: 2}}
                color="white"
              />
            </Button>
            <Button
              onPress={() => {
                setResult(selectedDisease);
                setNameTh(diseaseTh(selectedDisease));
                setPercentage(100);
              }}
              radius={'xl'}
              type="solid"
              size="sm"
              buttonStyle={{backgroundColor: '#047675'}}
              titleStyle={font.kanit}
              containerStyle={{width: '45%', marginBottom: 10}}>
              ตกลง
              <MaterialIcons
                name="check"
                size={20}
                style={{marginHorizontal: 2}}
                color="white"
              />
            </Button>
          </View>
        </View>
      </Modal>
    </View>
    //</View>
  );
};
const styles = StyleSheet.create({
  titleStyle: {
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    color: '#fff',
    position: 'absolute',
    zIndex: 99,
    marginTop: -50,
  },
  tabTextContainerStyle: {
    borderRadius: 18,
  },
  tabTextContainerActiveStyle: {
    backgroundColor: '#047675',
  },
  tabText: {
    color: '#000',
    fontFamily: 'Kanit',
    fontSize: 16,
    lineHeight: 20,
    paddingHorizontal: 12,

    paddingVertical: 8,
  },
  tabTextActiveStyle: {
    fontFamily: 'Kanit',
    fontSize: 16,
    color: '#fff',

    lineHeight: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tabWrapperStyle: {
    paddingVertical: 5,
  },
  tabsContainerStyle: {
    backgroundColor: '#F2f2f2',
  },
  contentContainer: {
    padding: 10,
  },
  contentText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 25,
  },
  stretchContainer: {
    alignSelf: 'stretch',
    flex: 1,
  },
});
