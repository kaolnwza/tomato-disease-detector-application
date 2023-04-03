import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Modal from 'react-native-modal';
import {useSharedValue} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Feather from 'react-native-vector-icons/dist/Feather';
import Geolocation from '@react-native-community/geolocation';

import {
  TabbedHeaderPager,
  DetailsHeaderScrollView,
} from 'react-native-sticky-parallax-header';
import {Button, ListItem, Avatar, Chip, Divider} from '@rneui/themed';
import {font, buttons} from './styles';
import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios';
import moment from 'moment';
import HistoryMap from '../components/map/historyMap';
import DiseaseDetail from '../components/list/disease-detail';
import StageSelect from '../components/carousel/stageSelect';

const Detail = ({detail}) => {
  const [info, setInfo] = useState([]);

  useEffect(() => {
    axios
      .get(
        `http://35.244.169.189.nip.io/v1/diseases/name/${detail.disease_name}`,
        {
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NfdXVpZCI6IjUzYmRhZThlLWMxZTMtNDAzMC1hODVkLWNkMWZhOTNhOWJlNSIsImV4cCI6MTg1MzkyNTA4OCwidXNlcl91dWlkIjoiOGU0ZDgzMjAtOGExOS00NmZjLTgxNTEtN2E2MjI2ZDc2ZjZiIn0.YKjeADsaC5oKaD4bBEkWxTDVbZMH_34j4Vx3bKgeZhc',
          },
        },
      )
      .then(response => {
        setInfo(response.data.inform);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <FlatList
      data={info.inform_data}
      renderItem={({item, index}) => <DiseaseDetail item={item} />}
      keyExtractor={item => item.title.toString()}
    />
  );
};

const History = ({navigation}) => {
  const [TABS, setTABS] = useState([
    {
      title: 'ตำแหน่ง',
      component: 'map',
    },
    {
      title: 'ข้อมูลโรค',
      component: 'inform',
    },
    {
      title: 'จัดการ',
      component: 'fix',
    },
  ]);

  const allDisease = [
    {label: 'ใบสุขภาพดี', value: 'Healthy'},
    {label: 'โรคใบจุด', value: 'Bacterial Spot'},
    {label: 'โรคใบหงิกเหลือง', value: 'Yellow Leaf Curl Virus'},
    {label: 'โรคไรสองจุด', value: 'Spider Mites'},
    {label: 'โรคใบจุดวงกลม', value: 'Septoria Leaf Spot'},
    {label: 'โรคใบด่าง', value: 'Mosaic Virus'},
    {label: 'โรคใบไหม้', value: 'Late Blight'},
    {label: 'โรคใบจุดวง', value: 'Early Blight'},
    {label: 'โรครากำมะหยี่', value: 'Leaf Mold'},
  ];
  const scrollValue = useSharedValue(0);

  const [modalIndex, setModalIndex] = useState(-1);
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectItem = itemValue => {
    if (selectedItems.includes(itemValue)) {
      // If the item is already selected, remove it from the selected items list
      setSelectedItems(prevSelectedItems =>
        prevSelectedItems.filter(selectedItem => selectedItem !== itemValue),
      );
    } else {
      // If the item is not selected, add it to the selected items list
      setSelectedItems(prevSelectedItems => [...prevSelectedItems, itemValue]);
    }
  };

  const isItemSelected = itemValue => selectedItems.includes(itemValue);

  const handleOpenModal = () => {
    setIsVisible(true);
  };

  const handleCloseModal = () => {
    setIsVisible(false);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Put your refresh logic here
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // Simulate a delay before refreshing completes
  };
  useEffect(() => {
    getLog();
  }, [refreshing]);

  function onScroll(e) {
    'worklet';
    scrollValue.value = e.contentOffset.y;
  }
  const getLog = async () => {
    const token = await AsyncStorage.getItem('user_token');

    const current_farm = JSON.parse(await AsyncStorage.getItem('user_farm'));

    axios
      .get(
        `http://35.244.169.189.nip.io/v1/farms/${current_farm.farm_uuid}/log`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(response => {
        setHistory(response.data);
        setRefreshing(false);
      })
      .catch(error => {
        console.log(error);
        setRefreshing(false);
      });
  };

  const keyExtractor = (item, index) => index.toString();

  const onSelect = (item, index) => {
    if (item == 'Healthy') {
      setTABS([
        {
          title: 'ตำแหน่ง',
          component: 'map',
        },
      ]);
    } else {
      setTABS([
        {
          title: 'ตำแหน่ง',
          component: 'map',
        },
        {
          title: 'ข้อมูลโรค',
          component: 'inform',
        },
        {
          title: 'จัดการ',
          component: 'fix',
        },
      ]);
    }

    setModalIndex(index);
  };

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      key={index}
      onPress={() => onSelect(item.disease_name, index)}>
      <ListItem bottomDivider containerStyle={{backgroundColor: '#00000000'}}>
        <View
          style={{
            backgroundColor:
              item.disease_name == 'Healthy' ? '#047675' : '#E72970',
            borderRadius: 50,
            padding: 5,
          }}>
          <Avatar
            rounded
            size={60}
            source={item.image_uri && {uri: item.image_uri}}
            title={<ActivityIndicator />}
          />
        </View>
        <ListItem.Content>
          <ListItem.Title style={font.kanit}>
            {item.disease_name_th}
          </ListItem.Title>
          <ListItem.Subtitle style={font.kanit}>
            {item.disease_name}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Content right>
          <ListItem.Title
            right
            style={{
              color: true ? '#047675' : '#E72970',
              fontFamily: 'Kanit-Regular',
            }}>
            {item.score} %
          </ListItem.Title>
          <ListItem.Subtitle style={[font.kanit, {textAlign: 'right'}]} right>
            {moment(item.created_at).format('DD/MM/YYYY HH:mm')}
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </TouchableOpacity>
  );
  if (!history) {
    return (
      <SafeAreaView style={{flex: 1, paddingTop: 100}}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 100,
            }}>
            <MaterialCommunityIcons
              size={60}
              color="#00000066"
              name="window-close"
            />

            <Text style={[font.kanit, {fontSize: 20, color: '#00000066'}]}>
              ไม่มีข้อมูล
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        style={{
          borderRadius: 50,
          backgroundColor: '#047675',
          padding: 10,
          bottom: 50,
          right: 20,
          zIndex: 1,
          position: 'absolute',
        }}>
        <MaterialCommunityIcons name="filter-variant" size={35} color="#fff" />
      </TouchableOpacity>

      <FlatList
        keyExtractor={keyExtractor}
        data={history}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={renderItem}
      />
      {/* Modal */}
      <Modal
        isVisible={isVisible}
        onBackdropPress={handleCloseModal}
        onSwipeComplete={handleCloseModal}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        swipeDirection="right"
        style={styles.modal}>
        <View style={styles.modalContent}>
          <Text
            style={[font.kanit, {color: '#00000077', marginHorizontal: 10}]}>
            หมวดหมู่โรค
          </Text>
          <Divider style={{marginVertical: 5}} />

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginBottom: 10,
            }}>
            {allDisease.map((item, i) => (
              <Chip
                key={i}
                title={item.label}
                buttonStyle={[
                  styles.chipButton,
                  isItemSelected(item.value) && styles.chipButtonSelected,
                ]}
                titleStyle={[
                  styles.chipTitle,
                  isItemSelected(item.value) && styles.chipTitleSelected,
                  font.kanit,
                ]}
                onPress={() => handleSelectItem(item.value)}
                type="outline"
                size="sm"
              />
            ))}
            {/* <Text>{JSON.stringify(selectedItems)}</Text> */}
          </View>
          <Text
            style={[font.kanit, {color: '#00000077', marginHorizontal: 10}]}>
            วัน
          </Text>
          <Divider style={{marginVertical: 5}} />
        </View>
      </Modal>
      <Modal
        isVisible={modalIndex !== -1}
        style={{justifyContent: 'flex-end'}}
        onBackdropPress={() => setModalIndex(-1)}
        onModalHide={() => setModalIndex(-1)}>
        <TabbedHeaderPager
          containerStyle={styles.stretchContainer}
          backgroundImage={{
            uri: history[modalIndex]
              ? history[modalIndex].image_uri
              : 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png',
          }}
          title={
            <View style={{flexDirection: 'column', paddingHorizontal: 10}}>
              <Text style={[font.kanit, {color: '#fff', fontSize: 40}]}>
                {history[modalIndex]
                  ? history[modalIndex].disease_name_th
                  : null}
              </Text>
              <Text
                style={[font.kanit, {color: '#fff', fontSize: 13, margin: 0}]}>
                {' '}
                {history[modalIndex] ? history[modalIndex].description : ''}
              </Text>
            </View>
          }
          titleStyle={styles.titleStyle}
          tabTextContainerStyle={styles.tabTextContainerStyle}
          tabTextContainerActiveStyle={styles.tabTextContainerActiveStyle}
          tabTextStyle={styles.tabText}
          tabTextActiveStyle={styles.tabTextActiveStyle}
          tabWrapperStyle={styles.tabWrapperStyle}
          tabsContainerStyle={styles.tabsContainerStyle}
          parallaxHeight={300}
          snapStartThreshold={50}
          onScroll={onScroll}
          renderHeaderBar={() => (
            <View
              style={{
                padding: 10,
                width: '100%',
                zIndex: 99,
              }}>
              <Text style={{position: 'absolute', top: 25, right: 0}}>
                <Button
                  type="clear"
                  onPress={() => setModalIndex(-1)}
                  icon={
                    <Feather name="x-circle" size={30} color="#fff" />
                  }></Button>
              </Text>
            </View>
          )}
          tabs={TABS}
          showsVerticalScrollIndicator={false}>
          {/* <Text>{JSON.stringify(history[modalIndex].status)}</Text> */}
          {TABS.map((tab, i) => {
            switch (tab.component) {
              case 'map':
                return <HistoryMap key={i} detail={history[modalIndex]} />;
              case 'inform':
                return (
                  <ScrollView
                    key={i}
                    scrollEnabled={true}
                    style={{height: 500}}>
                    <Detail detail={history[modalIndex]} />
                  </ScrollView>
                );
              case 'fix':
                return <StageSelect key={i} detail={history[modalIndex]} />;
              default:
                return <Text key={i}>No Component</Text>;
            }
          })}
        </TabbedHeaderPager>
      </Modal>
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
  scrollView: {
    flex: 1,

    alignItems: 'center',
  },
  titleStyle: {
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    color: '#fff',
  },
  tabTextContainerStyle: {
    borderRadius: 18,
  },
  tabTextContainerActiveStyle: {
    backgroundColor: '#047675',
  },
  tabText: {
    color: '#000',
    fontFamily: 'Kanit',
    fontSize: 16,
    lineHeight: 20,
    paddingHorizontal: 12,

    paddingVertical: 8,
  },
  tabTextActiveStyle: {
    fontFamily: 'Kanit',
    fontSize: 16,
    color: '#fff',

    lineHeight: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tabsContainerStyle: {
    backgroundColor: '#F2f2f2',
  },
  contentContainer: {
    padding: 10,
  },
  contentText: {
    fontSize: 16,
  },
  content: {
    flex: 1,

    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 25,
  },
  stretchContainer: {
    alignSelf: 'stretch',
    height: 100,

    backgroundColor: '#F2f2f2',
    borderRadius: 20,
  },
  modal: {
    justifyContent: 'flex-start',
    margin: 0,
    alignSelf: 'flex-end',
  },
  modalContent: {
    height: '100%',
    width: 250,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 50,
  },
  chipButton: {
    margin: 5,
    borderColor: 'gray',
    backgroundColor: 'white',
  },
  chipButtonSelected: {
    backgroundColor: '#047675',
  },
  chipTitle: {
    color: 'gray',
  },
  chipTitleSelected: {
    color: 'white',
  },
});

export default History;
