import React, {useRef} from 'react';

import {Linking, SafeAreaView, StyleSheet, View, Image} from 'react-native';
import {Divider, Icon, Layout, Text, Button} from '@ui-kitten/components';

export const ValidatePhoto = ({route}) => {
  const {photo} = route.params;
  return (
    <Layout style={{flex: 1}}>
      {console.log(photo.path)}
      <Image
        style={{height: 1000}}
        source={{
          uri: photo.path,
        }}
      />
    </Layout>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
