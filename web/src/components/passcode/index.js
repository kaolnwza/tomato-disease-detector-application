/*

Concept: https://dribbble.com/shots/5476562-Forgot-Password-Verification/attachments

*/
import {Animated, Image, SafeAreaView, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import DeviceInfo from 'react-native-device-info';

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {Button} from '@rneui/themed';
import styles, {
  ACTIVE_CELL_BG_COLOR,
  CELL_BORDER_RADIUS,
  CELL_SIZE,
  DEFAULT_CELL_BG_COLOR,
  NOT_EMPTY_CELL_BG_COLOR,
} from './styles';
import {font} from '../../screens/styles';

const {Value, Text: AnimatedText} = Animated;

const CELL_COUNT = 6;
const source = {
  uri: 'https://user-images.githubusercontent.com/4661784/56352614-4631a680-61d8-11e9-880d-86ecb053413d.png',
};

const animationsColor = [...new Array(CELL_COUNT)].map(() => new Value(0));
const animationsScale = [...new Array(CELL_COUNT)].map(() => new Value(1));
const animateCell = ({hasValue, index, isFocused}) => {
  Animated.parallel([
    Animated.timing(animationsColor[index], {
      useNativeDriver: false,
      toValue: isFocused ? 1 : 0,
      duration: 250,
    }),
    Animated.spring(animationsScale[index], {
      useNativeDriver: false,
      toValue: hasValue ? 0 : 1,
      duration: hasValue ? 300 : 250,
    }),
  ]).start();
};

const FarmPasscode = ({onVerify}) => {
  const [value, setValue] = useState('');
  const [verify, setVerify] = useState(false);

  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
    DeviceInfo.getUniqueId().then(uniqueId => {
      console.log(uniqueId);
    });
  }, []);

  const renderCell = ({index, symbol, isFocused}) => {
    const hasValue = Boolean(symbol);
    const animatedCellStyle = {
      backgroundColor: hasValue
        ? animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [NOT_EMPTY_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          })
        : animationsColor[index].interpolate({
            inputRange: [0, 1],
            outputRange: [DEFAULT_CELL_BG_COLOR, ACTIVE_CELL_BG_COLOR],
          }),
      borderRadius: animationsScale[index].interpolate({
        inputRange: [0, 1],
        outputRange: [CELL_SIZE, CELL_BORDER_RADIUS],
      }),
      transform: [
        {
          scale: animationsScale[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0.2, 1],
          }),
        },
      ],
    };

    // Run animation on next event loop tik
    // Because we need first return new style prop and then animate this value
    setTimeout(() => {
      animateCell({hasValue, index, isFocused});
    }, 0);

    return (
      <AnimatedText
        key={index}
        style={[styles.cell, animatedCellStyle]}
        onLayout={getCellOnLayoutHandler(index)}>
        {symbol || (isFocused ? <Cursor /> : null)}
      </AnimatedText>
    );
  };

  const onInput = e => {
    setValue(e);
    if (value.length >= CELL_COUNT - 1) {
      setVerify(true);
      setTimeout(() => {
        onVerify(e);
      }, 1000);
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <Text style={[styles.title, font.kanit]}>รหัสพนักงาน</Text>
      <Image style={styles.icon} source={source} />

      <Text style={[styles.subTitle, font.kanit]}>
        รหัสประจำตัวของพนักงาน {value}
      </Text>

      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={onInput}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFiledRoot}
        textContentType="oneTimeCode"
        renderCell={renderCell}
      />
      <View style={{alignSelf: 'center'}}>
        <Button
          onPress={() => {}}
          title="เชิญ"
          icon={
            <MaterialCommunityIcons
              name="lock-check-outline"
              size={25}
              color="#fff"
            />
          }
          disabled
          loading={verify}
          iconRight
          iconContainerStyle={{marginLeft: 10}}
          titleStyle={[font.kanit, {fontWeight: '700', marginRight: 5}]}
          buttonStyle={{
            backgroundColor: '#3ED48D',
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 30,
          }}
          containerStyle={{
            width: 200,

            marginVertical: 20,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default FarmPasscode;
