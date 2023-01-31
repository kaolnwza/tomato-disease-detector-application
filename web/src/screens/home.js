import React, {useEffect, useState, useRef} from 'react';
import {Picker} from '@react-native-picker/picker';
import {Text, StyleSheet, FlatList, View, TouchableOpacity} from 'react-native';
import {Button} from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import {font, buttons} from './styles';
import DiseaseChart from '../components/chart/disease-chart';
import SummaryMap from '../components/map/summaryMap';

import Modal from 'react-native-modal';
export const HomeScreen = ({navigation, route}) => {
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const pickerRef = useRef();

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
  useEffect(() => {
    if (route.params.handleTitlePress) {
      setModalVisible(true);
    }
    // navigation.setParams({handleTitlePress});
  }, [route]);

  const changeFarm = item => {
    setSelectedLanguage(item);
    navigation.setParams({name: item});
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.card, styles.shadowProp]}
        // onPress={() => {
        //   navigation.navigate('Summary');
        // }}
      >
        <Text style={font.kanit}>
          <Text style={{fontSize: 24}}>สรุปข้อมูล</Text> ภาพรวมวันนี้
        </Text>

        <SummaryMap date="current" time="currnt" />
        {/* <DiseaseChart
          date="current"
          time="currnt"
          img={29}
          healthy={85}
          disease={15}
        /> */}
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
            <Picker.Item label="FARM 1" value="FARM 1" />
            <Picker.Item label="FARM 2" value="FARM 2" />
            <Picker.Item label="FARM 3" value="FARM 3" />
            <Picker.Item label="FARM 4" value="FARM 4" />
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
    backgroundColor: '#F0F9F8',
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
