import { Dimensions, Modal, StyleSheet, View } from 'react-native';
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
import { Ionicons } from '@expo/vector-icons';
import CustomText from '../../components/elements/CustomText';
import CustomModal from '../../components/elements/CustomModal';
import CustomSwitch from '../../components/elements/CustomSwitch';

const window = Dimensions.get('window');
const ASPECT_RATIO = window.width / window.height;

const LATITUDE_DELTA = 0.003;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const WalkingHomeView = () => {
  const mapRef = useRef(null);
  const settingModalRef = useRef(null);
  const aroundStandardCoords = useRef(null);

  const [permission, setPermission] = useState(false);
  const [region, setRegion] = useState(null);
  const { modalStore, systemStore, userStore } = useStores();
  const [footprints, setFootprints] = useState([]);
  const [footprintsToggle, setFootprintsToggle] = useState(true);

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
        currentCoords = coords;
      } else {
        const residenceCoords = userStore.residenceCoords;
        currentCoords = {
          latitude: residenceCoords?.lat,
          longitude: residenceCoords?.lng,
        };
      }
      setRegion(currentCoords);
      await getAroundFootprints(currentCoords);
    };
    fetchData();
  }, []);

  const goToNextStep = (params) => {
    Navigator.reset('walking', params);
  };

  const handleOpenSetting = () => {
    settingModalRef.current.openModal(true);
  };

  const getAroundFootprints = async (coords) => {
    //이후 주변 발자국 갱신시 비교할 위치 기록
    aroundStandardCoords.current = coords;

    try {
      const response = await serviceApis.getAroundFootprints(
        coords.latitude,
        coords.longitude
      );

      const catchedFootprints = response.result?.catchedFootprints;
      const footprints = {};

      response.result?.radiusFootprints?.forEach((ele) => {
        footprints[ele.id] = {
          ...ele,
          catched: catchedFootprints.includes(ele.id),
        };
      });
      setFootprints(footprints);
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
    systemStore.setIsLoading(true);

    try {
      const status = await requestLocationPermissions();

      if (!status) return;

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
        <CustomButton
          bgColor={COLORS.white}
          bgColorPress={COLORS.lightDeep}
          text={<Ionicons name="options" size={30} color="black" />}
          fontColor={COLORS.white}
          onPress={handleOpenSetting}
          width={60}
          height={60}
          wrapperStyle={styles.mapSetting}
          style={{
            borderRadius: 30,
          }}
        />
        <GoogleMap
          userLocation={permission}
          defaultRegion={region}
          mapRef={mapRef}
          width={window.width}
          height={window.height}
          longitudeDelta={LONGITUDE_DELTA}
          latitudeDelta={LATITUDE_DELTA}
        >
          {footprintsToggle && (
            <>
              {Object.values(footprints)
                .filter((e) => !e.catched)
                .map((ele, idx) => (
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
                    <MaterialCommunityIcons
                      name="dog"
                      size={24}
                      color="black"
                    />
                  </Marker>
                ))}
              {Object.values(footprints)
                .filter((e) => e.catched)
                .map((ele, idx) => (
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
                    <MaterialCommunityIcons name="dog" size={24} color="red" />
                  </Marker>
                ))}
            </>
          )}
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
      <CustomModal
        ref={settingModalRef}
        closeText={'닫기'}
        title={'Map Setting'}
      >
        <View style={styles.settingItemWrap}>
          <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons name="dog" size={27} color="black" />
            <CustomText style={{ marginLeft: 7 }}>발자국</CustomText>
          </View>
          <CustomSwitch
            onValueChange={() => setFootprintsToggle(!footprintsToggle)}
            value={footprintsToggle}
          />
        </View>
      </CustomModal>
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
  mapSetting: {
    alignSelf: 'flex-end',
    top: 80,
    zIndex: 10,
    elevation: 10,
  },
  settingItemWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
