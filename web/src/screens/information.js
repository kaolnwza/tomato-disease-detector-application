import React, {useEffect, useState} from 'react';
import {
  Image,
  RefreshControl,
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {Button, ListItem, Avatar} from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Information = ({navigation}) => {
  const [disease, setDisease] = useState([]);
  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => {
    navigation.addListener('focus', getData);
  }, []);
  const onRefresh = React.useCallback(() => {
    getData();

    setRefreshing(true);
    // Put your refresh logic here
  }, []);
  const getData = async () => {
    console.log('data');
    const value = await AsyncStorage.getItem('user_token');
    axios
      .get('http://35.244.169.189.nip.io/v1/diseases', {
        headers: {
          Authorization: `Bearer ${value}`,
        },
      })
      .then(response => {
        setDisease(response.data);
      })
      .catch(error => {
        console.log(error);
      });
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  };
  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Detail', {item, canEdit: true});
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
