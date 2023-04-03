import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, FlatList, View, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import moment from 'moment';
import {ProgressChart} from 'react-native-chart-kit';
import {font} from '../../screens/styles';
const DiseaseChart = props => {
  const [time, setTime] = useState();

  useEffect(() => {
    setInterval(() => {
      const date = new Date();
      setTime(date.toLocaleTimeString());
    }, 1000);
  }, []);
  return (
    <View style={{flexDirection: 'row', marginTop: 5}}>
      <View>
        <View
          style={{
            position: 'absolute',
            top: 20,
            zIndex: 1,
            alignSelf: 'center',
          }}>
          <Text style={styles.percentage}>{props.disease}%</Text>
          <View style={{flexDirection: 'row'}}>
            <MaterialCommunityIcons
              name="virus"
              color="#000"
              style={{alignSelf: 'center'}}
            />
            <Ionicons
              name="leaf-outline"
              size={24}
              color="#000"
              style={{alignSelf: 'center', lineHeight: 22}}
            />
          </View>
        </View>
        <ProgressChart
          data={[props.disease / 100]}
          width={75}
          height={75}
          strokeWidth={8}
          chartConfig={{
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: (opacity = 1, index) => {
              return `rgba(231, 41, 112,${
                opacity > 0.2 && opacity < 1 ? 1 : 0.2
              })`;
            },
          }}
          hideLegend={true}
          style={{marginHorizontal: 10}}
        />
      </View>

      <View
        style={{
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'center',
        }}>
        <Text style={[font.kanit]}>
          {props.date == 'current'
            ? moment().format('DD/MM/YYYY')
            : Array.isArray(props.date)
            ? moment(new Date(props.date[0])).format('DD/MM/YYYY') +
              ' - ' +
              moment(new Date(props.date[1])).format('DD/MM/YYYY')
            : moment(new Date(props.date)).format('DD/MM/YYYY')}
        </Text>
        {/* <Text style={[font.kanit]}>คิดเป็น 20% ของพื้นที่</Text> */}
        <Text style={styles.info}>เกิดโรคในไร่ทั้งหมด {props.img} ต้น</Text>

        {/* <Text style={styles.info}>
          00.00 -{' '}
          {props.time == 'currnt'
            ? time
              ? time.substring(0, 5)
              : moment().format(' HH:mm')
            : props.time}{' '}
          น.
        </Text> */}
        <Text style={styles.info}>{props.img} รูป</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  info: {
    fontSize: 12,
    color: '#696969',
    fontFamily: 'Kanit-Regular',
  },
  percentage: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Kanit-Regular',
    lineHeight: 21,
  },
});
export default DiseaseChart;
