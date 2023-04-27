import React, {useEffect, useState, useRef} from 'react';
import {
  Image,
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import {font, buttons} from './styles';
import Modal from 'react-native-modal';
import {Button, ListItem, Divider, Skeleton} from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import ActionSheet from 'react-native-actions-sheet';

import Feather from 'react-native-vector-icons/dist/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import axios from 'axios';
import FarmPasscode from '../components/passcode';

const ManageFarm = ({route}) => {
  const animationRef = useRef();

  const [open, setOpen] = useState(false);
  const [passcodeModal, setPasscodeModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [selectUser, setSelectUser] = useState(null);

  useEffect(() => {
    getUser();
  }, []);

  const handleLoadMore = () => {
    if (!isLoading) {
      getUser();
    }
  };

  const addUser = async e => {
    const value = await AsyncStorage.getItem('user_token');

    const data = new FormData();
    data.append('member_id', e);
    data.append('user_farm_role', 'employee');

    axios
      .post(
        `http://34.110.173.162/v1/farms/${route.params.farm_uuid}/users`,
        data,
        {
          headers: {
            Authorization: `Bearer ${value}`,
          },
        },
      )
      .then(response => {
        // console.log(response.data);
        // setUsers(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const getUser = async () => {
    const value = await AsyncStorage.getItem('user_token');

    axios
      .get(
        `http://34.110.173.162/v1/farms/${route.params.farm_uuid}/users?limit=${count}`,
        {
          headers: {
            Authorization: `Bearer ${value}`,
          },
        },
      )
      .then(response => {
        console.log('user', response.data);
        setUsers(response.data);
        setCount(count + 10);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const deleteUser = async userUUID => {
    const value = await AsyncStorage.getItem('user_token');

    const data = new FormData();
    data.append('status', false);

    axios
      .put(
        `http://34.110.173.162/v1/farms/${route.params.farm_uuid}/users/${userUUID}/status`,
        data,
        {
          headers: {
            Authorization: `Bearer ${value}`,
          },
        },
      )
      .then(response => {
        getUser();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleVerify = e => {
    addUser(e);
    setPasscodeModal(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 15,
          }}>
          {[...Array(8)].map((_, index) => (
            <View key={index}>
              <View
                style={{
                  flexDirection: 'row',

                  justifyContent: 'space-between',

                  marginVertical: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{justifyContent: 'space-evenly', marginLeft: 10}}>
                    <Skeleton
                      LinearGradientComponent={LinearGradient}
                      animation="wave"
                      width={100}
                      height={15}
                      style={{borderRadius: 30}}
                    />
                    <Skeleton
                      LinearGradientComponent={LinearGradient}
                      animation="wave"
                      width={80}
                      height={10}
                      style={{borderRadius: 30, marginVertical: 10}}
                    />
                  </View>
                </View>
                <Skeleton
                  LinearGradientComponent={LinearGradient}
                  animation="wave"
                  circle
                  width={10}
                  height={30}
                  style={{alignSelf: 'center'}}
                />
              </View>
              <Divider />
            </View>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setPasscodeModal(true);
        }}
        style={{
          borderRadius: 50,
          backgroundColor: '#047675',
          padding: 10,
          bottom: 50,
          right: 17,
          zIndex: 1,
          position: 'absolute',
        }}>
        {/* <MaterialCommunityIcons
          name="account-plus-outline"
          size={35}
          color="#fff"
        /> */}
        <Feather name="user-plus" size={25} color="#fff" />
      </TouchableOpacity>
      <FlatList
        data={users}
        renderItem={(item, index) => (
          <ListItem
            key={index}
            bottomDivider
            containerStyle={{backgroundColor: '#00000000'}}>
            {/* <Avatar
            rounded
            size={60}
            // source={item.image_url && {uri: item.image_url}}
            title={<ActivityIndicator />}
          /> */}

            <ListItem.Content>
              <ListItem.Title style={{fontFamily: 'Kanit-Regular'}}>
                {item.item.user.first_name} {item.item.user.last_name} (
                {item.item.user.member_id})
              </ListItem.Title>
              <ListItem.Subtitle style={{fontFamily: 'Kanit-Regular'}}>
                {item.item.user_farm_role}
              </ListItem.Subtitle>
            </ListItem.Content>
            <TouchableOpacity
              onPress={() => {
                setSelectUser(item.item);
                animationRef.current.show();
              }}>
              <MaterialCommunityIcons size={20} name="dots-vertical" />
            </TouchableOpacity>
          </ListItem>
        )}
        keyExtractor={(item, index) => index}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
      {/* {users.map((item, index) => (
        
      ))} */}
      <ActionSheet
        ref={animationRef}
        containerStyle={{
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}
        gestureEnabled={true}
        indicatorStyle={{
          width: 100,
        }}>
        <View style={{padding: 40, justifyContent: 'flex-end'}}>
          <Button
            disabled={selectUser ? selectUser.user_farm_role == 'owner' : true}
            onPress={() => deleteUser(selectUser.user_uuid)}
            title="ลบผู้ใช้ออกจากไร่"
            titleStyle={font.kanit}
            buttonStyle={{borderRadius: 30, backgroundColor: '#E72970'}}
          />
        </View>
      </ActionSheet>
      <Modal
        isVisible={passcodeModal}
        style={{justifyContent: 'flex-end'}}
        onBackdropPress={() => setPasscodeModal(false)}>
        <View
          style={{
            margin: -20,
            borderRadius: 30,
            padding: 20,
            height: '80%',
            backgroundColor: '#fff',
          }}>
          <FarmPasscode onVerify={handleVerify} />
          <View></View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 100,
    backgroundColor: '#F0F9F8',
  },
});
export default ManageFarm;
