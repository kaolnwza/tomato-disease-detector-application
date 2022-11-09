import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from '../../screens/home';

import {CameraScreen} from '../../screens/camera';
import {ValidatePhoto} from '../../screens/validatePhoto';
import {ResultPage} from '../../screens/result';
import Octicons from 'react-native-vector-icons/dist/Octicons';

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
      name="Home"
      component={HomeScreen}
      options={{
        title: 'หน้าหลัก',
      }}
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
  </Stack.Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <HomeNavigator />
  </NavigationContainer>
);
