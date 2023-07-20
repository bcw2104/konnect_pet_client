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
import { asyncStorage } from '../../storage/Storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Marker } from 'react-native-maps';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

const window = Dimensions.get('window');
const ASPECT_RATIO = window.width / window.height;

const LATITUDE_DELTA = 0.003;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const WalkingHomeView = () => {
  const mapRef = useRef(null);

  const [permission, setPermission] = useState(false);
  const [region, setRegion] = useState(null);
  const { modalStore, systemStore, userStore } = useStores();
  const [footprints, setFootprints] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const walkingTempDate = JSON.parse(
          await asyncStorage.getItem('walking_temp_data')
        );

        if (walkingTempDate) {
          //제출
          const params = {
            walkingKey: walkingTempDate.key,
            walkingRewardPolicies: walkingTempDate.rewardPolicies,
            currentCoords: walkingTempDate.currentCoords,
            walkingTime: walkingTempDate.seconds,
            walkingMeters: walkingTempDate.meters,
            walkingSavedCoords: walkingTempDate.savedCoords,
            walkingFootprintCoords: walkingTempDate.footprintCoords,
          };
        }
      } catch (e) {
        await asyncStorage.removeItem('walking_temp_data');
      }

      const status = await hasLocationPermissions();
      let currentCoords = {};
      if (status) {
        let { coords } = await Location.getCurrentPositionAsync({});
        changeMyLocation(coords);
        setRegion(coords);
        currentCoords = coords;
      } else {
        const residenceCoords = userStore.residenceCoords;
        setRegion('residence');
        currentCoords = {
          latitude: residenceCoords?.lat,
          longitude: residenceCoords?.lng,
        };
      }

      await getAroundFootprints(currentCoords);
    };
    fetchData();
  }, []);

  const goToNextStep = (params) => {
    Navigator.reset('walking', params);
  };

  const getAroundFootprints = async (coords) => {
    try {
      const response = await serviceApis.getAroundFootprints(
        coords.latitude,
        coords.longitude
      );
      setFootprints(response.result);

      Toast.show({
        type: 'success',
        text1: 'ele: ' + response.result.length,
      });
    } catch (e) {}
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
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status === 'granted') {
      setPermission(true);
      return true;
    }
    setPermission(false);
    return false;
  };

  const requestLocationPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      setPermission(true);
      return true;
    }
    setPermission(false);
    modalStore.openTwoButtonModal(
      '정상적인 산책 기록을 위해 위치 권한을 허용해주세요.',
      '취소',
      () => {},
      '승인하러 가기',
      () => {
        Linking.openSettings();
      }
    );
    return false;
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

    systemStore.setIsLoading(true);
    try {
      const response = await serviceApis.startWalking();

      let { coords } = await Location.getCurrentPositionAsync({});

      changeMyLocation(coords);

      const currentCoords = {
        latitude: coords.latitude,
        longitude: coords.longitude,
      };

      goToNextStep({
        walkingId: response.result.id,
        walkingKey: response.result.key,
        walkingPolicies: response.result.walkingPolicies,
        walkingRewardPolicies: response.result.rewardPolicies,
        currentCoords: currentCoords,
      });
    } catch (e) {
      console.log(e);
    } finally {
      systemStore.setIsLoading(false);
    }
  };

  return (
    <Container>
      <View style={styles.section1}>
        <GoogleMap
          userLocation={permission}
          defaultRegion={region}
          mapRef={mapRef}
          width={window.width}
          height={window.height}
          longitudeDelta={LONGITUDE_DELTA}
          latitudeDelta={LATITUDE_DELTA}
        >
          {footprints.map((ele) => (
            <Marker
              key={ele.id}
              coordinate={{
                latitude: ele.latitude,
                longitude: ele.longitude,
              }}
              onPress={() => {
                Toast.show({
                  type: 'success',
                  text1: 'id: ' + ele.id,
                });
              }}
            >
              <MaterialCommunityIcons name="dog" size={24} color="black" />
            </Marker>
          ))}
        </GoogleMap>
      </View>
      <View style={styles.section2}>
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
    width: window.width,
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
