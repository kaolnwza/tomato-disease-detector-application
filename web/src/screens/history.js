import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  ActivityIndicator,
} from 'react-native';
import {Button, ListItem, Avatar} from '@rneui/themed';
import {font, buttons} from './styles';
import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios';
import moment from 'moment';
const History = ({navigation}) => {
  const list = [
    {
      name: 'สุขภาพดี',
      avatar_url:
        'https://storage.googleapis.com/kagglesdsdata/datasets/277323/658267/color/Tomato___Bacterial_spot/00416648-be6e-4bd4-bc8d-82f43f8a7240___GCREC_Bact.Sp%203110.JPG?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=databundle-worker-v2%40kaggle-161607.iam.gserviceaccount.com%2F20221215%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20221215T150528Z&X-Goog-Expires=345600&X-Goog-SignedHeaders=host&X-Goog-Signature=827e10e1a8d2494f0e597e865143d809ba679950186f1edfd8e5c6699ce303e7b64db44299febc958154793d32d4941267c9e05bc6cc8c44f1a30d367851fb099445d25a35265ac5ea6ca9b2b65e6f70a2f6020a7c89411785d58bfc88e589fa3b571fc0595d7241087f9a6c233928ba74685170180886a81591e3234a4911fd825b81d669aab70b4e1243cb6a915cdf5cbfe2152712df4fea71ad01624be5ed99a93acaf0a7465b3eb9b836acd60d0717c50e62ce6ef1371d6d7557bb17993dba32017e6d689a6e403d35328215ac5a805221977cbcac5e0dc0e8b9e41ac7e4733158a8300effac93811489e52d9f053d402028fe32e07f85d3d2d586c8c4aa',
      subtitle: 'Healthy',
    },
    {
      name: 'รากำมะหยี่ ',
      avatar_url:
        'https://storage.googleapis.com/kagglesdsdata/datasets/277323/658267/color/Tomato___Leaf_Mold/0160c3b5-d89e-40e5-a313-49ae1524040a___Crnl_L.Mold%206823.JPG?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=databundle-worker-v2%40kaggle-161607.iam.gserviceaccount.com%2F20221215%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20221215T053843Z&X-Goog-Expires=345600&X-Goog-SignedHeaders=host&X-Goog-Signature=17007403797bf8133101223ece80c30d615262ba7e74ddcaa9a10d761bcb0d9e9cc86c443240b6fec5c257dc4e3432ee016789542f029564c6ecfd8cdfbbe6777a674a1e5b44483026d523d334cd0d820e243a63728328c4524021a63b9666f8e53b08a3bdf1dc0a4f65683d45640f6c93265fd0bf2eba7d0e1ab8079af92decbe15b39c6f626a1cf62bc6664e1bdb65a721546b509de5bc9b048c806bcb74aa167d2fb1fa00d63fb67d300273c1f8e9d99d325bc9dfe62c78895b1ee5cf0eb34a427c6e1dee7c3f487c133a621dd78452d83e8bc2feb5d27b215aca72a43244db45e03b7ade2ad7fd6ec2edae58c19fab09952d271a8d48982fc5fe68ddf990',
      subtitle: 'Leaf Mold',
    },
    {
      name: 'ไรสองจุด ',
      avatar_url:
        'https://storage.googleapis.com/kagglesdsdata/datasets/277323/658267/color/Tomato___Spider_mites%20Two-spotted_spider_mite/003b7929-a364-4e74-be1c-37c4c0a6ec63___Com.G_SpM_FL%201414.JPG?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=databundle-worker-v2%40kaggle-161607.iam.gserviceaccount.com%2F20221218%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20221218T052404Z&X-Goog-Expires=345600&X-Goog-SignedHeaders=host&X-Goog-Signature=39f677e218eff104734d37f80692815e31cf4dacd90dec21d8b33b9bf63369f34c8fb5299208447057194b33d8cacfef2423f319e5efb40a27614e7172b82f5ba54b5220ee83f63df69adc54e8bdc949a9506db2444248a96b4bacba8b305d9c58b7f03b6faabb0dc3507578c89e83aa385d7dc943f7cfb046e280f4afa69bfea6d16c5bb7283d772fd1beac63300cc0a6ac2a9bf27ef96bbfd0e9808319d9b9e65a957014145267732f11a662f92dc9a7ec7bacd61439acfc83fd2ae382808f4052840cf5e6500e7e5909e36ebdd718a2a7d6f362e1d47e25d9dc99bd3dd183a85a3e9d5c489772d69e5f4e2e163bb2ff02a793d7f88ce174ca113734d766db',
      subtitle: 'Two-spotted Spider Mite',
    },
  ];

  const [history, setHistory] = useState([]);
  useEffect(() => {
    getLog();
  }, []);

  const getLog = async () => {
    // console.log('get log');
    axios
      .get('http://139.59.120.159:8080/v1/log', {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NfdXVpZCI6IjUzYmRhZThlLWMxZTMtNDAzMC1hODVkLWNkMWZhOTNhOWJlNSIsImV4cCI6MTg1MzkyNTA4OCwidXNlcl91dWlkIjoiOGU0ZDgzMjAtOGExOS00NmZjLTgxNTEtN2E2MjI2ZDc2ZjZiIn0.YKjeADsaC5oKaD4bBEkWxTDVbZMH_34j4Vx3bKgeZhc',
        },
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
    // RNFetchBlob.fetch('POST', 'http://139.59.120.159:8080/v1/log', {
    //   Authorization:
    //     'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NfdXVpZCI6Ijg5ODZlNDBmLTJkOWQtNGUzZS1hODgyLTU3ODMyMjNlOWY5NyIsImV4cCI6MTg1NDcyMzg3NiwidXNlcl91dWlkIjoiOGU0ZDgzMjAtOGExOS00NmZjLTgxNTEtN2E2MjI2ZDc2ZjZiIn0.uveZwPwOIZPsXwjer019ghHNrg8diyXj1W4KW0nFlpk',
    // })
    //   .then(res => {
    //     let status = res.info().status;
    //     console.log(status, res.info());
    //     if (status == 200) {
    //       let json = res.json();
    //       setHistory(json);
    //     } else {
    //       // handle other status codes
    //     }
    //   })
    //   // Something went wrong:
    //   .catch((errorMessage, statusCode) => {
    //     console.log(errorMessage);

    //     // error handling
    //   });
  };

  const keyExtractor = (item, index) => index.toString();

  const renderItem = ({item}) => (
    <ListItem bottomDivider containerStyle={{backgroundColor: '#00000000'}}>
      <View
        style={{
          backgroundColor: item.subtitle == 'Healthy' ? '#047675' : '#E72970',
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
        <ListItem.Title style={font.kanit}>{item.name}</ListItem.Title>
        <ListItem.Subtitle style={font.kanit}>
          {item.subtitle}
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
        <ListItem.Subtitle style={font.kanit} right>
          {moment().format('L')}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={keyExtractor}
        data={history}
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
    backgroundColor: '#F0F9F8',
  },
});

export default History;
