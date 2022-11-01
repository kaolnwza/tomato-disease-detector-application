import React, {useRef} from 'react';

import {Linking, SafeAreaView, StyleSheet, View, Image} from 'react-native';
// import {Divider, Icon, Layout, Text, Button} from '@ui-kitten/components';
import {Button} from '@rneui/base';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

export const ValidatePhoto = ({route, navigation}) => {
  const {photo} = route.params;
  return (
    <View style={{flex: 1}}>
      <Image
        style={{height: 1000}}
        source={{
          uri: photo.path,
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 80,
          flexDirection: 'row',
          alignSelf: 'center',
          justifyContent: 'space-between',
        }}>
        <Button
          style={{
            borderRadius: 50,
            margin: 5,
            marginRight: 120,
            paddingHorizontal: 16,
            backgroundColor: '#E72970',
            borderWidth: 0,
          }}
          type="clear"
          icon={<Icon name="react" size={15} color="#0FF" />}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Button
          style={{
            borderRadius: 50,
            margin: 5,
            paddingHorizontal: 16,
            backgroundColor: '#047675',
            borderWidth: 0,
          }}
          type="clear"
          onPress={() => navigation.navigate('Result', {photo})}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 50,
    height: 50,
  },
});
