import React, {useEffect, useState, useRef} from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SpeedDial, Skeleton, Divider, Chip} from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/dist/Feather';

import {font, buttons} from './styles';
import ActionSheet from 'react-native-actions-sheet';
import DatepickerRange from 'react-native-range-datepicker';
import DiseaseChart from '../components/chart/disease-chart';
import moment from 'moment';
import MapView, {Marker, Polygon} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import LinearGradient from 'react-native-linear-gradient';
var RNFS = require('react-native-fs');
import XLSX from 'xlsx';

import Lottie from 'lottie-react-native';

const Summary = ({navigation}) => {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState('7 วัน');

  const [list, setList] = useState([]);
  const actionSheetRef = useRef();
  const exportedRef = useRef();
  const animationRef = useRef();
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days'));
  const [endDate, setEndDate] = useState(moment());
  const [refreshing, setRefreshing] = useState(true);
  const [farmLocation, setFarmLocation] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [location, setLocation] = useState();
  const [refreshMap, setRefreshMap] = useState(true);
  const [loadData, setLoadData] = useState(true);

  const [chipFilter, setChipFilter] = useState([
    {
      label: '1 วัน',
      value: 1,
    },
    {
      label: '3 วัน',
      value: 3,
    },
    {
      label: '7 วัน',
      value: 7,
    },
    {
      label: '1 เดือน',
      value: 31,
    },
  ]);

  const onRefresh = React.useCallback(() => {
    getPercentage();
    setRefreshing(true);
  }, []);

  useEffect(() => {
    getSummery();
    getPercentage();
  }, []);

  useEffect(() => {
    getSummery();
    getPercentage();
    setRefreshMap(true);
    setLocation(null);
  }, [startDate]);

  const getSummery = async () => {
    const token = await AsyncStorage.getItem('user_token');
    const current_farm = JSON.parse(await AsyncStorage.getItem('user_farm'));

    setFarmLocation(current_farm.farm_location);
    axios
      .get(
        `http://34.110.173.162/v1/farms/${
          current_farm.farm_uuid
        }/summary?start_time=${startDate.format(
          'YYYY-MM-DD',
        )} 00:00:00&end_time=${endDate.format('YYYY-MM-DD')} 23:59:59`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(response => {
        // console.log(response.data);
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
              latitudeDelta: 0.003,
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

  const getPercentage = async () => {
    const token = await AsyncStorage.getItem('user_token');
    const current_farm = JSON.parse(await AsyncStorage.getItem('user_farm'));

    axios
      .get(
        `http://34.110.173.162/v1/farms/${
          current_farm.farm_uuid
        }/percentage?start_time=${startDate.format(
          'YYYY-MM-DD',
        )} 00:00:00&end_time=${endDate.format('YYYY-MM-DD')} 23:59:59`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(response => {
        console.log(response.data);

        setList(response.data);
        setLoadData(false);
      })
      .catch(error => {
        console.log('error', error);
      });
    setRefreshing(false);
  };

  const filterSummary = async (start, end) => {
    const token = await AsyncStorage.getItem('user_token');
    const current_farm = JSON.parse(await AsyncStorage.getItem('user_farm'));
    axios
      .get(
        `http://34.110.173.162/v1/farms/${current_farm.farm_uuid}/percentage?start_time=${start} 00:00:00&end_time=${end} 23:59:59`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(response => {
        setList(response.data);
      })
      .catch(error => {
        console.log('error', error);
      });
    actionSheetRef.current?.hide();
  };
  const sum = list.reduce((accumulator, object) => {
    return accumulator + object.total_log;
  }, 0);
  const keyExtractor = (item, index) => index.toString();

  const exportDataToExcel = () => {
    let sample_data_to_export = list;

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(sample_data_to_export);
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    const wbout = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});

    // Write generated excel to Storage
    RNFS.writeFile(
      `${RNFS.DocumentDirectoryPath}/${startDate.format(
        'DD_MM_YYYY',
      )} ~ ${endDate.format('DD_MM_YYYY')}_Tomato_Analyst.xlsx`,
      wbout,
      'ascii',
    )
      .then(r => {
        console.log('Success');
        exportedRef.current?.show();
        setTimeout(() => {
          exportedRef.current?.hide();
        }, 3000);
      })
      .catch(e => {
        console.log('Error', e);
      });
  };

  return (
    <View style={styles.container}>
      {/* <Text>{range}</Text> */}
      <View
        style={{
          flexDirection: 'row',
          marginBottom: 10,
          alignSelf: 'center',
        }}>
        {chipFilter.map((item, i) => (
          <Chip
            key={i}
            size="sm"
            title={item.label}
            onPress={() => {
              setRange(item.label);
              setStartDate(moment().subtract(item.value, 'days'));
            }}
            type="outline"
            titleStyle={[
              font.kanit,
              {
                color: range === item.label ? '#fff' : '#000',
              },
            ]}
            buttonStyle={{
              borderRadius: 40,
              paddingHorizontal: 15,
              backgroundColor: range === item.label ? '#047675' : '#ffffff00',
            }}
            containerStyle={{marginHorizontal: 5}}
          />
        ))}
      </View>
      <SpeedDial
        isOpen={open}
        icon={{name: 'edit', color: '#fff'}}
        openIcon={{name: 'close', color: '#fff'}}
        style={{zIndex: 99}}
        onOpen={() => setOpen(!open)}
        onClose={() => setOpen(!open)}>
        <SpeedDial.Action
          icon={<MaterialCommunityIcons name="export" size={20} color="#fff" />}
          color="#047675"
          title="ส่งออกข้อมูล"
          titleStyle={[font.kanit, {backgroundColor: '#fff'}]}
          onPress={() => {
            exportDataToExcel();
          }}
        />
        <SpeedDial.Action
          icon={
            <MaterialCommunityIcons
              name="filter-variant"
              size={20}
              color="#fff"
            />
          }
          color="#047675"
          title="กรองข้อมูล"
          titleStyle={[font.kanit, {backgroundColor: '#fff'}]}
          onPress={() => {
            actionSheetRef.current?.show();
          }}
        />
      </SpeedDial>
      {/* <TouchableOpacity
        onPress={() => actionSheetRef.current?.show()}
        style={{
          borderRadius: 50,
          backgroundColor: '#047675',
          padding: 10,
          bottom: 50,
          right: 20,
          zIndex: 1,
          position: 'absolute',
        }}>
        <MaterialCommunityIcons name="filter-variant" size={35} color="#fff" />
      </TouchableOpacity> */}
      <View style={[styles.card, styles.shadowProp]}>
        <Text style={font.kanit}>
          <Text style={{fontSize: 24}}>ช่วงเวลา {range}</Text>
          <Text style={styles.info}> รูปทั้งหมด {sum} ต้น</Text>
        </Text>
        <Text style={styles.info}>
          {startDate.format('DD/MM/YYYY') +
            ' - ' +
            endDate.format('DD/MM/YYYY')}
        </Text>

        {location ? (
          <>
            <View style={(styles.container, {paddingVertical: 5})}>
              <MapView
                // provider={PROVIDER_GOOGLE}
                mapType="satellite"
                style={{
                  height: 150,
                  width: '100%',
                  borderRadius: 30,
                }}
                showsUserLocation={true}
                initialRegion={location}>
                {markers.map((coordinate, index) => (
                  <Marker key={index} coordinate={coordinate} />
                ))}
                <Polygon
                  coordinates={farmLocation}
                  fillColor="rgba(255, 255, 255, 0.1)"
                  strokeColor="rgba(255, 0, 0, 1)"
                  strokeWidth={2}
                />
              </MapView>
            </View>
            {/* <DiseaseChart date={[startDate, endDate]} img={sum} disease={20} /> */}

            {/* <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <Text style={styles.info}>{moment().format('DD/MM/YYYY')}</Text>
              <Text style={styles.info}>โรคใบไหม้ 10%</Text>
              <Text style={styles.info}>
                เกิดโรคทั้งหมด {markers.length} ต้น
              </Text>
            </View> */}
          </>
        ) : refreshMap ? (
          <View
            style={
              (styles.container, {paddingVertical: 5, alignItems: 'center'})
            }>
            <Skeleton
              LinearGradientComponent={LinearGradient}
              animation="wave"
              style={{borderRadius: 30}}
              width="100%"
              height={150}
            />
          </View>
        ) : (
          <Text
            style={[
              font.kanit,
              {fontSize: 12, alignSelf: 'center', color: '#00000055'},
            ]}>
            วันนี้มีข้อมูลน้อยเกินไปที่จะคำนวณ
          </Text>
        )}
      </View>

      {loadData ? (
        <View
          style={{
            flex: 1,
            paddingHorizontal: 15,
            width: '85%',
          }}>
          {[...Array(4)].map((_, index) => (
            <View key={index}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginVertical: 5,
                  backgroundColor: '#fff',
                  borderRadius: 40,

                  paddingHorizontal: 20,
                  paddingVertical: 5,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                  }}>
                  <Skeleton
                    LinearGradientComponent={LinearGradient}
                    animation="wave"
                    circle
                    // skeletonStyle={{}}
                    width={60}
                    height={60}
                  />
                  <View
                    style={{justifyContent: 'space-evenly', marginLeft: 10}}>
                    <Skeleton
                      LinearGradientComponent={LinearGradient}
                      animation="wave"
                      width={100}
                      height={15}
                      style={{borderRadius: 30}}
                    />
                    <Skeleton
                      LinearGradientComponent={LinearGradient}
                      animation="wave"
                      width={80}
                      height={10}
                      style={{borderRadius: 30}}
                    />
                    <Skeleton
                      LinearGradientComponent={LinearGradient}
                      animation="wave"
                      width={80}
                      height={10}
                      style={{borderRadius: 30}}
                    />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          keyExtractor={keyExtractor}
          style={{width: '100%', paddingHorizontal: 40}}
          data={list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('daily', {date: item.created_at})
              }
              style={[styles.cardSmall, styles.shadowProp, {}]}>
              <DiseaseChart
                date={item.created_at}
                img={item.total_log}
                disease={item.disease_percentage}
              />
            </TouchableOpacity>
          )}
        />
      )}
      {/* <View style={{width: '82%'}}>
        {list.map((item, i) => (
          <TouchableOpacity
            key={i}
            onPress={() =>
              navigation.navigate('daily', {date: item.created_at})
            }
            style={[styles.cardSmall, styles.shadowProp, {}]}>
            <DiseaseChart
              date={item.created_at}
              img={item.total_log}
              disease={item.disease_percentage}
            />
          </TouchableOpacity>
        ))}
      </View> */}
      <ActionSheet
        ref={exportedRef}
        containerStyle={{
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}
        gestureEnabled={true}
        indicatorStyle={{
          width: 100,
        }}>
        <View style={{paddingTop: 40}}>
          <Lottie
            style={{height: 120}}
            loop={false}
            source={{
              uri: 'https://assets8.lottiefiles.com/datafiles/K6S8jDtSdQ7EPjH/data.json',
            }}
          />
          <Text
            style={[
              font.kanit,
              {
                fontSize: 20,
                textAlign: 'center',
              },
            ]}>
            บันทึกเสร็จแล้ว
          </Text>
        </View>
      </ActionSheet>

      <ActionSheet
        ref={actionSheetRef}
        containerStyle={{
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}
        indicatorStyle={{
          width: 100,
        }}>
        <View style={{height: 550}}>
          <DatepickerRange
            maxMonth={4}
            maxDate={moment().format('L')}
            initialMonth={moment().subtract(3, 'months').format('YYYYMM')}
            onClose={() => actionSheetRef.current?.hide()}
            selectedBackgroundColor="#047675"
            onConfirm={(start, until) => {
              setStartDate(moment(new Date(start)));
              setEndDate(
                until ? moment(new Date(until)) : moment(new Date(start)),
              );

              filterSummary(
                moment(new Date(start)).format('YYYY-MM-DD'),
                until
                  ? moment(new Date(until)).format('YYYY-MM-DD')
                  : moment(new Date(start)).format('YYYY-MM-DD'),
              );
            }}
          />
        </View>
      </ActionSheet>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 100,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 40,
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '82%',
    maxHeight: 240,
  },
  cardSmall: {
    backgroundColor: 'white',
    borderRadius: 40,
    margin: 5,
    paddingTop: 5,
    paddingBottom: 10,
    paddingHorizontal: 10,
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
  chipButtonSelected: {
    backgroundColor: '#047675',
  },
});
export default Summary;
