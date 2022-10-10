import React, {useState} from 'react';
import {Text, StyleSheet, FlatList} from 'react-native';
import {Button, Divider, Layout, TopNavigation} from '@ui-kitten/components';

export const HomeScreen = ({navigation}) => {
  const navigateDetails = () => {
    navigation.navigate('Camera');
  };

  const [menu, setMenu] = useState([
    {name: 'ประวัติการบันทึก'},
    {name: 'กล้อง', page: 'Camera'},
    {name: 'โรคพืช'},
    {name: 'ตั้งค่า'},
  ]);

  return (
    <Layout style={styles.container}>
      <Layout style={[styles.card, styles.shadowProp]}>
        <Text style={styles.heading}>
          React Native Box Shadow (Shadow Props)
        </Text>
      </Layout>

      <FlatList
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        data={menu}
        renderItem={({item}) => (
          <Button
            style={[styles.btn, styles.shadowProp]}
            onPress={() => {
              navigation.navigate(item.page);
            }}>
            <Text>{item.name}</Text>
          </Button>
        )}
      />
    </Layout>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingVertical: 80,
    paddingHorizontal: 25,
    margin: 5,
  },
  btn: {
    borderColor: 0,
    borderRadius: 15,
    height: 145,
    width: 145,
    margin: 15,
  },
  shadowProp: {
    shadowOffset: {width: 0, height: 4},
    shadowColor: '#171717',
    shadowOpacity: 0.2,
    shadowRadius: 11,
    elevation: 14,
  },
});
