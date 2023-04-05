import React, {useEffect, useState, useRef} from 'react';
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
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {font, buttons} from './styles';
import ActionSheet from 'react-native-actions-sheet';
import DatepickerRange from 'react-native-range-datepicker';
import DiseaseChart from '../components/chart/disease-chart';
import moment from 'moment';

const Summary = ({navigation}) => {
  const [list, setList] = useState([]);
  const actionSheetRef = useRef();
  const [startDate, setStartDate] = useState(
    moment().subtract(7, 'days').format('DD/MM/YYYY'),
  );
  const [endDate, setEndDate] = useState(moment().format('DD/MM/YYYY'));

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
        setList(response.data);
      })
      .catch(error => {
        console.log('error', error);
      });
  };

  const filterSummary = async (start, end) => {
    const token = await AsyncStorage.getItem('user_token');
    const current_farm = JSON.parse(await AsyncStorage.getItem('user_farm'));
    axios
      .get(
        `http://35.244.169.189.nip.io/v1/farms/${current_farm.farm_uuid}/percentage?start_time=${start} 00:00:00&end_time=${end} 23:59:59`,
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

  return (
    <View style={styles.container}>
      <TouchableOpacity
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
      </TouchableOpacity>
      <View style={[styles.card, styles.shadowProp]}>
        <Text style={font.kanit}>
          <Text style={{fontSize: 24}}>ช่วงเวลา</Text>
        </Text>
        <DiseaseChart date={[startDate, endDate]} img={sum} disease={20} />
      </View>

      <View style={{width: '82%'}}>
        {list.reverse().map((item, i) => (
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
      </View>
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
              setStartDate(moment(new Date(start)).format('DD/MM/YYYY'));
              setEndDate(
                until
                  ? moment(new Date(until)).format('DD/MM/YYYY')
                  : moment(new Date(start)).format('DD/MM/YYYY'),
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
