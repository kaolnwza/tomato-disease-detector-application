import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import {useSharedValue} from 'react-native-reanimated';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Feather from 'react-native-vector-icons/dist/Feather';
import Geolocation from '@react-native-community/geolocation';

import {
  TabbedHeaderPager,
  DetailsHeaderScrollView,
} from 'react-native-sticky-parallax-header';
import {Button, ListItem, Avatar, Tab, TabView} from '@rneui/themed';
import {font, buttons} from './styles';
import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios';
import moment from 'moment';
import HistoryMap from '../components/map/historyMap';
import DiseaseDetail from '../components/list/disease-detail';

const Detail = props => {
  const [info, setInfo] = useState([]);

  useEffect(() => {
    axios
      .get(
        `http://139.59.120.159:8080/v1/disease/${props.detail.disease_name}`,
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
      title: 'รักษา',
      component: 'fix',
    },
  ]);
  const scrollValue = useSharedValue(0);

  const [modalIndex, setModalIndex] = useState(-1);
  const [history, setHistory] = useState([]);
  useEffect(() => {
    getLog();
  }, []);

  function onScroll(e) {
    'worklet';
    scrollValue.value = e.contentOffset.y;
  }
  const getLog = async () => {
    // console.log('get log');
    axios
      .get(
        'http://139.59.120.159:8080/v1/farms/e621bea6-1143-4a15-ad84-9048f80183b3/log',
        {
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NfdXVpZCI6IjUzYmRhZThlLWMxZTMtNDAzMC1hODVkLWNkMWZhOTNhOWJlNSIsImV4cCI6MTg1MzkyNTA4OCwidXNlcl91dWlkIjoiOGU0ZDgzMjAtOGExOS00NmZjLTgxNTEtN2E2MjI2ZDc2ZjZiIn0.YKjeADsaC5oKaD4bBEkWxTDVbZMH_34j4Vx3bKgeZhc',
          },
        },
      )
      .then(response => {
        console.log(response.data);
        setHistory(response.data);
      })
      .catch(error => {
        console.log(error);
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
          title: 'รักษา',
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
            89%
          </ListItem.Title>
          <ListItem.Subtitle style={[font.kanit, {textAlign: 'right'}]} right>
            {moment(item.created_at).format('DD/MM/YYYY HH:mm')}
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={keyExtractor}
        data={history}
        renderItem={renderItem}
      />
      {/* Modal */}
      <Modal
        isVisible={modalIndex !== -1}
        style={{justifyContent: 'flex-end'}}
        onBackdropPress={() => setModalIndex(-1)}
        onModalHide={() => setModalIndex(-1)}>
        <TabbedHeaderPager
          containerStyle={styles.stretchContainer}
          backgroundImage={{
            uri: history[modalIndex] ? history[modalIndex].image_uri : null,
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
});

export default History;
