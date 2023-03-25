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
import Carousel from 'react-native-reanimated-carousel';

import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import {font} from '../../screens/styles';

const DiseaseDetail = props => {
  const width = Dimensions.get('window').width;

  const [expandedItems, setExpandedItems] = useState([]);
  const handlePress = id => {
    if (expandedItems.includes(id)) {
      setExpandedItems(expandedItems.filter(item => item !== id));
    } else {
      setExpandedItems([...expandedItems, id]);
    }
  };
  return (
    <ListItem.Accordion
      topDivider
      content={
        <>
          <MaterialCommunityIcons
            name={props.item.icon}
            size={20}
            style={{margin: 0}}
          />

          <ListItem.Content style={{marginHorizontal: 20}}>
            <ListItem.Title style={font.kanit}>
              {props.item.title}
            </ListItem.Title>
          </ListItem.Content>
        </>
      }
      onPress={() => handlePress(props.item.title)}
      isExpanded={expandedItems.includes(props.item.title)}>
      <ListItem>
        <ListItem.Content>
          <ListItem.Subtitle style={[font.kanit, {paddingHorizontal: 30}]}>
            {props.item.data}
          </ListItem.Subtitle>
          <View style={{marginVertical: 20}}>
            <Carousel
              loop
              width={width}
              height={width / 2}
              data={[...new Array(6).keys()]}
              scrollAnimationDuration={1000}
              onSnapToItem={index => console.log('current index:', index)}
              renderItem={({index}) => (
                <View
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderRadius: 30,
                    marginRight: 30,
                    justifyContent: 'center',
                  }}>
                  <Text style={{textAlign: 'center', fontSize: 30}}>
                    {index}
                  </Text>
                </View>
              )}
            />
          </View>
        </ListItem.Content>
      </ListItem>
    </ListItem.Accordion>
  );
};

export default DiseaseDetail;
