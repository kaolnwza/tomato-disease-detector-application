import React, {useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Button, ListItem, Avatar} from '@rneui/themed';
import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios';

const Information = ({navigation}) => {
  const [disease, setDisease] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    axios
      .get('http://139.59.120.159:8080/v1/disease', {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NfdXVpZCI6IjUzYmRhZThlLWMxZTMtNDAzMC1hODVkLWNkMWZhOTNhOWJlNSIsImV4cCI6MTg1MzkyNTA4OCwidXNlcl91dWlkIjoiOGU0ZDgzMjAtOGExOS00NmZjLTgxNTEtN2E2MjI2ZDc2ZjZiIn0.YKjeADsaC5oKaD4bBEkWxTDVbZMH_34j4Vx3bKgeZhc',
        },
      })
      .then(response => {
        setDisease(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };
  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Detail', {item});
      }}>
      <ListItem bottomDivider containerStyle={{backgroundColor: '#00000000'}}>
        <Avatar
          rounded
          size={60}
          source={item.image_url && {uri: item.image_url}}
          title={<ActivityIndicator />}
        />

        <ListItem.Content>
          <ListItem.Title style={{fontFamily: 'Kanit-Regular'}}>
            {item.name_th}
          </ListItem.Title>
          <ListItem.Subtitle style={{fontFamily: 'Kanit-Regular'}}>
            {item.name}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={keyExtractor}
        data={disease}
        renderItem={renderItem}
      />
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
export default Information;
