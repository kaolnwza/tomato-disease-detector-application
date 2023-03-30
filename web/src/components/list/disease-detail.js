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
import {Button, Avatar, ListItem, Input} from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Carousel from 'react-native-reanimated-carousel';

import {font} from '../../screens/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';

const DiseaseDetail = ({item, id}) => {
  const width = Dimensions.get('window').width;
  const carousel = [1];
  carousel.push('');
  const [expandedItems, setExpandedItems] = useState([]);
  const [text, setText] = useState(item.data);
  const [edit, setEdit] = useState(false);
  const [isOwner, setOwner] = useState(false);

  useEffect(() => {
    checkRole();
  }, []);

  const checkRole = async () => {
    if (
      JSON.parse(await AsyncStorage.getItem('user_data')).role === 'employee'
    ) {
      setOwner(false);
    } else {
      setOwner(true);
    }
  };

  const handlePress = id => {
    if (expandedItems.includes(id)) {
      setExpandedItems(expandedItems.filter(item => item !== id));
    } else {
      setExpandedItems([...expandedItems, id]);
    }
  };

  const OpenPhoto = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
    });
  };

  const saveText = async module => {
    const value = await AsyncStorage.getItem('user_token');

    let column;
    switch (module) {
      case 'อาการ':
        column = 'disease_symptom';
        break;
      case 'สาเหตุ':
        column = 'disease_cause';
        break;
      case 'การแพร่ระบาด':
        column = 'disease_epidemic';
        break;
      case 'การป้องกัน':
        column = 'disease_resolve';
        break;
      default:
        break;
    }
    const data = new FormData();
    data.append('column', column);
    data.append('text', text);
    axios
      .patch(`http://35.244.169.189.nip.io/v1/disease/${id}`, data, {
        headers: {
          Authorization: `Bearer ${value}`,
        },
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });

    setEdit(false);
  };

  const cancel = () => {
    setEdit(false);
    setText(item.data);
  };

  return (
    <ListItem.Accordion
      topDivider
      content={
        <>
          <MaterialCommunityIcons
            name={item.icon}
            size={20}
            style={{margin: 0}}
          />

          <ListItem.Content style={{marginHorizontal: 20}}>
            <ListItem.Title style={font.kanit}>{item.title}</ListItem.Title>
          </ListItem.Content>
        </>
      }
      onPress={() => handlePress(item.title)}
      isExpanded={expandedItems.includes(item.title)}>
      <ListItem>
        <ListItem.Content>
          {!edit && isOwner ? (
            <Button
              onPress={() => setEdit(!edit)}
              radius={'xl'}
              type="solid"
              size="sm"
              titleStyle={font.kanit}
              containerStyle={{width: '100%', marginBottom: 10}}>
              แก้ไข
              <MaterialCommunityIcons
                name="pencil-outline"
                size={20}
                style={{marginHorizontal: 2}}
                color="white"
              />
            </Button>
          ) : null}
          {edit ? (
            <Input
              defaultValue={text}
              placeholder="ข้อมูล"
              onChangeText={setText}
              style={{
                alignSelf: 'center',
                textAlign: 'center',
              }}
              inputStyle={[font.kanit, {fontSize: 15}]}
              multiline={true}
              numberOfLines={5}
            />
          ) : (
            <ListItem.Subtitle
              style={[
                font.kanit,
                {
                  marginBottom: 20,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  alignSelf: 'center',
                  textAlign: 'center',
                },
              ]}>
              {text}
            </ListItem.Subtitle>
          )}
          {edit ? (
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <Button
                onPress={() => cancel()}
                radius={'xl'}
                type="solid"
                size="sm"
                titleStyle={[font.kanit]}
                buttonStyle={{backgroundColor: '#E72970'}}
                containerStyle={{width: '45%', marginBottom: 10}}>
                ยกเลิก
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  style={{marginHorizontal: 2}}
                  color="white"
                />
              </Button>
              <Button
                onPress={() => saveText(item.title)}
                radius={'xl'}
                type="solid"
                size="sm"
                buttonStyle={{backgroundColor: '#047675'}}
                titleStyle={font.kanit}
                containerStyle={{width: '45%', marginBottom: 10}}>
                บันทึก
                <MaterialCommunityIcons
                  name="content-save-outline"
                  size={20}
                  style={{marginHorizontal: 2}}
                  color="white"
                />
              </Button>
            </View>
          ) : null}
          <View style={{marginVertical: 20}}>
            <Carousel
              width={width}
              height={width / 2}
              data={carousel}
              scrollAnimationDuration={500}
              // onSnapToItem={index => console.log('current index:', index)}
              renderItem={({index}) =>
                index == carousel.length - 1 ? (
                  isOwner ? (
                    <TouchableOpacity
                      style={{height: '100%'}}
                      onPress={OpenPhoto}>
                      <View
                        style={{
                          flex: 1,
                          borderWidth: 1,
                          borderRadius: 30,
                          marginRight: 30,
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'column',
                        }}>
                        <MaterialCommunityIcons
                          name="file-image-plus-outline"
                          color="gray"
                          size={40}
                          style={{margin: 5}}
                        />
                        <Text style={[font.kanit, {color: 'gray'}]}>
                          เพิ่มรูปภาพ
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : null
                ) : (
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
                )
              }
            />
          </View>
        </ListItem.Content>
      </ListItem>
    </ListItem.Accordion>
  );
};

export default DiseaseDetail;
