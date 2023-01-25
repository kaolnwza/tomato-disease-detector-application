import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, FlatList, View, TouchableOpacity} from 'react-native';
import {Button} from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {font, buttons} from './styles';

const SelectFarm = ({navigation}) => {
  const [farm, setFarm] = useState([
    {
      name: 'FARM 1',
      page: 'History',
    },
    {
      name: 'FARM 2',
      page: 'Camera',
    },
    {
      name: 'FARM 3',
      page: 'Information',
    },
    {
      name: 'FARM 4',
      page: 'Setting',
    },
  ]);
  return (
    <View style={styles.container}>
      <FlatList
        numColumns={2}
        // contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}
        contentContainerStyle={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        data={farm}
        renderItem={({item}) => (
          <Button
            type="clear"
            title={item.name}
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
                    style={{transform: [{rotate: '90deg'}], marginRight: -14}}
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
                    style={{transform: [{rotate: '90deg'}], marginLeft: -14}}
                    name="equal"
                    size={30}
                    color="#047675"
                  />
                  <MaterialCommunityIcons
                    style={{transform: [{rotate: '90deg'}], marginLeft: -14}}
                    name="equal"
                    size={30}
                    color="#047675"
                  />
                </View>
              </>
            }
            iconPosition="top"
            onPress={() => {
              navigation.navigate('Home', {name: item.name});
            }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 100,
    backgroundColor: '#F0F9F8',
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
