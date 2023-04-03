import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button} from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import {font, buttons} from './styles';

import DiseaseChart from '../components/chart/disease-chart';
import moment from 'moment';

const Summary = ({navigation}) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    navigation.addListener('focus', getSummery);
  }, []);

  const getSummery = async () => {
    const token = await AsyncStorage.getItem('user_token');
    const current_farm = JSON.parse(await AsyncStorage.getItem('user_farm'));

    axios
      .get(
        `http://35.244.169.189.nip.io/v1/farms/${current_farm.farm_uuid}/percentage?start_time=2023-03-01 00:00:00&end_time=2023-04-30 23:59:59`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(response => {
        console.log(response.data);
        setList(response.data);
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.card, styles.shadowProp]}>
        <Text style={font.kanit}>
          <Text style={{fontSize: 24}}>ช่วงเวลา</Text>
        </Text>
        <DiseaseChart
          date={['2023-03-01', '2023-03-30']}
          img={29}
          disease={20}
        />
      </View>

      <View style={{width: '82%'}}>
        {list.map((item, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => navigation.navigate('daily')}
            style={[styles.cardSmall, styles.shadowProp, {}]}>
            {/* <Text>{moment(item.created_at).format('LL')}</Text> */}
            <DiseaseChart
              date={item.created_at}
              img={item.total_log}
              disease={item.disease_percentage}
            />
          </TouchableOpacity>
        ))}
      </View>
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
    paddingVertical: 15,
    paddingHorizontal: 25,
    width: '82%',
    height: 150,
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
});
export default Summary;
