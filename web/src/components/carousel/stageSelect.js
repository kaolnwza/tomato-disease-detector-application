import React, {useState} from 'react';
import {View, Dimensions, TouchableOpacity, Text} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {Button, Avatar, ListItem, Input} from '@rneui/themed';
import SwitchSelector from 'react-native-switch-selector';
import {font} from '../../screens/styles';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StageSelect = ({detail, onChangeState}) => {
  const [select, setSelect] = useState(
    detail
      ? detail.status == 'disease'
        ? 0
        : detail.status == 'monitoring'
        ? 1
        : 2
      : 0,
  );
  const options = [
    {
      label: 'ยังไม่รักษา',
      value: 0,
      activeColor: '#E72970',
    },
    {
      label: 'กำลังรักษา',
      value: 1,
      activeColor: '#2089DC',
    },
    {
      label: 'รักษาแล้ว',
      value: 2,
      activeColor: '#3ED48D',
    },
  ];

  const updateStatus = async status => {
    const token = await AsyncStorage.getItem('user_token');
    const data = new FormData();
    data.append('status', status);
    axios
      .patch(
        `http://34.110.173.162/v1/logs/${detail.tomato_log_uuid}/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(response => {
        setSelect(select + 1);
        onChangeState();
      })
      .catch(error => {
        console.log(error);
      });
  };

  if (!detail) {
    return <></>;
  }
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        alignItems: 'center',
      }}>
      <SwitchSelector
        options={options}
        textStyle={font.kanit}
        selectedTextStyle={font.kanit}
        buttonColor="#3ED48D"
        onPress={value => setSelect(value)}
        value={select}
        initial={select}
        disabled
      />
      <View style={{margin: 20}}>
        <View
          style={{
            position: 'absolute',
            zIndex: 1,
            alignSelf: 'flex-end',
            backgroundColor:
              select == 0 ? '#E72970' : select == 1 ? '#2089DC' : '#3ED48D',
            borderRadius: 50,
            padding: 5,
          }}>
          <MaterialCommunityIcons
            size={24}
            color="#fff"
            name={
              select == 0
                ? 'virus-outline'
                : select == 1
                ? 'progress-wrench'
                : 'checkbox-marked-circle-plus-outline'
            }
          />
        </View>

        <Avatar
          size={200}
          source={{
            uri:
              select == 0
                ? 'https://cdn2.iconfinder.com/data/icons/smart-farm-19/3500/20-01-1024.png'
                : select == 1
                ? 'https://cdn2.iconfinder.com/data/icons/smart-farm-19/3500/1-01-1024.png'
                : 'https://cdn4.iconfinder.com/data/icons/basic-ui-117/32/sprout-seedling-plant-agriculture-growth-sapling-cultivate-1024.png',
          }}
        />
      </View>
      {select == 0 ? (
        <Button
          onPress={() => updateStatus('monitoring')}
          buttonStyle={{
            borderRadius: 30,
            backgroundColor: '#E72970',
            width: '100%',
          }}
          titleStyle={font.kanit}>
          เริ่มการรักษา
        </Button>
      ) : select == 1 ? (
        <Button
          onPress={() => {
            updateStatus('cured');
          }}
          buttonStyle={{
            borderRadius: 30,
            backgroundColor: '#2089DC',
            width: '100%',
          }}
          titleStyle={font.kanit}>
          สิ้นสุดการรักษา
        </Button>
      ) : (
        <Button
          onPress={() => {}}
          buttonStyle={{
            borderRadius: 30,
            backgroundColor: '#3ED48D',
            width: '100%',
          }}
          titleStyle={font.kanit}>
          รักษาแล้ว
        </Button>
      )}
    </View>
  );
};

export default StageSelect;
