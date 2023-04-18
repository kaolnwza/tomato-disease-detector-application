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

import {font} from './styles';

const UserManual = () => {
  const width = Dimensions.get('window').width;

  return (
    <ScrollView style={styles.container}>
      <View style={{marginBottom: 50}}>
        <Image
          source={require('../../assets/images/result.png')}
          style={{
            width: width,
            height: 400,
            aspectRatio: 0.8,
            alignSelf: 'center',
          }}
        />
        <View style={styles.content}>
          <Text style={[font.kanit, {fontSize: 24}]}>ตรวจสอบและทำนายโรค</Text>
          <Text style={[font.kanit, {fontSize: 16, fontWeight: '100'}]}>
            เริ่มการถ่ายรูปหรือเลือกรูปภาพในเครื่องของคุณเพื่อนำไปทำนายโรคโดยการกดที่ปุ่ม
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <Button
              type="clear"
              title="ตรวจสอบโรค"
              titleStyle={[{color: '#fff', fontSize: 5}, font.kanit]}
              style={[
                styles.btn,
                {
                  backgroundColor: '#E72970',
                },
              ]}
              icon={<Ionicons name="camera-outline" size={20} color="#fff" />}
              iconPosition="top"
              onPress={() => {}}
            />
            <Text style={[font.kanit, {marginLeft: 10}]}>
              เลือกเมนูตรวจสอบโรค ที่อยู่บนหน้าหลัก
            </Text>
          </View>
          <Divider style={styles.divider} />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginVertical: 8,
            }}>
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
            <Text style={[font.kanit, {marginLeft: 10}]}>
              เลือกรูปภาพหรือถ่ายรูปใบมะเขือเทศ
            </Text>
          </View>
          <Divider style={styles.divider} />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
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
            <Text style={[font.kanit, {marginLeft: 10}]}>
              ตรวจสอบรูปถ่ายใหม่หรือดำเนินการต่อ
            </Text>
          </View>
        </View>
        <View style={styles.content}>
          <Text style={[font.kanit, {fontSize: 16}]}>เพิ่มข้อมูล</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Feather name="edit-3" size={30} color="#000" />

            <Text
              style={[
                font.kanit,
                {marginLeft: 10, width: 225, textAlign: 'right'},
              ]}>
              สามารถเปลี่ยนผลลัพท์ของการทำนายได้ และความแม่นยำจะขึ้นเป็น 100%
            </Text>
          </View>
          <Divider style={styles.divider} />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
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
            <Text
              style={[
                font.kanit,
                {marginLeft: 10, width: 200, textAlign: 'right'},
              ]}>
              บันทึกผลลัพท์ และผลลัพท์จะไปแสดงยังหน้าประวัติการบันทึก
            </Text>
          </View>
          <Divider style={styles.divider} />
        </View>

        <View style={styles.content}>
          <Text style={[font.kanit, {fontSize: 16}]}>ตำแหน่ง</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={[font.kanit, {fontWeight: '100'}]}>
              แก้หมุด
              <Feather name="edit-3" size={30} color="#000" />
            </Text>
            <Text
              style={[
                font.kanit,
                {marginLeft: 10, width: 225, textAlign: 'right'},
              ]}>
              สามารถเปลี่ยนตำแหน่งของผลลัพท์
            </Text>
          </View>
          <Divider style={styles.divider} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Button
              size="sm"
              buttonStyle={{
                paddingHorizontal: 10,

                borderRadius: 5,
                backgroundColor: '#047675',
              }}>
              {/* <ActivityIndicator /> */}
              <Text style={[font.kanit, {fontSize: 10, color: '#fff'}]}>
                <MaterialIcons name="location-pin" size={10} color="#fff" />
                เลือกตำแหน่ง
              </Text>
            </Button>
            <Text
              style={[
                font.kanit,
                {marginLeft: 10, width: 200, textAlign: 'right'},
              ]}>
              กดเพื่อเปลี่ยนตำแหน่งไปยังบริเวณที่เลือก
            </Text>
          </View>
          <Divider style={styles.divider} />
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
