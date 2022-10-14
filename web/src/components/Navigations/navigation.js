import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from '../../screens/home';
import {CameraScreen} from '../../screens/camera';

import {ValidatePhoto} from '../../screens/validatePhoto';

const Stack = createNativeStackNavigator();

const HomeNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Camera" component={CameraScreen} />
    <Stack.Screen name="ValidatePhoto" component={ValidatePhoto} />
  </Stack.Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
    <HomeNavigator />
  </NavigationContainer>
);
