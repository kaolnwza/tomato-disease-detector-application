import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  Text,
  ActivityIndicator,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';
import {font, buttons} from '../../screens/styles';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {HomeScreen} from '../../screens/home';

import {CameraScreen} from '../../screens/camera';
import {ValidatePhoto} from '../../screens/validatePhoto';
import {ResultPage} from '../../screens/result';
import History from '../../screens/history';
import Information from '../../screens/information';
import Setting from '../../screens/setting';
import Summary from '../../screens/summary';
import Octicons from 'react-native-vector-icons/dist/Octicons';
import Feather from 'react-native-vector-icons/dist/Feather';

import Login from '../../screens/login';
import Detail from '../../screens/detail.';
import SelectFarm from '../../screens/selectFarm';
import Daily from '../../screens/ daily-summary';
import CreateFarm from '../../screens/create-farm';
import DrawerContent from '../drawer/drawer-content';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DrawerActions} from '@react-navigation/native';
import ManageFarm from '../../screens/manageFarm';
import UserManual from '../../screens/userManual';

const Drawer = createDrawerNavigator();

const Stack = createNativeStackNavigator();

function HomeDrawer(item) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserInfomation();
  }, []);

  const getUserInfomation = async () => {
    const value = await AsyncStorage.getItem('user_data');
    setUser(JSON.parse(value));
  };

  return (
    <Drawer.Navigator
      screenOptions={({route, navigation}) => ({
        headerBackTitleVisible: false,

        headerTransparent: true,
        headerTitleStyle: {
          fontFamily: 'Kanit-Regular',
          fontWeight: '400',
        },
        contentStyle: {
          fontFamily: 'Kanit-Regular',
        },
        drawerLabelStyle: {
          fontFamily: 'Kanit-Regular',
          fontWeight: '400',
        },
        headerStyle: {
          backgroundColor: '#00000000',
        },

        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            style={{
              borderRadius: 40,
              padding: 5,
              marginHorizontal: 20,
            }}>
            {user ? (
              <Image
                source={{uri: user.photo}}
                PlaceholderContent={<ActivityIndicator />}
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 40,
                }}
              />
            ) : (
              <Feather size={30} name="user" />
            )}
          </TouchableOpacity>
        ),
        headerTintColor: '#000',
        gestureEnabled: false,
        headerBackVisible: false,
      })}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="หน้าหลัก"
        component={HomeScreen}
        initialParams={{handleTitlePress: false, name: item.route.params.name}}
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
        })}
      />
      <Drawer.Screen name="จัดการฟาร์ม" component={ManageFarm} />
      <Drawer.Screen name="คู่มือการใช้งาน" component={UserManual} />
    </Drawer.Navigator>
  );
}

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
        gestureEnabled: false,
      }}
    />
    <Stack.Screen
      name="SelectFarm"
      component={SelectFarm}
      options={({navigation}) => ({
        headerLeft: () => (
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={async () => {
              await AsyncStorage.removeItem('user_data');
              await AsyncStorage.removeItem('user_token');
              navigation.navigate('Login');
            }}>
            <Feather size={30} name="chevron-left" />
            <Text style={{fontSize: 18}}>Back</Text>
          </TouchableOpacity>
        ),
        gestureEnabled: false,

        title: 'เลือกไร่',
      })}
    />
    <Stack.Screen
      name="Home"
      component={HomeDrawer}
      initialParams={{handleTitlePress: false}}
      options={({route, navigation}) => ({
        headerShown: false,
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
      name="CreateFarm"
      component={CreateFarm}
      options={({navigation}) => ({
        title: 'กำหนดพื้นที่ไร่',
        headerTintColor: '#fff',
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
