import React, {useEffect, useState, useRef} from 'react';
import {Picker} from '@react-native-picker/picker';
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
import {Button} from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Feather from 'react-native-vector-icons/dist/Feather';

import {font, buttons} from './styles';
import DiseaseChart from '../components/chart/disease-chart';
import SummaryMap from '../components/map/summaryMap';

import Modal from 'react-native-modal';
export const HomeScreen = ({navigation, route}) => {
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const pickerRef = useRef();
  const [farmList, setFarmList] = useState([]);

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
    {
      name: 'ตั้งค่า',
      color: '#FCC93A',
      page: 'Setting',
      icon: 'settings-outline',
    },
  ]);

  const jewelStyle = options => {
    return {
      backgroundColor: options,
    };
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  useEffect(() => {
    if (route.params.handleTitlePress) {
      setModalVisible(true);
    }
    getSummery();
    // navigation.setParams({handleTitlePress});
  }, [route]);

  const getSummery = async () => {
    const token = await AsyncStorage.getItem('user_token');
    const current_farm = JSON.parse(await AsyncStorage.getItem('user_farm'));

    axios
      .get(
        `http://35.197.128.239.nip.io/v1/farms/${current_farm.farm_uuid}/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(response => {
        console.log(response.data);
        // setFarmList(response.data);
        // setRefreshing(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const changeFarm = item => {
    setSelectedLanguage(item);
    navigation.setParams({name: item});
  };
  const getFarm = async () => {
    const value = await AsyncStorage.getItem('user_token');

    axios
      .get('http://35.197.128.239.nip.io/v1/farms', {
        headers: {
          Authorization: `Bearer ${value}`,
        },
      })
      .then(response => {
        setFarmList(response.data);
        setRefreshing(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const shownModal = async () => {
    const current_farm = JSON.parse(await AsyncStorage.getItem('user_farm'));

    setSelectedLanguage(current_farm.farm_name);
    getFarm();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.card, styles.shadowProp]}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={font.kanit}>
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

        <SummaryMap date="current" time="currnt" />
      </View>

      <FlatList
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
      />
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
          <View></View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 100,
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
});
