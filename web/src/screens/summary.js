import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, FlatList, View, TouchableOpacity} from 'react-native';
import {Button} from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import {font, buttons} from './styles';

import DiseaseChart from '../components/chart/disease-chart';

const Summary = () => {
  const list = [
    {
      date: '2022-03-25',
      time: '10.23',
      img: 10,
      healthy: 91,
      disease: 8,
    },
  ];
  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({item}) => (
    <TouchableOpacity style={[styles.cardSmall, styles.shadowProp]}>
      <DiseaseChart
        date={item.date}
        time={item.time}
        img={item.img}
        healthy={item.healthy}
        disease={item.disease}
      />
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <View style={[styles.card, styles.shadowProp]}>
        <Text style={font.kanit}>
          <Text style={{fontSize: 24}}>ช่วงเวลา</Text>
        </Text>
        <DiseaseChart
          date={['2022-11-25', '2022-12-19']}
          time="currnt"
          img={29}
          healthy={85}
          disease={15}
        />
      </View>
      <FlatList
        style={{width: '82%'}}
        keyExtractor={keyExtractor}
        data={list}
        renderItem={renderItem}
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
  cardSmall: {
    backgroundColor: 'white',
    borderRadius: 40,
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  shadowProp: {
    shadowOffset: {width: 0, height: 4},
    shadowColor: '#171717',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 14,
  },
});
export default Summary;
