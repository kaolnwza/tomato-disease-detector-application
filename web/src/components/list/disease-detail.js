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
import {Button, ListItem, Input, Avatar, Image} from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import Carousel from 'react-native-reanimated-carousel';

import {font} from '../../screens/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';

const DiseaseDetail = ({item, id, canEdit, onAdd}) => {
  const width = Dimensions.get('window').width;

  // carousel.push('');
  const [expandedItems, setExpandedItems] = useState([]);
  const [text, setText] = useState(item.data);
  const [edit, setEdit] = useState(false);
  const [isOwner, setOwner] = useState(false);

  useEffect(() => {
    if (item.images) {
      if (isOwner) {
        item.images.push('');
      }
    }

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

  const OpenPhoto = async module => {
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

    ImagePicker.openPicker({
      width: 400,
      height: 300,
      cropping: true,
    })
      .then(image => {
        const imageUri = 'file://' + image.path;
        const fileName = image.path.split('/').pop();
        const data = new FormData();

        data.append('file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: fileName,
        });

        fetch(`http://35.244.169.189.nip.io/v1/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${value}`,
          },
          body: data,
        })
          .then(response => response.json())
          .then(responseData => {
            console.log(responseData);
            const imageData = new FormData();
            imageData.append(
              'images',
              JSON.stringify([{upload_uuid: responseData.uuid}]),
            );
            imageData.append('column', column);
            axios
              .post(
                `http://35.244.169.189.nip.io/v1/diseases/${id}/images/`,
                imageData,
                {
                  headers: {
                    Authorization: `Bearer ${value}`,
                  },
                },
              )
              .then(response => {
                console.log(response.data);
                onAdd();
              })
              .catch(error => {
                console.log(error);
              });
          })
          .catch(error => {
            console.log('error:', error);
          });
      })
      .catch(err => {
        console.log(err);
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
      .patch(`http://35.244.169.189.nip.io/v1/diseases/${id}/`, data, {
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
          {canEdit ? (
            !edit && isOwner ? (
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
            ) : null
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
          <View style={{marginLeft: -13.8}}>
            {item.images ? (
              <Carousel
                mode="parallax"
                width={canEdit ? width : 350}
                height={width / 2}
                data={item.images}
                scrollAnimationDuration={500}
                // onSnapToItem={index => console.log('current index:', index)}
                renderItem={({item: img, index}) =>
                  isOwner ? (
                    index == item.images.length - 1 ? (
                      <TouchableOpacity
                        style={{height: '100%'}}
                        onPress={() => OpenPhoto(item.title)}>
                        <View
                          style={{
                            flex: 1,
                            borderWidth: 1,
                            borderRadius: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column',
                            marginHorizontal: canEdit ? 0 : 10,
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
                    ) : (
                      <Avatar
                        containerStyle={{
                          width: '100%',
                          height: '100%',
                        }}
                        avatarStyle={{
                          borderRadius: 30,
                        }}
                        source={img.image_uri && {uri: img.image_uri}}
                        title={<ActivityIndicator />}
                      />
                    )
                  ) : (
                    <Avatar
                      containerStyle={{
                        width: '100%',
                        height: '100%',
                      }}
                      avatarStyle={{
                        borderRadius: 30,
                      }}
                      source={img.image_uri && {uri: img.image_uri}}
                      title={<ActivityIndicator />}
                    />
                  )
                }
              />
            ) : (
              <Carousel
                mode="parallax"
                width={canEdit ? width : 350}
                height={width / 2}
                data={['']}
                scrollAnimationDuration={500}
                // onSnapToItem={index => console.log('current index:', index)}
                renderItem={({item: img, index}) => (
                  <TouchableOpacity
                    style={{height: '100%'}}
                    onPress={() => OpenPhoto(item.title)}>
                    <View
                      style={{
                        flex: 1,
                        borderWidth: 1,
                        borderRadius: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        marginHorizontal: canEdit ? 0 : 10,
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
                )}
              />
            )}
          </View>
        </ListItem.Content>
      </ListItem>
    </ListItem.Accordion>
  );
};

export default DiseaseDetail;
