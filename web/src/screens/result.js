import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  Dimensions,
  ScrollView,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
// import RNFetchBlob from 'rn-fetch-blob';
import {Button, Input, ListItem} from '@rneui/base';
import {font} from './styles';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import MapView, {Marker} from 'react-native-maps';
import moment from 'moment';
import {useSharedValue} from 'react-native-reanimated';
import {
  TabbedHeaderPager,
  DetailsHeaderScrollView,
} from 'react-native-sticky-parallax-header';

const Width = Dimensions.get('screen').width;
const Height = Dimensions.get('screen').height;

export const ResultPage = ({route, navigation}) => {
  const {photo, info} = route.params;
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [gps, setGps] = useState(true);
  const [description, setDescription] = useState('');

  const {height} = useWindowDimensions();
  const scrollValue = useSharedValue(0);

  const text = {
    biography: `The bounty hunter known as "the Mandalorian" was dispatched by "the Client" and Imperial Dr. Pershing to capture the Child alive, however the Client would allow the Mandalorian to return the Child dead for a lower price.
    The assassin droid IG-11 was also dispatched to terminate him. After working together to storm the encampment the infant was being held in, the Mandalorian and IG-11 found the Child. IG-11 then attempted to terminate the Child. The Mandalorian shot the droid before the he was able to assassinate the Child.
    Shortly after, the Mandalorian took the Child back to his ship. On the way they were attacked by a trio of Trandoshan bounty hunters, who attempted to kill the Child. After the Mandalorian defeated them, he and the Child camped out in the desert for the night. While the Mandalorian sat by the fire, the Child ate one of the creatures moving around nearby. He then approached the bounty hunter and attempted to use the Force to heal one of the Mandalorian's wounds. The Mandalorian stopped him and placed him back into his pod. The next day, the pair made it to the Razor Crest only to find it being scavenged by Jawas. The Mandalorian attacked their sandcrawler for the scavenged parts and attempted to climb it while the Child followed in his pod. However, the Mandalorian was knocked down to the ground`,
    powers:
      'Grogu was able to harness the mystical energies of the Force on account of being Force-sensitive. One notable display of his power was when he telekinetically lifted a giant mudhorn into the air for a brief time to save Djarin from the charging beast. However, performing this feat was very strenuous for Grogu as he subsequently fell unconscious for several hours afterward. He could also use the Force when he became angry, such as when he telekinetically strangled Cara Dune because he believed she was harming Djarin while they were arm-wrestling. He later revealed the ability to heal serious injuries and even cure poisoning by touching the injury and then using the Force, though the act, much like levitating the mudhorn, was incredibly draining. In another notable display of telekinesis, Grogu created a strong barrier using the Force to protect his companions by both blocking and redirecting a stream of fire from an attacking Incinerator trooper.',
    appearances: `
    Star Wars: Galaxy of Heroes
    Star Wars: Squadrons (as toy) (DLC)
    The-Mandalorian-logo.png The Mandalorian - "Chapter 1: The Mandalorian" (First appearance)
    The Mandalorian: Season 1: Volume 1
    Star Wars: The Mandalorian Junior Novel
    The Mandalorian 1
    The-Mandalorian-logo.png The Mandalorian - "Chapter 2: The Child"
    The Mandalorian 2
    The-Mandalorian-logo.png The Mandalorian - "Chapter 3: The Sin"
    The-Mandalorian-logo.png The Mandalorian - "Chapter 4: Sanctuary"
    The-Mandalorian-logo.png The Mandalorian - "Chapter 5: The Gunslinger"
    The-Mandalorian-logo.png The Mandalorian - "Chapter 6: The Prisoner"
    The-Mandalorian-logo.png The Mandalorian - "Chapter 7: The Reckoning"
    The-Mandalorian-logo.png The Mandalorian - "Chapter 8: Redemption"
    The Mandalorian: A Clan of Two
    The Mandalorian: Magnetic Fun
    The Mandalorian: This is the Way
    The-Mandalorian-logo.png The Mandalorian - "Chapter 9: The Marshal"
    Star Wars: The Mandalorian Season 2 Junior Novel
    The Mandalorian: The Path of the Force
    The-Mandalorian-logo.png The Mandalorian - "Chapter 10: The Passenger"
    The-Mandalorian-logo.png The Mandalorian - "Chapter 11: The Heiress"
    The-Mandalorian-logo.png The Mandalorian - "Chapter 12: The Siege"
    The-Mandalorian-logo.png The Mandalorian - "Chapter 13: The Jedi" (First identified as Grogu)
    The-Mandalorian-logo.png The Mandalorian - "Chapter 14: The Tragedy"
    The-Mandalorian-logo.png The Mandalorian - "Chapter 15: The Believer" (Mentioned only)
    The-Mandalorian-logo.png The Mandalorian - "Chapter 16: The Rescue"
    The Book of Boba Fett logo.png The Book of Boba Fett - "Chapter 5: Return of the Mandalorian" (Mentioned only)
    The Book of Boba Fett logo.png The Book of Boba Fett - "Chapter 6: From the Desert Comes a Stranger"
    The Book of Boba Fett logo.png The Book of Boba Fett - "Chapter 7: In the Name of Honor"
    `.trim(),
  };

  const TABS = [
    {
      title: 'Biography',
      description: text.biography,
    },
    {
      title: 'Powers and Abilities',
      description: text.powers,
    },
    {
      title: 'Appearances',
      description: text.appearances,
    },
  ];

  useEffect(() => {
    const {routes} = navigation.getState();

    const filteredRoutes = routes.filter(
      route => route.name !== 'ValidatePhoto',
    );
    getData();
    navigation.reset({
      index: filteredRoutes.length - 1,
      routes: filteredRoutes,
    });
  }, []);
  function onScroll(e) {
    'worklet';
    scrollValue.value = e.contentOffset.y;
  }

  const getData = async () => {
    const imageUri = photo.path ? 'file://' + photo.path : photo.uri;
    const fileName = photo.fileName
      ? photo.fileName
      : photo.path.split('/').pop();
    // console.log(imageUri, fileName);

    const data = new FormData();

    data.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: fileName,
    });

    fetch('http://139.59.120.159:8080/v1/prediction', {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NfdXVpZCI6IjUzYmRhZThlLWMxZTMtNDAzMC1hODVkLWNkMWZhOTNhOWJlNSIsImV4cCI6MTg1MzkyNTA4OCwidXNlcl91dWlkIjoiOGU0ZDgzMjAtOGExOS00NmZjLTgxNTEtN2E2MjI2ZDc2ZjZiIn0.YKjeADsaC5oKaD4bBEkWxTDVbZMH_34j4Vx3bKgeZhc',
      },
      body: data,
    })
      .then(response => response.json())
      .then(responseData => {
        console.log('response:', responseData);
        setResult(responseData);
      })
      .catch(error => {
        console.log('error:', error);
      });
    setLoading(false);
  };

  const saveResult = () => {
    const imageUri = photo.path ? 'file://' + photo.path : photo.uri;
    const fileName = photo.fileName
      ? photo.fileName
      : photo.path.split('/').pop();

    const data = new FormData();

    data.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: fileName,
    });

    data.append('disease', result.replaceAll('"', ''));
    data.append('description', description);

    fetch(
      'http://139.59.120.159:8080/v1/farm/e621bea6-1143-4a15-ad84-9048f80183b3/log',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NfdXVpZCI6IjUzYmRhZThlLWMxZTMtNDAzMC1hODVkLWNkMWZhOTNhOWJlNSIsImV4cCI6MTg1MzkyNTA4OCwidXNlcl91dWlkIjoiOGU0ZDgzMjAtOGExOS00NmZjLTgxNTEtN2E2MjI2ZDc2ZjZiIn0.YKjeADsaC5oKaD4bBEkWxTDVbZMH_34j4Vx3bKgeZhc',
        },
        body: data,
      },
    )
      .then(response => response.json())
      .then(responseData => {
        console.log('response:', responseData);
      })
      .catch(error => {
        console.log('error:', error);
      });
    navigation.goBack();
  };

  function check(e) {
    'worklet';
    // scrollValue.value = e.contentOffset.y;
    console.log(e);
  }

  if (loading)
    return (
      <View style={{flex: 1, paddingVertical: 120, paddingHorizontal: 20}}>
        <Text>Loading</Text>
      </View>
    );

  return (
    // <View style={{flex: 1}}>
    //   <Image
    //     style={{
    //       minHeight: Width,
    //       width: Width,
    //       // height: photo.height,
    //       maxHeight: Height,
    //     }}
    //     source={{
    //       uri: photo.path ? 'file://' + photo.path : photo.uri,
    //     }}
    //   />

    //   <ScrollView
    //     style={{
    //       borderRadius: 20,
    //       transform: [{translateY: -20}],
    //       backgroundColor: '#fff',
    //       padding: 20,
    //       marginBottom: -20,
    //     }}>
    //     <View
    //       style={{
    //         flexDirection: 'column',
    //         alignSelf: 'center',
    //         alignItems: 'center',
    //       }}>
    //       <Text style={[font.kanit, {fontSize: 24}]}>{result}</Text>

    //       <Text style={[font.kanit, {fontSize: 12}]}>
    //         ความแม่นยำ 97.2 % {description}
    //       </Text>
    //     </View>
    //     <Input
    //       placeholder="เพิ่มคำอธิบาย"
    //       onChangeText={newText => setDescription(newText)}
    //       defaultValue={description}
    //       inputStyle={[font.kanit]}
    //       style={{alignSelf: 'center', textAlign: 'center'}}
    //     />
    //     <ListItem.Accordion
    //       bottomDivider
    //       content={
    //         <>
    //           <Entypo name="location-pin" size={20} />
    //           <ListItem.Content>
    //             <ListItem.Title style={font.kanit}>ตำแหน่ง</ListItem.Title>
    //           </ListItem.Content>
    //         </>
    //       }
    //       onPress={() => setGps(!gps)}
    //       isExpanded={gps}>
    //       <ListItem>
    //         <View style={styles.container}>
    //           <MapView
    //             style={{
    //               height: 300,
    //               width: '100%',
    //               borderRadius: 30,
    //               overflow: 'hidden',
    //             }}
    //             // moveOnMarkerPress={false}
    //             // pitchEnabled={false}
    //             // scrollEnabled={false}
    //             // zoomEnabled={false}
    //             initialRegion={{
    //               latitude: info.coords.latitude,
    //               longitude: info.coords.longitude,
    //               latitudeDelta: 0.003,
    //               longitudeDelta: 0.003,
    //             }}>
    //             <Marker
    //               coordinate={{
    //                 latitude: info.coords.latitude,
    //                 longitude: info.coords.longitude,
    //               }}
    //             />
    //           </MapView>
    //         </View>
    //       </ListItem>
    //     </ListItem.Accordion>
    //     <Button
    //       size="lg"
    //       onPress={saveResult}
    //       style={{marginBottom: 100, marginTop: 30}}
    //       buttonStyle={{borderRadius: 10, backgroundColor: '#047675'}}>
    //       <Text style={[font.kanit, {fontSize: 20, color: '#fff'}]}>ตกลง</Text>
    //     </Button>
    //   </ScrollView>
    <View style={{flex: 1}}>
      {/* <Image
        style={{
          minHeight: Width,
          width: Width,
          // height: photo.height,
          maxHeight: Height,
        }}
        source={{
          uri: photo.path ? 'file://' + photo.path : photo.uri,
        }}
      /> */}
      <TabbedHeaderPager
        containerStyle={styles.stretchContainer}
        backgroundImage={{
          uri: photo.path ? 'file://' + photo.path : photo.uri,
        }}
        title={
          <View style={{flexDirection: 'column', paddingHorizontal: 10}}>
            <Text style={[font.kanit, {color: '#fff', fontSize: 40}]}>
              {result}
            </Text>
            <Text
              style={[font.kanit, {color: '#fff', fontSize: 13, margin: 0}]}>
              {' '}
              ความแม่นยำ 97.2 %
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
        onScroll={onScroll}
        renderHeaderBar={() => (
          <View
            style={{
              height: 90,
              width: '100%',
            }}></View>
        )}
        tabs={TABS}
        showsVerticalScrollIndicator={false}>
        {TABS.map((tab, i) => (
          <View key={i} style={[styles.contentContainer, {height}]}>
            <Text style={[font.kanit, styles.contentText]}>
              {tab.description}
            </Text>
          </View>
        ))}
      </TabbedHeaderPager>
    </View>
    //</View>
  );
};
const styles = StyleSheet.create({
  titleStyle: {
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    color: '#fff',

    // width: '100%',
  },
  tabTextContainerStyle: {
    borderRadius: 18,
  },
  tabTextContainerActiveStyle: {
    backgroundColor: '#047675',

    // color: '#fff',
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
  tabWrapperStyle: {
    paddingVertical: 5,
  },
  tabsContainerStyle: {
    backgroundColor: '#F2f2f2',
  },
  contentContainer: {
    paddingHorizontal: 10,
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

  // darkBackground: {
  //   backgroundColor: colors.black,
  // },
  // lightBackground: {
  //   backgroundColor: colors.white,
  // },

  stretchContainer: {
    alignSelf: 'stretch',
    flex: 1,
    // marginTop: -47,
    // paddingTop: 10,
  },
});
