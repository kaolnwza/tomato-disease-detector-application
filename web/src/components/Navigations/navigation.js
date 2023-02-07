import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Text, StyleSheet, FlatList, View, TouchableOpacity} from 'react-native';
import {font, buttons} from '../../screens/styles';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from '../../screens/home';

import {CameraScreen} from '../../screens/camera';
import {ValidatePhoto} from '../../screens/validatePhoto';
import {ResultPage} from '../../screens/result';
import History from '../../screens/history';
import Information from '../../screens/information';
import Setting from '../../screens/setting';
import Summary from '../../screens/summary';
import Octicons from 'react-native-vector-icons/dist/Octicons';
import Login from '../../screens/login';
import Detail from '../../screens/detail.';
import SelectFarm from '../../screens/selectFarm';
import Daily from '../../screens/ daily-summary';

const Stack = createNativeStackNavigator();
const HomeNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerTransparent: true,
      headerBackTitleVisible: false,
      headerTitleStyle: {
        fontFamily: 'Kanit-Regular',
      },
      contentStyle: {
        fontFamily: 'Kanit-Regular',
      },
    }}>
    <Stack.Screen
      name="Login"
      component={Login}
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="SelectFarm"
      component={SelectFarm}
      options={{
        gestureEnabled: false,
        headerBackVisible: false,
        title: 'เลือกไร่',
      }}
    />
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      initialParams={{handleTitlePress: false}}
      options={({route, navigation}) => ({
        headerTitle: props => (
          <TouchableOpacity
            onPress={() => navigation.setParams({handleTitlePress: true})}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[font.kanit, {marginRight: 5, fontSize: 18}]}>
              {route.params.name}
            </Text>
            <Octicons name="chevron-down" />
          </TouchableOpacity>
        ),
        headerTintColor: '#000',
        gestureEnabled: false,
        headerBackVisible: false,
      })}
    />
    <Stack.Screen
      name="Summary"
      component={Summary}
      options={({navigation}) => ({
        title: 'สรุปข้อมูล',
        headerTintColor: '#000',
        headerRight: () => (
          <Octicons
            onPress={() => navigation.navigate('Home')}
            name="home"
            size={25}
          />
        ),
      })}
    />
    <Stack.Screen
      name="Camera"
      component={CameraScreen}
      options={({navigation}) => ({
        title: 'สแกน',
        headerTintColor: '#fff',
        headerRight: () => (
          <Octicons
            onPress={() => navigation.navigate('Home')}
            name="home"
            size={25}
            color="#fFF"
          />
        ),
      })}
    />
    <Stack.Screen
      name="History"
      component={History}
      options={({navigation}) => ({
        title: 'ประวัติการบันทึก',
        headerTintColor: '#000',
        headerRight: () => (
          <Octicons
            onPress={() => navigation.navigate('Home')}
            name="home"
            size={25}
          />
        ),
      })}
    />
    <Stack.Screen
      name="Information"
      component={Information}
      options={({navigation}) => ({
        title: 'ข้อมูลโรค',
        headerTintColor: '#000',
        headerRight: () => (
          <Octicons
            onPress={() => navigation.navigate('Home')}
            name="home"
            size={25}
          />
        ),
      })}
    />
    <Stack.Screen
      name="Detail"
      component={Detail}
      options={({navigation, route}) => ({
        title: route.params.item.name,
        headerTintColor: '#000',
        headerRight: () => (
          <Octicons
            onPress={() => navigation.navigate('Home')}
            name="home"
            size={25}
          />
        ),
      })}
    />
    <Stack.Screen
      name="Setting"
      component={Setting}
      options={({navigation}) => ({
        title: 'ตั้งค่า',
        headerTintColor: '#000',
        headerRight: () => (
          <Octicons
            onPress={() => navigation.navigate('Home')}
            name="home"
            size={25}
          />
        ),
      })}
    />
    <Stack.Screen
      name="ValidatePhoto"
      component={ValidatePhoto}
      options={({navigation}) => ({
        title: 'ตรวจสอบ',
        gestureEnabled: false,
        headerTintColor: '#fff',
        headerBackVisible: false,
        headerRight: () => (
          <Octicons
            onPress={() => navigation.navigate('Home')}
            name="home"
            size={25}
            color="#fFF"
          />
        ),
      })}
    />
    <Stack.Screen
      name="Result"
      component={ResultPage}
      options={({navigation}) => ({
        title: 'ผลลัพธ์',
        headerTintColor: '#000',
        headerRight: () => (
          <Octicons
            onPress={() => navigation.navigate('Home')}
            name="home"
            size={25}
            color="#000"
          />
        ),
      })}
    />
    <Stack.Screen
      name="daily"
      component={Daily}
      options={({navigation}) => ({
        title: 'สรุปข้อมูล',
        headerTintColor: '#000',
        headerRight: () => (
          <Octicons
            onPress={() => navigation.navigate('Home')}
            name="home"
            size={25}
            color="#000"
          />
        ),
      })}
    />
  </Stack.Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <HomeNavigator />
  </NavigationContainer>
);
