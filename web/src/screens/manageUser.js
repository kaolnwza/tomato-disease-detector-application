import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import {font, buttons} from './styles';
import Modal from 'react-native-modal';
import {Button, ListItem, SpeedDial, Avatar} from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Feather from 'react-native-vector-icons/dist/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import axios from 'axios';
import FarmPasscode from '../components/passcode';

const ManageFarm = ({route}) => {
  const [open, setOpen] = useState(false);
  const [passcodeModal, setPasscodeModal] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUser();
  }, []);

  const addUser = async e => {
    const value = await AsyncStorage.getItem('user_token');

    const data = new FormData();
    data.append('member_id', e);
    data.append('user_farm_role', 'employee');

    axios
      .post(
        `http://35.244.169.189.nip.io/v1/farms/${route.params.farm_uuid}/users`,
        data,
        {
          headers: {
            Authorization: `Bearer ${value}`,
          },
        },
      )
      .then(response => {
        console.log(response.data);
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
        `http://35.244.169.189.nip.io/v1/farms/${route.params.farm_uuid}/users`,
        {
          headers: {
            Authorization: `Bearer ${value}`,
          },
        },
      )
      .then(response => {
        console.log('user', response.data);
        setUsers(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleVerify = e => {
    addUser(e);
    setPasscodeModal(false);
  };

  return (
    <View style={styles.container}>
      <SpeedDial
        isOpen={open}
        icon={{name: 'edit', color: '#fff'}}
        openIcon={{name: 'close', color: '#fff'}}
        style={{zIndex: 99}}
        onOpen={() => setOpen(!open)}
        onClose={() => setOpen(!open)}>
        <SpeedDial.Action
          icon={<Feather size={20} color="#fff" name="user-plus" />}
          color="#047675"
          title="เพิ่มผู้ใช้"
          titleStyle={[font.kanit, {backgroundColor: '#fff'}]}
          onPress={() => {
            setOpen(!open);
            setPasscodeModal(true);
          }}
        />
      </SpeedDial>
      {users.map((item, index) => (
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
              {item.user_uuid}
            </ListItem.Title>
            <ListItem.Subtitle style={{fontFamily: 'Kanit-Regular'}}>
              {item.user_farm_role}
            </ListItem.Subtitle>
          </ListItem.Content>
          <TouchableOpacity>
            <MaterialCommunityIcons size={20} name="dots-vertical" />
          </TouchableOpacity>
        </ListItem>
      ))}
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
    </View>
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
