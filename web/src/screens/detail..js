import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import {Button, Avatar, ListItem} from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import {font, buttons} from './styles';
import DiseaseDetail from '../components/list/disease-detail';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Detail = props => {
  const {name, name_th, image_url, uuid, inform} = props.route.params.item;
  const [info, setInfo] = useState();
  const [refreshing, setRefreshing] = useState(true);

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = async () => {
    const value = await AsyncStorage.getItem('user_token');

    axios
      .get(`http://34.110.173.162/v1/diseases/name/${name}`, {
        headers: {
          Authorization: `Bearer ${value}`,
        },
      })
      .then(response => {
        setInfo(response.data);
        setRefreshing(false);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Put your refresh logic here
    getInfo();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // Simulate a delay before refreshing completes
  };
  if (!info) {
    return <Text>loading</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{alignItems: 'center'}}>
          <Avatar
            rounded
            size={150}
            source={image_url && {uri: image_url}}
            title={<ActivityIndicator />}
          />
          {/* <Button size="md" onPress={logData}>
          Medium
        </Button> */}
          <Text style={[font.kanit, {marginVertical: 15, fontSize: 18}]}>
            {name_th}
          </Text>
        </View>
        {/* <Button>asd</Button> */}
        {info.inform.inform_data.map((item, index) => (
          <DiseaseDetail
            key={index}
            item={item}
            id={uuid}
            canEdit={props.route.params.canEdit}
            onAdd={onRefresh}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'center',
    paddingTop: 100,
    backgroundColor: '#F0F9F8',
  },
});
export default Detail;
