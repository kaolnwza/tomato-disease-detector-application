import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import {Button, Avatar, ListItem} from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import {font, buttons} from './styles';
import DiseaseDetail from '../components/list/disease-detail';
const Detail = props => {
  const {name_th, image_url, uuid, inform} = props.route.params.item;

  return (
    <View style={styles.container}>
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

      <FlatList
        data={inform.inform_data}
        renderItem={({item, index}) => <DiseaseDetail item={item} id={uuid} />}
        keyExtractor={item => item.title.toString()}
      />
    </View>
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
