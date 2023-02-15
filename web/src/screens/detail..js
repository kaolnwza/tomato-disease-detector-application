import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {Button, Avatar, ListItem} from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import {font, buttons} from './styles';
import DiseaseDetail from '../components/list/disease-detail';
const Detail = props => {
  const {name_th, image_url, name, inform} = props.route.params.item;

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
      {/* <Button onPress={logDetail}>asd</Button> */}

      <FlatList
        data={inform.inform_data}
        renderItem={({item, index}) => <DiseaseDetail item={item} />}
        keyExtractor={item => item.title.toString()}
      />

      {/* <ListItem.Accordion
          bottomDivider
          content={
            <>
              <MaterialCommunityIcons
                name={inform[0].icon}
                size={20}
                style={{margin: 0}}
              />

              <ListItem.Content style={{marginHorizontal: 20}}>
                <ListItem.Title style={font.kanit}>
                  {inform[0].title}
                </ListItem.Title>
              </ListItem.Content>
            </>
          }
          isExpanded={disease}
          onPress={() => {
            setDisease(!disease);
          }}>
          <ListItem.Accordion
            containerStyle={{paddingHorizontal: 30}}
            content={
              <>
                <MaterialCommunityIcons
                  name={inform[0].data[0].icon}
                  size={20}
                  style={{margin: 0}}
                />

                <ListItem.Content style={{marginHorizontal: 20}}>
                  <ListItem.Title style={font.kanit}>
                    {inform[0].data[0].title}
                  </ListItem.Title>
                </ListItem.Content>
              </>
            }
            isExpanded={cause}
            onPress={() => {
              setCause(!cause);
            }}>
            <ListItem bottomDivider>

              <ListItem.Content>
                <ListItem.Subtitle
                  style={[font.kanit, {paddingHorizontal: 30}]}>
                  {inform[0].data[0].data}
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          </ListItem.Accordion>
          <ListItem.Accordion
            containerStyle={{paddingHorizontal: 30}}
            content={
              <>
                <MaterialCommunityIcons
                  name={inform[0].data[1].icon}
                  size={20}
                  style={{margin: 0}}
                />

                <ListItem.Content style={{marginHorizontal: 20}}>
                  <ListItem.Title style={font.kanit}>
                    {inform[0].data[1].title}
                  </ListItem.Title>
                </ListItem.Content>
              </>
            }
            isExpanded={symptom}
            onPress={() => {
              setSymptom(!symptom);
            }}>
            <ListItem bottomDivider>

              <ListItem.Content>
                <ListItem.Subtitle
                  style={[font.kanit, {paddingHorizontal: 30}]}>
                  {inform[0].data[1].data}
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          </ListItem.Accordion>
          <ListItem.Accordion
            containerStyle={{paddingHorizontal: 30}}
            content={
              <>
                <MaterialCommunityIcons
                  name={inform[0].data[2].icon}
                  size={20}
                  style={{margin: 0}}
                />

                <ListItem.Content style={{marginHorizontal: 20}}>
                  <ListItem.Title style={font.kanit}>
                    {inform[0].data[2].title}
                  </ListItem.Title>
                </ListItem.Content>
              </>
            }
            isExpanded={virus}
            onPress={() => {
              setVirus(!virus);
            }}>
            <ListItem bottomDivider>

              <ListItem.Content>
                <ListItem.Subtitle
                  style={[font.kanit, {paddingHorizontal: 30}]}>
                  {inform[0].data[2].data}
                </ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          </ListItem.Accordion>
        </ListItem.Accordion> */}
      {/* <ListItem.Accordion
          topDivider
          bottomDivider
          content={
            <>
              <MaterialCommunityIcons
                name={inform[1].icon}
                size={20}
                style={{margin: 0}}
              />

              <ListItem.Content style={{marginHorizontal: 20}}>
                <ListItem.Title style={font.kanit}>
                  {inform[1].title}
                </ListItem.Title>
              </ListItem.Content>
            </>
          }
          isExpanded={protect}
          onPress={() => {
            setProtect(!protect);
          }}>
          {inform[1].data.map((l, i) => (
            <ListItem key={i}>
              <ListItem.Content>
                <ListItem.Subtitle style={font.kanit}>{l}</ListItem.Subtitle>
              </ListItem.Content>

            </ListItem>
          ))}
        </ListItem.Accordion> */}
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
