import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from '../../screens/home';
import {CameraScreen} from '../../screens/camera';
import {ValidatePhoto} from '../../screens/validatePhoto';
import {ResultPage} from '../../screens/result';

const Stack = createNativeStackNavigator();

const HomeNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerTransparent: true,
      headerBackTitleVisible: false,
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
      options={{
        title: 'แสกน',
        headerTintColor: '#fff',
      }}
    />
    <Stack.Screen
      name="ValidatePhoto"
      component={ValidatePhoto}
      options={{
        title: 'ตรวจสอบ',

        headerTintColor: '#fff',
        headerBackVisible: false,
      }}
    />
    <Stack.Screen
      name="Result"
      component={ResultPage}
      options={{
        title: 'ผลลัพธ์',
        headerTintColor: '#000',
        headerBackVisible: false,
      }}
    />
  </Stack.Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <HomeNavigator />
  </NavigationContainer>
);
