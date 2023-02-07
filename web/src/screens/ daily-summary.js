import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, FlatList, View, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {font, buttons} from './styles';
import {Tab, TabView, Button} from '@rneui/themed';
import moment from 'moment';
const Daily = () => {
  const [index, setIndex] = React.useState(0);
  const [headers, setHeaders] = useState([
    {
      name: 'โรคทั้งหมด',
    },
    {
      name: 'โรคใบจุด',
    },
    {
      name: 'โรคใบจุดวง',
    },
    {
      name: 'โรคใบไหม้',
    },
    {
      name: 'โรครากำมะหยี่ ',
    },
    {
      name: 'โรคใบจุดวงกลม',
    },
    {
      name: 'โรคไรสองจุด',
    },
    {
      name: 'โรคใบหงิกเหลือง',
    },
    {
      name: 'โรคใบด่าง',
    },
  ]);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 5,
        }}>
        <Text style={[font.kanit, {fontSize: 18}]}>
          วันที่ {moment().format('DD/MM/YYYY')}
        </Text>
        <TouchableOpacity>
          <Ionicons name="filter" size={25} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={[styles.card, styles.shadowProp, {overflow: 'hidden'}]}>
        <View style={{flexDirection: 'row', marginBottom: 20}}>
          <TouchableOpacity
            style={{zIndex: 1, paddingTop: 20}}
            onPress={() => setIndex(index - 1)}
            disabled={index == 0}>
            <Entypo
              name="chevron-left"
              size={30}
              color={index == 0 ? '#8C8C8C' : '#000'}
            />
          </TouchableOpacity>
          <TabView
            value={index}
            onChange={setIndex}
            animationType="spring"
            containerStyle={{}}>
            {headers.map((item, i) => (
              <TabView.Item key={i} style={styles.headerTabs}>
                <Text style={[font.kanit, {fontSize: 18}]} h1>
                  {item.name}
                </Text>
              </TabView.Item>
            ))}
          </TabView>
          <TouchableOpacity
            style={{zIndex: 1, paddingTop: 20}}
            onPress={() => setIndex(index + 1)}
            disabled={index >= headers.length - 1}>
            <Entypo
              name="chevron-right"
              size={30}
              color={index >= headers.length - 1 ? '#8C8C8C' : '#000'}
            />
          </TouchableOpacity>
        </View>
        <MapView
          // region={Pin}
          // provider={PROVIDER_GOOGLE}
          style={{
            height: 500,
            width: '100%',
            borderRadius: 30,
            alignSelf: 'center',
            overflow: 'hidden',
          }}
          initialRegion={{
            latitude: 13.731328,
            longitude: 100.78181,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          }}>
          <Marker
            title="โรคใบจุด"
            description="เทส"
            coordinate={{latitude: 13.731328, longitude: 100.78181}}
          />
          <Marker
            title="โรคใบด่าง"
            description="เทฟ1"
            pinColor="#FF6E00"
            coordinate={{latitude: 13.731329, longitude: 100.781}}
          />
          <Marker
            title="โรคใบไหม้"
            description="เทฟ2"
            pinColor="#FFFF00"
            coordinate={{latitude: 13.731, longitude: 100.7814}}
          />
          <Marker
            title="โรคไรสองจุด"
            description="เทฟ3"
            pinColor="#19B618"
            coordinate={{latitude: 13.731, longitude: 100.7819}}
          />
          <Marker
            title="โรคไรสองจุด"
            description="เทฟ4"
            pinColor="#19B618"
            coordinate={{latitude: 13.7312, longitude: 100.782}}
          />
        </MapView>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 40,
    margin: 5,
    paddingVertical: 15,
    paddingHorizontal: 25,
    width: '98%',
    height: '90%',
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
});

export default Daily;
