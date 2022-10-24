import React, {useState} from 'react';
import {Text, StyleSheet, FlatList} from 'react-native';
import {
  Button,
  Icon,
  Layout,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';

export const HomeScreen = ({navigation}) => {
  const [menu, setMenu] = useState([
    {name: 'ประวัติการบันทึก', color: '#047675', icon: 'list-outline'},
    {name: 'กล้อง', page: 'Camera', color: '#E72970', icon: 'camera-outline'},
    {name: 'โรคพืช', color: '#3ED48D', icon: 'camera-outline'},
    {name: 'ตั้งค่า', color: '#FCC93A', icon: 'settings-2-outline'},
  ]);

  const jewelStyle = options => {
    return {
      backgroundColor: options,
    };
  };

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
            style={[styles.btn, styles.shadowProp, jewelStyle(item.color)]}
            accessoryLeft={() => (
              <Icon style={styles.icon} fill="#fff" name={item.icon} />
            )}
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
    paddingTop: 100,
    backgroundColor: '#F0F9F8',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 40,
    paddingVertical: 80,
    paddingHorizontal: 25,
    margin: 5,
  },
  btn: {
    flexDirection: 'column',
    borderColor: 0,
    borderRadius: 40,
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
  icon: {
    width: 50,
    height: 50,
  },
});
