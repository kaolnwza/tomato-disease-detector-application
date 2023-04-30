import {Text, StyleSheet, FlatList, View, TouchableOpacity} from 'react-native';
import {Button, ListItem, Avatar} from '@rneui/themed';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {font, buttons} from './styles';

const Setting = ({navigation}) => {
  const list = [
    {
      name: 'จัดการฟาร์ม',
      icon: 'view-dashboard-edit-outline',
    },
    {
      name: 'คู่มือการใช้งาน ',
      icon: 'book-alert-outline',
    },
  ];
  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({item}) => (
    <TouchableOpacity>
      <ListItem bottomDivider containerStyle={{backgroundColor: '#00000000'}}>
        <MaterialCommunityIcons name={item.icon} size={25} color="#000" />
        <ListItem.Content>
          <ListItem.Title style={font.kanit}>{item.name}</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={keyExtractor}
        data={list}
        renderItem={renderItem}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: 'flex-start',
    paddingTop: 100,
  },
});

export default Setting;
