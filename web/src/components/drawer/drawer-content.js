import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  ActivityIndicator,
} from 'react-native';
import {Button} from '@rneui/themed';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DrawerContent = props => {
  const {navigation} = props;
  const [user, setUser] = useState(null);

  const handleLogout = async () => {
    // Handle logout logic here
    await AsyncStorage.removeItem('user_data');
    await AsyncStorage.removeItem('user_token');
    await AsyncStorage.removeItem('user_farm');

    navigation.navigate('Login');
  };

  const getUserInfomation = async () => {
    const value = await AsyncStorage.getItem('user_data');
    setUser(JSON.parse(value));
  };
  useEffect(() => {
    getUserInfomation();
    // navigation.setParams({handleTitlePress});
  }, []);
  if (user == null) return <Text>Loading</Text>;

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: '#3ED48D'}}>
        <ImageBackground
          // source={require('../assets/images/menu-bg.jpeg')}
          style={{padding: 20}}>
          <Image
            source={{uri: user.photo}}
            style={{height: 80, width: 80, borderRadius: 40, marginBottom: 10}}
            PlaceholderContent={<ActivityIndicator />}
          />
          <Text
            style={{
              color: '#fff',
              fontSize: 22,
              fontFamily: 'Kanit',
            }}>
            {user.name} (
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)})
          </Text>
          {user.email ? (
            <Text
              style={{
                color: '#fff',
                fontFamily: 'Kanit',
                marginRight: 5,
              }}>
              {user.email}
            </Text>
          ) : null}
          <Text
            style={{
              color: '#fff',
              fontFamily: 'Kanit',
              marginRight: 5,
            }}>
            ID: {user.member_id}
          </Text>
        </ImageBackground>
        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 10}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View
        style={{
          padding: 20,
          paddingBottom: 60,
          borderTopWidth: 1,
          borderTopColor: '#ccc',
        }}>
        <TouchableOpacity onPress={handleLogout}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Ionicons name="exit-outline" size={22} />
            <Text
              style={{
                fontSize: 15,
                fontFamily: 'Kanit',
                marginLeft: 5,
              }}>
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DrawerContent;
