import { Dimensions, StyleSheet, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useStores } from '../../contexts/StoreContext';
import Container from '../../components/layouts/Container';
import GoogleMap from '../../components/map/GoogleMap';
import CustomButton from '../../components/elements/CustomButton';
import COLORS from '../../commons/colors';
import { MaterialIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import serviceApis from '../../utils/ServiceApis';
import { Navigator } from '../../navigations/Navigator';

const screen = Dimensions.get('window');
const ASPECT_RATIO = screen.width / screen.height;

const LATITUDE_DELTA = 0.003;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const WalkingHomeView = () => {
  const mapRef = useRef(null);

  const [isMapReady, setIsMapReady] = useState(false);
  const { systemStore, modalStore } = useStores();

  useEffect(() => {
    if (!isMapReady) false;
    const fetchData = async () => {
      const status = await hasLocationPermissions();

      if (status) {
        let { coords } = await Location.getCurrentPositionAsync({});
        changeMyLocation(coords);
      } else {
        //TODO: 기본 위치 설정
      }
    };
    fetchData();
  }, [isMapReady]);

  const goToNextStep = (params) => {
    Navigator.reset('walking', params);
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

  const startWalking = async () => {
    const status = await requestLocationPermissions();

    if (!status) return;

    try {
      const response = await serviceApis.startWalking();
      goToNextStep({ walkingKey: response.result.key });
    } catch (e) {
      console.log(e);
    }
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
        <CustomButton
          bgColor={COLORS.dark}
          bgColorPress={COLORS.darkDeep}
          text="산책 시작"
          fontColor={COLORS.white}
          onPress={startWalking}
          height={50}
          wrapperStyle={styles.start}
        />
      </View>
    </Container>
  );
};

export default WalkingHomeView;

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
    bottom: 0,
    padding: 20,
  },
  location: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  start: {},
});
