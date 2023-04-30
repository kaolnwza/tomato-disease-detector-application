import React, {useEffect, useState} from 'react';

import {
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {Button, Divider, Skeleton} from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Feather from 'react-native-vector-icons/dist/Feather';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import {font} from './styles';

const UserManual = () => {
  const width = Dimensions.get('window').width;

  const module = [
    {
      image: require('../../assets/images/result.png'),
      title: 'ตรวจสอบและทำนายโรค',
      description:
        'เริ่มการถ่ายรูปหรือเลือกรูปภาพในเครื่องของคุณเพื่อนำไปทำนายโรคโดยการกดที่ปุ่ม "ตรวจสอบโรค"',

      step: [
        {
          item: (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="images-outline" size={25} />
              <Text
                style={[font.kanit, {marginHorizontal: 5, fontWeight: '100'}]}>
                หรือ
              </Text>
              <View
                style={{
                  backgroundColor: '#d1d1d1d1',
                  borderRadius: 50,
                  width: 34,
                  height: 34,
                }}>
                <Button
                  title="Solid"
                  // eslint-disable-next-line react-native/no-inline-styles
                  buttonStyle={{
                    borderRadius: 50,
                    width: 30,
                    height: 30,
                    backgroundColor: '#fff',
                    margin: 2,
                  }}
                />
              </View>
            </View>
          ),
          description: 'เลือกรูปภาพหรือถ่ายรูปใบมะเขือเทศ',
        },
        {
          item: (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Button
                buttonStyle={{
                  width: 32,
                  height: 32,
                  borderRadius: 100,
                  backgroundColor: '#E72970',
                }}
                type="clear"
                icon={<AntDesign name="reload1" size={13} color="#fFF" />}
                onPress={() => {}}
              />
              <Text
                style={[font.kanit, {marginHorizontal: 5, fontWeight: '100'}]}>
                หรือ
              </Text>
              <Button
                icon={<AntDesign name="arrowright" size={13} color="#fFF" />}
                buttonStyle={{
                  width: 32,
                  height: 32,
                  borderRadius: 100,
                  backgroundColor: '#047675',
                }}
                type="clear"
              />
            </View>
          ),
          description: 'ตรวจสอบรูปถ่ายใหม่หรือดำเนินการต่อ',
        },
        {
          header: 'เพิ่มข้อมูล',
          item: <Feather name="edit-3" size={30} color="#000" />,
          description:
            'สามารถเปลี่ยนผลลัพท์ของการทำนายได้ และความแม่นยำจะขึ้นเป็น 100%',
        },
        {
          item: (
            <Button
              size="sm"
              buttonStyle={{
                paddingHorizontal: 30,
                borderRadius: 5,
                backgroundColor: '#047675',
              }}>
              <Text style={[font.kanit, {fontSize: 10, color: '#fff'}]}>
                บันทึก
              </Text>
            </Button>
          ),
          description:
            'บันทึกผลลัพท์ และผลลัพท์จะไปแสดงยังหน้าประวัติการบันทึก',
        },
        {
          header: 'ตำแหน่ง',
          item: (
            <Text style={[font.kanit, {fontWeight: '100'}]}>
              แก้หมุด
              <Feather name="edit-3" size={30} color="#000" />
            </Text>
          ),
          description: 'สามารถเปลี่ยนตำแหน่งของผลลัพท์',
        },
        {
          item: (
            <Button
              size="sm"
              buttonStyle={{
                paddingHorizontal: 10,

                borderRadius: 5,
                backgroundColor: '#047675',
              }}>
              <Text style={[font.kanit, {fontSize: 10, color: '#fff'}]}>
                <MaterialIcons name="location-pin" size={10} color="#fff" />
                เลือกตำแหน่ง
              </Text>
            </Button>
          ),
          description: 'กดเพื่อเปลี่ยนตำแหน่งไปยังบริเวณที่เลือก',
        },
      ],
    },
    {
      image: require('../../assets/images/history.png'),
      title: 'ประวัติการบันทึก',
      description:
        'หลังจากการบันทึกการทำนายโรค รูปภาพและข้อมูลต่างๆ โดยกดปุ่ม "ประวัติกาารบันทึก"',
      step: [
        {
          item: (
            <Button
              title="ตำแหน่ง"
              buttonStyle={[{borderRadius: 30, paddingHorizontal: 15}]}
              titleStyle={font.kanit}
              size="sm"
              color="#047675"
            />
          ),
          description: 'แท็บนี้จะแสดงถึงตำแหน่งของรูปที่ถ่าย',
        },
        {
          item: (
            <Button
              title="ข้อมูลโรค"
              buttonStyle={[{borderRadius: 30, paddingHorizontal: 15}]}
              titleStyle={font.kanit}
              size="sm"
              color="#047675"
            />
          ),
          description: 'แท็บนี้จะแสดงข้อมูลโรคที่รูปนั้นเป็น',
        },
        {
          item: (
            <Button
              title="การจัดการ"
              buttonStyle={[{borderRadius: 30, paddingHorizontal: 15}]}
              titleStyle={font.kanit}
              size="sm"
              color="#047675"
            />
          ),
          description:
            'แท็บนี้จะแสดงสถานนะของรูปๆนั้น โดยสามารถเปลี่ยนสถานะได้เป็น กำลังรักษา และ รักษาแล้ว',
        },
        {
          item: (
            <TouchableOpacity
              style={{
                borderRadius: 50,
                backgroundColor: '#047675',
                padding: 10,

                zIndex: 1,
              }}>
              <MaterialCommunityIcons
                name="filter-variant"
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
          ),
          description: 'สามารถกรองข้อมูลจากโรค และวันที่',
        },
      ],
    },
    {
      image: require('../../assets/images/Summary-Detail.png'),
      title: 'สรุปข้อมูล',
      description:
        'ข้อมูลทั้งหมดจะถูกมารวม และนำมาสรุปข้อมูลว่ามีทั้งหมดกี่รูป รักษาไปแล้วกี่รูป โดยการกดไปที่มุมบนซ้ายของ "สรุปข้อมูลภาพรวมวันนี้"',
      step: [
        {
          item: (
            <TouchableOpacity
              style={{
                borderRadius: 50,
                backgroundColor: '#AD1357',
                padding: 10,

                zIndex: 1,
              }}>
              <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
            </TouchableOpacity>
          ),
          description: 'สามารถกรองข้อมูล และส่งออกข้มูล',
        },
      ],
    },
    {
      image: require('../../assets/images/map-select.png'),
      title: 'การสร้างพื้นที่ไร่',
      description: 'ผู้ใช้จะสามารถสร้างพื้นที่ได้จากเมนู "จัดการไร่" จากนั้น',
      step: [
        {
          item: (
            <TouchableOpacity
              style={{
                borderRadius: 50,
                backgroundColor: '#047675',
                padding: 10,
              }}>
              <MaterialCommunityIcons name="plus" size={20} color="#fff" />
            </TouchableOpacity>
          ),
          description: 'เลือกปุ่มบวกทางด้านล่างขวา',
        },
        {
          item: <Ionicons name="ios-pin-sharp" size={30} color="#f13" />,
          description:
            'จากนั้นทำการเลือกพื้นที่ โดยจำเป็นต้องมากกว่า 3 จุดขึ้นไปเพื่อสร้างไร่',
        },
        {
          item: (
            <TouchableOpacity
              style={{
                borderRadius: 50,
                backgroundColor: '#047675',
                padding: 10,
              }}>
              <MaterialCommunityIcons name="check" size={20} color="#fff" />
            </TouchableOpacity>
          ),
          description: 'จากนั้นกดปุ่มเลือก เพื่อตั้งชื่อ',
        },
      ],
    },
    {
      image: require('../../assets/images/information.png'),
      title: 'การดูข้อมูลโรค',
      description: 'ผู้ใช้จะสามารถดูโรคของมะเขือแต่ละโรคได้จากปุ่ม "โรคพืช"',
      step: [],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {module.map((data, i) => (
        <View style={{marginBottom: 50}} key={i}>
          <Image
            source={data.image}
            style={{
              width: width,
              height: 400,
              aspectRatio: 0.8,
              alignSelf: 'center',
            }}
          />
          <View style={styles.content}>
            <Text style={[font.kanit, {fontSize: 24}]}>{data.title}</Text>
            <Text style={[font.kanit, {fontSize: 16, fontWeight: '100'}]}>
              {data.description}
            </Text>
            {data.step.map((step, y) => (
              <View key={y}>
                {step.header ? (
                  <Text style={[font.kanit, {fontSize: 16}]}>
                    {step.header}
                  </Text>
                ) : null}

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginVertical: 5,
                  }}>
                  {step.item}
                  <Text
                    style={[
                      font.kanit,
                      {marginLeft: 10, width: 225, textAlign: 'right'},
                    ]}>
                    {step.description}
                  </Text>
                </View>
                <Divider style={styles.divider} />
              </View>
            ))}
          </View>
          <Divider
            width={1}
            style={[
              styles.divider,
              {
                width: '90%',
              },
            ]}
          />
        </View>
      ))}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    marginTop: 100,
  },

  content: {
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  divider: {
    width: '100%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  btn: {
    flexDirection: 'column',
    borderColor: 0,
    borderRadius: 10,
    height: 50,
    width: 50,
  },
  shadowProp: {
    shadowOffset: {width: 0, height: 4},
    shadowColor: '#171717',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 14,
  },
});

export default UserManual;
