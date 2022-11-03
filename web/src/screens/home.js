import React, {useState} from 'react';
import {Text, StyleSheet, FlatList, View} from 'react-native';
import {Button, lightColors, createTheme, ThemeProvider} from '@rneui/themed';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import {font, buttons} from './styles';
export const HomeScreen = ({navigation}) => {
  const [menu, setMenu] = useState([
    {name: 'ประวัติการบันทึก', color: '#047675', icon: 'list-outline'},
    {name: 'กล้อง', page: 'Camera', color: '#E72970', icon: 'camera-outline'},
    {name: 'โรคพืช', color: '#3ED48D', icon: 'leaf-outline'},
    {name: 'ตั้งค่า', color: '#FCC93A', icon: 'settings-outline'},
  ]);

  const jewelStyle = options => {
    return {
      backgroundColor: options,
    };
  };
  return (
    <View style={styles.container}>
      <View style={[styles.card, styles.shadowProp]}>
        <Text style={font.kanit}>React Native Box Shadow (Shadow Props)</Text>
      </View>

      <FlatList
        numColumns={2}
        columnWrapperStyle={{justifyContent: 'space-between'}}
        data={menu}
        renderItem={({item}) => (
          <Button
            type="clear"
            title={item.name}
            titleStyle={[{color: '#fff'}, font.kanit]}
            style={[styles.btn, styles.shadowProp, jewelStyle(item.color)]}
            icon={<Icon name={item.icon} size={60} color="#fff" />}
            iconPosition="top"
            onPress={() => {
              navigation.navigate(item.page);
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
    justifyContent: 'center',
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
