import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Container from '../../components/layouts/Container';
import { COLORS } from './../../commons/colors';
import CustomButton from './../../components/elements/CustomButton';
import { serviceApis } from './../../utils/ServiceApis';
import { asyncStorage } from '../../storage/Storage';
import { useStores } from '../../contexts/StoreContext';
import CustomText from '../../components/elements/CustomText';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { FONT_WEIGHT } from '../../commons/constants';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import GoogleMap from '../../components/map/GoogleMap';
import { Marker } from 'react-native-maps';
import Constants from 'expo-constants';
import Geocoder from 'react-native-geocoding';

const window = Dimensions.get('window');
const ASPECT_RATIO = window.width / window.height;

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const SignupStep4View = (props) => {
  const { route } = props;
  const { userStore, systemStore } = useStores();
  const mapRef = useRef(null);
  const [searchValue, setSearchValue] = useState(null);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    Geocoder.init(Constants.expoConfig?.extra?.googleWebApiKey);
    const residenceCoords = userStore.residenceCoords;
    currentCoords = {
      latitude: residenceCoords?.lat,
      longitude: residenceCoords?.lng,
    };
    setRegion(currentCoords);
  }, []);

  const submitSignupData = async () => {
    if (!searchValue) return;
    systemStore.setIsLoading(true);
    try {
      const response = await serviceApis.join({
        ...route.params,
        city: searchValue.city,
        address: searchValue.address,
        coords: JSON.stringify({
          lat: searchValue?.coords?.latitude,
          lng: searchValue?.coords?.longitude,
        }),
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
    } finally {
      systemStore.setIsLoading(false);
    }
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
                key: Constants.expoConfig?.extra?.googleWebApiKey,
                language: 'en', // language of the results
                types: 'geocode', // types of the results
              }}
              onPress={(data, details = null) => {
                Geocoder.from(data.description)
                  .then((json) => {
                    var location = json.results[0].geometry.location;
                    setSearchValue({
                      coords: {
                        latitude: location.lat,
                        longitude: location.lng,
                      },
                      address: data.description,
                      city: data.structured_formatting?.secondary_text,
                    });
                    mapRef?.current?.animateToRegion({
                      latitude: location.lat,
                      longitude: location.lng,
                      latitudeDelta: LATITUDE_DELTA * 0.5,
                      longitudeDelta: LONGITUDE_DELTA * 0.5,
                    });
                  })
                  .catch((error) => {
                    Toast.show({
                      type: 'error',
                      text1: '네트워크 상태를 확인해주세요.',
                    });
                  });
              }}
              onFail={(error) => {
                Toast.show({
                  type: 'error',
                  text1: '네트워크 상태를 확인해주세요.',
                });
              }}
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
              defaultRegion={region}
              style={{
                flex: 1,
                marginVertical: 20,
              }}
              userLocation={false}
              longitudeDelta={LONGITUDE_DELTA}
              latitudeDelta={LATITUDE_DELTA}
            >
              {searchValue && <Marker coordinate={searchValue?.coords} />}
            </GoogleMap>
          </View>
        </View>
      </Container>
      <CustomButton
        fontWeight={FONT_WEIGHT.BOLD}
        fontColor={COLORS.white}
        bgColor={COLORS.main}
        bgColorPress={COLORS.mainDeep}
        text="Start Walking"
        disabled={!searchValue}
        onPress={submitSignupData}
        style={styles.submitTheme}
        height={60}
      />
    </>
  );
};

export default SignupStep4View;

const styles = StyleSheet.create({
  section1: {
    marginBottom: 50,
  },
  section2: {
    flex: 1,
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
