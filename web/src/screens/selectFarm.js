import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  RefreshControl,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {Button, SpeedDial, Skeleton} from '@rneui/themed';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {font, buttons} from './styles';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SelectFarm = ({navigation}) => {
  const [open, setOpen] = useState(false);
  const [farm, setFarm] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [loadData, setLoadData] = useState(true);

  const onRefresh = () => {
    getFarm();
    setRefreshing(true);
  };
  useEffect(() => {
    navigation.addListener('focus', getFarm);
  }, []);

  const getFarm = async () => {
    const value = await AsyncStorage.getItem('user_token');

    axios
      .get('http://35.244.169.189.nip.io/v1/farms', {
        headers: {
          Authorization: `Bearer ${value}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        // console.log(response.data);
        setFarm(response.data);
        setTimeout(() => {
          setRefreshing(false);
          setLoadData(false);
        }, 500);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const onSelectFarm = async item => {
    await AsyncStorage.setItem('user_farm', JSON.stringify(item));

    navigation.navigate('Home', {name: item.farm_name});
  };
  if (loadData) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {[...Array(8)].map((_, index) => (
            <Skeleton
              LinearGradientComponent={LinearGradient}
              animation="wave"
              style={{borderRadius: 40, margin: 15}}
              // skeletonStyle={{}}
              width={145}
              height={145}
              key={index} // add a key prop to avoid a warning
            />
          ))}
        </View>
      </SafeAreaView>
    );
  }
  return (
    <View style={styles.container}>
      <SpeedDial
        isOpen={open}
        icon={{name: 'edit', color: '#fff'}}
        openIcon={{name: 'close', color: '#fff'}}
        style={{zIndex: 99}}
        onOpen={() => setOpen(!open)}
        onClose={() => setOpen(!open)}>
        <SpeedDial.Action
          icon={{name: 'add', color: '#fff'}}
          color="#047675"
          title="Add"
          titleStyle={{backgroundColor: '#fff'}}
          onPress={() => {
            navigation.navigate('CreateFarm');
            setOpen(!open);
          }}
        />
      </SpeedDial>

      {farm.length <= 0 ? (
        <SafeAreaView style={styles.container}>
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
                ไม่มีไร่
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      ) : (
        <FlatList
          numColumns={2}
          // contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 100,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          data={farm}
          renderItem={({item}) => (
            <Button
              type="clear"
              title={item.farm_name}
              titleStyle={[{color: '#000'}, font.kanit]}
              style={[styles.btn, styles.shadowProp, {backgroundColor: '#fff'}]}
              icon={
                <>
                  <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                    <MaterialCommunityIcons
                      name="hoop-house"
                      size={60}
                      color="#F36E67"
                    />
                    <MaterialCommunityIcons
                      name="tree-outline"
                      size={30}
                      color="#000"
                    />
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                    <MaterialCommunityIcons
                      style={{
                        transform: [{rotate: '90deg'}],
                        marginRight: -14,
                      }}
                      name="equal"
                      size={30}
                      color="#047675"
                    />
                    <MaterialCommunityIcons
                      style={{transform: [{rotate: '90deg'}]}}
                      name="equal"
                      size={30}
                      color="#047675"
                    />
                    <MaterialCommunityIcons
                      style={{
                        transform: [{rotate: '90deg'}],
                        marginLeft: -14,
                      }}
                      name="equal"
                      size={30}
                      color="#047675"
                    />
                    <MaterialCommunityIcons
                      style={{
                        transform: [{rotate: '90deg'}],
                        marginLeft: -14,
                      }}
                      name="equal"
                      size={30}
                      color="#047675"
                    />
                  </View>
                </>
              }
              iconPosition="top"
              onPress={() => {
                onSelectFarm(item);
              }}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
  scrollView: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 40,
    margin: 5,
    paddingVertical: 15,
    paddingHorizontal: 25,
    width: '82%',
    height: 150,
  },
  btn: {
    flexDirection: 'column',
    borderColor: 0,
    borderRadius: 40,
    justifyContent: 'center',
    height: 145,
    width: 145,
    margin: 15,
  },
  shadowProp: {
    shadowOffset: {width: 0, height: 4},
    shadowColor: '#171717',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 14,
  },
});
export default SelectFarm;
