import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import MapView, {Polygon, Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {SpeedDial, Button, Tooltip, Input} from '@rneui/themed';
import {font} from './styles';
import Feather from 'react-native-vector-icons/dist/Feather';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import Modal from 'react-native-modal';
import axios from 'axios';

const MapScreen = () => {
  const [coordinates, setCoordinates] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [toolTip, setToolTip] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [farmName, setFarmName] = useState('');

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        Geolocation.getCurrentPosition(
          position => {
            const {latitude, longitude} = position.coords;
            setCurrentRegion({
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          },
          error => console.log(error),
          {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
        );
      } catch (err) {
        console.warn(err);
      }
    };
    requestLocationPermission();
  }, []);

  const handleMapPress = event => {
    const newCoordinate = {
      latitude: event.nativeEvent.coordinate.latitude,
      longitude: event.nativeEvent.coordinate.longitude,
    };
    setCoordinates([...coordinates, newCoordinate]);
  };

  const handleRemoveLastCoordinate = () => {
    setCoordinates(coordinates.slice(0, -1));
  };

  const handleSaveFarm = () => {
    console.log(farmName.trim(), coordinates);
    const data = new FormData();
    data.append('farm_name', farmName.trim());
    data.append('location', coordinates);
    axios
      .post('http://139.59.120.159:8080/v1/farms', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View style={{flex: 1}}>
      {currentRegion && (
        <MapView
          style={{flex: 1}}
          initialRegion={currentRegion}
          onPress={handleMapPress}>
          {coordinates.length > 2 && (
            <Polygon
              coordinates={coordinates}
              fillColor="rgba(255, 0, 0, 0.5)"
              strokeColor="rgba(255, 0, 0, 1)"
              strokeWidth={2}
            />
          )}
          {coordinates.map((coordinate, index) => (
            <Marker key={index} coordinate={coordinate} />
          ))}
        </MapView>
      )}
      <View style={{position: 'absolute', right: 0, bottom: 150}}>
        <SpeedDial.Action
          color="#00000055"
          icon={{name: 'redo', color: '#fff'}}
          onPress={handleRemoveLastCoordinate}
          disabled={coordinates.length === 0}
        />
        <Tooltip
          overlayColor="tranparent"
          visible={toolTip}
          onOpen={() => setToolTip(true)}
          onClose={() => setToolTip(false)}
          containerStyle={{width: 145, height: 130}}
          popover={
            <Text style={[font.kanit, {color: '#fff'}]}>
              {
                'เลือกพื้นที่โดยการเตะไปยังจุดที่ต้องการ และต้องมากกว่า 3 จุด จึงจะสามารถบันทึกพื้นที่ได้'
              }
            </Text>
          }>
          <SpeedDial.Action
            onPress={() => setToolTip(!toolTip)}
            color="#00000055"
            icon={<AntDesign name="question" size={20} color="#fFF" />}
          />
        </Tooltip>
      </View>
      <View style={{position: 'absolute', bottom: 50, alignSelf: 'center'}}>
        {coordinates.length > 2 ? (
          <Button
            onPress={() => setModalVisible(true)}
            icon={<Feather name="check" size={50} color="#fFF" />}
            buttonStyle={{
              width: 75,
              height: 75,
              margin: 5,
              borderRadius: 100,
              backgroundColor: '#047675',
              borderColor: '#fff',
              borderWidth: 4,
            }}
            type="clear"
          />
        ) : null}
      </View>
      <Modal
        isVisible={isModalVisible}
        style={{justifyContent: 'flex-end'}}
        onBackdropPress={() => setModalVisible(false)}
        onModalHide={() => setModalVisible(false)}>
        <View
          style={{
            margin: -20,
            borderRadius: 30,
            padding: 20,
            height: '70%',
            backgroundColor: '#fff',
          }}>
          <Text style={[font.kanit, {fontSize: 20, alignSelf: 'center'}]}>
            ตั้งชื่อไร่
          </Text>
          <Input
            placeholder="ชื่อ"
            inputStyle={[font.kanit]}
            onChangeText={newText => setFarmName(newText)}
            defaultValue={farmName}
            style={{
              alignSelf: 'center',
              textAlign: 'center',
            }}
          />
          <Button
            size="lg"
            disabled={farmName.trim().length === 0}
            style={{marginHorizontal: 20}}
            onPress={() => handleSaveFarm()}
            buttonStyle={{
              borderRadius: 10,
              backgroundColor: '#047675',
            }}>
            <Text style={[font.kanit, {fontSize: 20, color: '#fff'}]}>
              บันทึก
            </Text>
          </Button>
          <View></View>
        </View>
      </Modal>
    </View>
  );
};

export default MapScreen;
