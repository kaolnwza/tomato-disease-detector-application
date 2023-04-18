import React, {useEffect, useState} from 'react';
import {
  Image,
  RefreshControl,
  StyleSheet,
  FlatList,
  View,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {Button, ListItem, Avatar, Chip, Divider, Skeleton} from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Information = ({navigation}) => {
  const [disease, setDisease] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadData, setLoadData] = useState(true);

  useEffect(() => {
    navigation.addListener('focus', getData);
  }, []);
  const onRefresh = React.useCallback(() => {
    getData();

    setRefreshing(true);
    // Put your refresh logic here
  }, []);
  const getData = async () => {
    const value = await AsyncStorage.getItem('user_token');
    axios
      .get('http://35.244.169.189.nip.io/v1/diseases', {
        headers: {
          Authorization: `Bearer ${value}`,
        },
      })
      .then(response => {
        setDisease(response.data);
        setLoadData(false);
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
  if (loadData) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 15,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {[...Array(8)].map((_, index) => (
            <View key={index}>
              <View
                style={{
                  flexDirection: 'row',

                  justifyContent: 'space-between',

                  marginVertical: 14.5,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Skeleton
                    LinearGradientComponent={LinearGradient}
                    animation="wave"
                    circle
                    // skeletonStyle={{}}
                    width={60}
                    height={60}
                  />
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
                      style={{borderRadius: 30}}
                    />
                  </View>
                </View>
              </View>
              <Divider />
            </View>
          ))}
        </View>
      </SafeAreaView>
    );
  }

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
