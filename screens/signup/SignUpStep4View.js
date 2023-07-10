import { Platform, StyleSheet, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Container from '../../components/layouts/Container';
import COLORS from './../../commons/colors';
import CustomButton from './../../components/elements/CustomButton';
import serviceApis from './../../utils/ServiceApis';
import { asyncStorage } from '../../storage/Storage';
import { useStores } from '../../contexts/StoreContext';
import CustomText from '../../components/elements/CustomText';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { FONT_WEIGHT } from '../../commons/constants';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import GoogleMap from '../../components/map/GoogleMap';
import { Marker } from 'react-native-maps';
import Constants from 'expo-constants';

navigator.geolocation = require('@react-native-community/geolocation');

const SignupStep4View = (props) => {
  const { route } = props;
  const { userStore } = useStores();
  const mapRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [searchCoord, setSearchCoord] = useState(null);

  useEffect(() => {
    if (!isMapReady) return;
  }, [isMapReady]);

  const submitSignupData = async () => {
    try {
      const response = await serviceApis.join({
        ...route.params,
      });
      if (response?.rsp_code === '1002') {
        Toast.show({
          type: 'success',
          text1: response.rsp_msg_detail,
        });
        asyncStorage.setItem('access_token', response.result.accessToken);
        asyncStorage.setItem(
          'access_token_expire_at',
          response.result.accessTokenExpireAt
        );
        asyncStorage.setItem('refresh_token', response.result.refreshToken);
        asyncStorage.setItem(
          'refresh_token_expire_at',
          response.result.refreshTokenExpireAt
        );
        userStore.initUserInfo();
      }
    } catch (error) {
      console.log(error);
      //Navigator.reset('welcome', {});
    }
  };

  const onMapReady = () => {
    setIsMapReady(true);
  };

  return (
    <>
      <Container header={true}>
        <View style={styles.section1}>
          <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={24}>
            거주지를 입력해주세요.
          </CustomText>
        </View>
        <View style={styles.section2}>
          <View style={styles.placeWrap}>
            <GooglePlacesAutocomplete
              placeholder="Search"
              styles={styles.placeWrap}
              textInputProps={{
                style: {
                  flex: 1,
                  padding: 15,
                  borderWidth: 1,
                  borderColor: COLORS.gray,
                  borderRadius: 5,
                  borderStyle: 'solid',
                },
              }}
              query={{
                key:Constants.expoConfig?.extra?.googleWewApiKey,
                language: 'en', // language of the results
              }}
              currentLocation={true}
              currentLocationLabel="Current location"
              onPress={(data, details = null) => console.log(data, details)}
              onFail={(error) => console.error(error)}
              timeout={5000}
              onTimeout={() => {
                Toast.show({
                  type: 'error',
                  text1: '네트워크 상태를 확인해주세요.',
                });
              }}
            />
          </View>
          <View style={styles.mapWrap}>
            <GoogleMap
              mapRef={mapRef}
              style={{
                flex: 1,
                marginVertical: 20,
              }}
              onMapReady={onMapReady}
              userLocation={false}
            >
              {searchCoord && <Marker coordinate={searchCoord} />}
            </GoogleMap>
          </View>
        </View>
      </Container>
      <CustomButton
        fontColor={COLORS.white}
        bgColor={COLORS.dark}
        bgColorPress={COLORS.darkDeep}
        text="가입 완료"
        onPress={submitSignupData}
        style={styles.submitTheme}
        height={50}
      />
    </>
  );
};

export default SignupStep4View;

const styles = StyleSheet.create({
  section1: {
    flex: 1,
  },
  section2: {
    flex: 7,
  },
  placeWrap: {
    position: 'absolute',
    width: '100%',
    height: 300,
    zIndex: 10,
    elevation: 10,
  },
  mapWrap: {
    marginTop: 60,
    flex: 1,
    zIndex: 1,
    elevation: 1,
  },

  submitTheme: { borderRadius: 0 },
});
