import React, {useEffect, useState, useRef} from 'react';
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
import Octicons from 'react-native-vector-icons/dist/Octicons';
import LinearGradient from 'react-native-linear-gradient';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Feather from 'react-native-vector-icons/dist/Feather';
import Geolocation from '@react-native-community/geolocation';
import ActionSheet from 'react-native-actions-sheet';
import DatepickerRange from 'react-native-range-datepicker';
import {
  TabbedHeaderPager,
  DetailsHeaderScrollView,
} from 'react-native-sticky-parallax-header';
import {Button, ListItem, Avatar, Chip, Divider, Skeleton} from '@rneui/themed';
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
      .get(`http://34.110.173.162/v1/diseases/name/${detail.disease_name}`, {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NfdXVpZCI6IjUzYmRhZThlLWMxZTMtNDAzMC1hODVkLWNkMWZhOTNhOWJlNSIsImV4cCI6MTg1MzkyNTA4OCwidXNlcl91dWlkIjoiOGU0ZDgzMjAtOGExOS00NmZjLTgxNTEtN2E2MjI2ZDc2ZjZiIn0.YKjeADsaC5oKaD4bBEkWxTDVbZMH_34j4Vx3bKgeZhc',
        },
      })
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
  const actionSheetRef = useRef();

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
  const [refreshing, setRefreshing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loadData, setLoadData] = useState(true);

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

  const handleCloseModal = () => {
    setIsVisible(false);
  };

  const onNoDataRefresh = () => {
    setRefreshing(true);
    // Put your refresh logic here
    setSelectedItems([]);
    setStartDate('');
    setEndDate('');
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
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
  }, [selectedItems, refreshing, startDate]);

  function onScroll(e) {
    'worklet';
    scrollValue.value = e.contentOffset.y;
  }
  const getLog = async () => {
    const token = await AsyncStorage.getItem('user_token');

    const current_farm = JSON.parse(await AsyncStorage.getItem('user_farm'));

    axios
      .get(
        `http://34.110.173.162/v1/farms/${
          current_farm.farm_uuid
        }/log?disease_name=${selectedItems.join(',')}&start_time=${
          startDate
            ? `${moment(new Date(startDate)).format('YYYY-MM-DD')}T00:00:00`
            : ''
        }&end_time=${
          startDate
            ? `${
                endDate
                  ? moment(new Date(endDate)).format('YYYY-MM-DD')
                  : moment(new Date(startDate)).format('YYYY-MM-DD')
              }T23:59:59`
            : ''
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(response => {
        setHistory(response.data);
        setLoadData(false);
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
              item.status == 'monitoring'
                ? '#2089dc'
                : item.status == 'cured'
                ? '#3ED48D'
                : '#E72970',
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
            {item.disease_name_th}{' '}
            {item.status == 'monitoring' ? '(กำลังรักษา)' : null}
            {item.status == 'cured' ? '(รักษาแล้ว)' : null}
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

                  marginVertical: 18,
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
                    width={65}
                    height={65}
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
                <View
                  style={{
                    justifyContent: 'space-evenly',
                    marginLeft: 10,
                    alignItems: 'flex-end',
                  }}>
                  <Skeleton
                    LinearGradientComponent={LinearGradient}
                    animation="wave"
                    width={30}
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
                  <Skeleton
                    LinearGradientComponent={LinearGradient}
                    animation="wave"
                    width={40}
                    height={10}
                    style={{borderRadius: 30}}
                  />
                </View>
              </View>
              <Divider />
            </View>
          ))}
        </View>
      </SafeAreaView>
    );
  }
  if (!history) {
    return (
      <SafeAreaView style={{flex: 1, paddingTop: 100}}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onNoDataRefresh}
            />
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
          <View>
            <Text
              style={[font.kanit, {color: '#00000077', marginHorizontal: 10}]}>
              โรค
            </Text>
            <Divider style={{marginVertical: 5}} />
            <View
              style={{
                // flexDirection: 'row',
                // flexWrap: 'wrap',
                marginBottom: 30,
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
              {/* <Text>{selectedItems.join(',')}</Text> */}
            </View>
            <Text
              style={[font.kanit, {color: '#00000077', marginHorizontal: 10}]}>
              วัน
            </Text>
            <Divider style={{marginVertical: 5}} />
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginVertical: 10,
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <Button
                title={
                  startDate
                    ? moment(new Date(startDate)).format('DD-MM-YYYY')
                    : 'วันที่เริ่มต้น'
                }
                type="outline"
                buttonStyle={{borderRadius: 30, paddingHorizontal: 10}}
                titleStyle={[font.kanit, {fontSize: 16}]}
                onPress={() => actionSheetRef.current?.show()}
                size="sm"
              />
              <Octicons name="chevron-right" size={25} />

              <Button
                title={
                  endDate
                    ? moment(new Date(endDate)).format('DD-MM-YYYY')
                    : 'วันที่สุดท้าย'
                }
                type="outline"
                buttonStyle={{borderRadius: 30, paddingHorizontal: 10}}
                titleStyle={[font.kanit, {fontSize: 16}]}
                size="sm"
                onPress={() => actionSheetRef.current?.show()}
              />
            </View>
          </View>
          <Button
            style={{marginVertical: 10}}
            buttonStyle={{borderRadius: 30}}
            titleStyle={font.kanit}
            title="รีเซ็ตข้อมูล"
            size="sm"
            onPress={() => {
              setSelectedItems([]);
              setStartDate('');
              setEndDate('');
            }}
          />
          <ActionSheet
            ref={actionSheetRef}
            containerStyle={{
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
            }}
            indicatorStyle={{
              width: 100,
            }}>
            <View style={{height: 550}}>
              <DatepickerRange
                maxMonth={4}
                maxDate={moment().format('L')}
                initialMonth={moment().subtract(3, 'months').format('YYYYMM')}
                onClose={() => actionSheetRef.current?.hide()}
                selectedBackgroundColor="#047675"
                onConfirm={(start, until) => {
                  setStartDate(start);
                  setEndDate(until);

                  actionSheetRef.current?.hide();
                }}
              />
            </View>
          </ActionSheet>
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
                return (
                  <StageSelect
                    key={i}
                    detail={history[modalIndex]}
                    onChangeState={getLog}
                  />
                );
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
    justifyContent: 'space-between',

    height: '100%',
    width: 300,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 60,
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
