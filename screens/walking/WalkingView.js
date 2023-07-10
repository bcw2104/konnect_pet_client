import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useStores } from '../../contexts/StoreContext';
import Container from '../../components/layouts/Container';
import GoogleMap from '../../components/map/GoogleMap';
import CustomButton from '../../components/elements/CustomButton';
import COLORS from '../../commons/colors';
import { MaterialIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import CustomText from '../../components/elements/CustomText';
import Timer from '../../components/elements/Timer';
import { FONT_WEIGHT } from '../../commons/constants';
import { Navigator } from '../../navigations/Navigator';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;

const LATITUDE_DELTA = 0.003;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const WalkingView = () => {
  const mapRef = useRef(null);

  const [isMapReady, setIsMapReady] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [meters, setMeters] = useState(-10);
  const { systemStore, modalStore } = useStores();

  useEffect(() => {
    if (!isMapReady) false;
    let watchPosition = null;

    const fetchData = async () => {
      const status = await hasLocationPermissions();

      if (status) {
        watchPosition = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 10 },
          async ({ coords }) => {
            setMeters((meters) => meters + 10);
            changeMyLocation(coords);
          }
        );
      } else {
        modalStore.openTwoButtonModal(
          '정상적인 산책 기록을 위해 위치 권한을 승인해주세요.',
          '취소',
          () => {
            goToHome();
          },
          '승인하러 가기',
          () => {
            Linking.openSettings();
            goToHome();
          }
        );
      }
    };

    fetchData();

    return () => {
      if (!!watchPosition) {
        console.log('watching position removed');
        watchPosition.remove();
      }
    };
  }, [isMapReady]);

  useInterval(() => {
    setSeconds((seconds) => seconds + 1);
  }, 1000);

  const goToHome = (params) => {
    Navigator.reset('walking_home', params);
  };

  const goToNextStep = (params) => {
    Navigator.reset('walking_home', params);
  };

  const changeMyLocation = (coords) => {
    mapRef?.current?.animateToRegion({
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  };

  const hasLocationPermissions = async () => {
    const { status: existingStatus } =
      await Location.getForegroundPermissionsAsync();

    return existingStatus == 'granted';
  };
  const requestLocationPermissions = async () => {
    const existingStatus = await hasLocationPermissions();
    if (!existingStatus) {
      const { status: finalStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (finalStatus !== 'granted') {
        modalStore.openTwoButtonModal(
          '정상적인 산책 기록을 위해 위치 권한을 승인해주세요.',
          '취소',
          () => {},
          '승인하러 가기',
          () => {
            Linking.openSettings();
          }
        );
        return false;
      }
    }

    return true;
  };

  const getMyLocation = async () => {
    const status = await requestLocationPermissions();

    if (!status) return;

    let { coords } = await Location.getCurrentPositionAsync({});
    changeMyLocation(coords);
  };
  const stopWalking = async () => {
    goToNextStep();
  };

  const onRegionChange = ({ latitude, longitude }) => {};

  const onMapReady = () => {
    setIsMapReady(true);
  };

  return (
    <Container>
      <View style={styles.section1}>
        <GoogleMap
          mapRef={mapRef}
          onRegionChange={onRegionChange}
          onMapReady={onMapReady}
          width={screen.width}
          height={screen.height}
          longitudeDelta={LONGITUDE_DELTA}
          latitudeDelta={LATITUDE_DELTA}
        />
      </View>
      <View style={styles.section2} width={systemStore.winWidth}>
        <CustomButton
          bgColor={COLORS.white}
          bgColorPress={COLORS.lightDeep}
          text={<MaterialIcons name="my-location" size={30} color="black" />}
          fontColor={COLORS.white}
          onPress={getMyLocation}
          width={60}
          height={60}
          wrapperStyle={styles.location}
          style={{
            borderRadius: 30,
          }}
        />
        <View style={styles.dashboard}>
          <View style={{ alignItems: 'center' }}>
            <Timer remain={seconds} fontWeight={FONT_WEIGHT.BOLD} />
            <CustomText
              fontSize={15}
              fontColor={COLORS.grayDeep}
              style={{ marginTop: 5 }}
            >
              시간
            </CustomText>
          </View>
          <CustomButton
            bgColor={COLORS.warning}
            bgColorPress={COLORS.warningDeep}
            text={<MaterialIcons name="pause" size={30} color="black" />}
            fontColor={COLORS.white}
            onPress={stopWalking}
            width={60}
            height={60}
            style={{
              borderRadius: 30,
            }}
          />
          <View style={{ alignItems: 'center' }}>
            <CustomText fontWeight={FONT_WEIGHT.BOLD}>{meters} M</CustomText>
            <CustomText
              fontSize={15}
              fontColor={COLORS.grayDeep}
              style={{ marginTop: 5 }}
            >
              거리
            </CustomText>
          </View>
        </View>
      </View>
    </Container>
  );
};

export default WalkingView;

const styles = StyleSheet.create({
  section1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section2: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    bottom: 0,
  },
  location: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  dashboard: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});
