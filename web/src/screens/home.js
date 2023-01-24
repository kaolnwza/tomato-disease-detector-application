import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, FlatList, View, TouchableOpacity} from 'react-native';
import {Button} from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import {font, buttons} from './styles';
import DiseaseChart from '../components/chart/disease-chart';
export const HomeScreen = ({navigation}) => {
  const [menu, setMenu] = useState([
    {
      name: 'ประวัติการบันทึก',
      page: 'History',
      color: '#047675',
      icon: 'list-outline',
    },
    {name: 'กล้อง', page: 'Camera', color: '#E72970', icon: 'camera-outline'},
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

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.card, styles.shadowProp]}
        onPress={() => {
          navigation.navigate('Summary');
        }}>
        <Text style={font.kanit}>
          <Text style={{fontSize: 24}}>สรุปข้อมูล</Text> ภาพรวมวันนี้
        </Text>
        <DiseaseChart
          date="current"
          time="currnt"
          img={29}
          healthy={85}
          disease={15}
        />
      </TouchableOpacity>

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
    height: 150,
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
