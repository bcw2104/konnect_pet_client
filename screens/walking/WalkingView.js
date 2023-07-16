import { AppState, Dimensions, StyleSheet, Text, View } from 'react-native';
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
import { FONT_WEIGHT, WALKING_REWARD_TYPE } from '../../commons/constants';
import { Navigator } from '../../navigations/Navigator';
import * as TaskManager from 'expo-task-manager';
import { observer } from 'mobx-react-lite';
import { asyncStorage } from '../../storage/Storage';

const window = Dimensions.get('window');
const screen = Dimensions.get('screen');
const ASPECT_RATIO = window.width / window.height;

const SPLASH_TIME = 3;
const LATITUDE_DELTA = 0.003;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const LOCATION_FETCH_TASK = 'background-location-fetch';

let policies = {};
let walkingMeters = 0;
let walkingTime = new Date();
let walkingCurrentCoords = {};
let walkingPrevCurrentCoords = {};
let walkingFootprintCoords = [];
let walkingSavedCoords = [];

TaskManager.defineTask(LOCATION_FETCH_TASK, async ({ data, error }) => {
  console.log('GPS', 'defineTask called');
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    console.log(policies);
    // Extract location coordinates from data
    const { locations } = data;
    const location = locations[0];
    walkingMeters += 10;
    if (location) {
      const coords = location.coords;
      walkingCurrentCoords = {
        latitude: coords.latitude,
        longitude: coords.longitude,
      };

      if (walkingMeters > 0) {
        if (
          walkingMeters % parseInt(policies['walking_footprint_unit']) == 0 &&
          walkingFootprintCoords.length < parseInt(policies['walking_footprint_max_amount'])
        ) {
          walkingFootprintCoords.push([coords.latitude, coords.longitude]);
        }
      }

      if (walkingMeters % 30 == 0) {
        walkingSavedCoords.push([coords.latitude, coords.longitude]);
      }
    }
  } else {
    console.log('data not found', data);
  }
});

async function stopLocationUpdatesAsync() {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(
    LOCATION_FETCH_TASK
  );
  if (isRegistered) {
    await Location.stopLocationUpdatesAsync(LOCATION_FETCH_TASK);
  }
}

const WalkingView = (props) => {
  const mapRef = useRef(null);
  const { route } = props;
  const appState = useRef(AppState.currentState);
  const rewards = useRef({});

  const [seconds, setSeconds] = useState(0);
  const [meters, setMeters] = useState(0);
  const [startCounter, setStartCounter] = useState(SPLASH_TIME);
  const [region, setRegion] = useState(null);
  const { systemStore, modalStore } = useStores();

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          const now = new Date();
          const diffTime = Math.ceil(Math.abs(now - walkingTime) / 1000);
          setSeconds((seconds) => seconds + diffTime);
        } else {
          walkingTime = new Date();
        }

        appState.current = nextAppState;
        console.log('AppState', appState.current);
      }
    );

    const fetchData = async () => {
      systemStore.setDisplayTabBar(false);
      setRegion(route.params?.currentCoords);
      const rewardPolices = route.params?.walkingRewardPolicies;
      const walkingPolicies = route.params?.walkingPolicies;
      walkingTime = new Date();
      walkingMeters = -10;

      //정책 정보 초기화
      walkingPolicies.map((ele) => {
        policies[ele.pKey] = ele.pValue;
      });

      //리워드 정보 초기화
      rewardPolices.map((ele) => {
        rewards.current[ele.id] = {
          ...ele,
          rewardAmount: 0,
        };
      });

      const status = await hasLocationPermissions();

      if (status) {
        await Location.startLocationUpdatesAsync(LOCATION_FETCH_TASK, {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: 'Location',
            notificationBody: 'Location tracking in background',
            notificationColor: '#fff',
          },
        });
      }
    };
    fetchData();

    return async () => {
      subscription.remove();

      await stopLocationUpdatesAsync();

      console.log('all tasks unregistered');
    };
  }, []);

  useInterval(() => {
    if (startCounter > 0) {
      if (startCounter == 1) {
        systemStore.setDisplayTabBar(true);
      }
      setStartCounter((startCounter) => startCounter - 1);
    }

    if (startCounter == 0) {
      const newSeconds = seconds + 1;
      setSeconds(newSeconds);

      if (
        walkingPrevCurrentCoords.latitude != walkingCurrentCoords.latitude ||
        walkingPrevCurrentCoords.longitude != walkingCurrentCoords.longitude
      ) {
        console.log('AA');
        changeMyLocation(walkingCurrentCoords);
      }
      if (meters != walkingMeters) {
        setMeters(walkingMeters);
      }

      //5초에 한번씩 산책 데이터 저장
      if (newSeconds > 0 && newSeconds % 5 == 0) {
        const params = {
          key: route.params?.walkingKey,
          meters: walkingMeters,
          seconds: newSeconds,
          rewardPolicies: route.params?.walkingRewardPolicies,
          currentCoords: walkingCurrentCoords,
          footprintCoords: walkingFootprintCoords,
          savedCoords: walkingSavedCoords,
        };
        asyncStorage.setItem('walking_temp_data', JSON.stringify(params));
      }
    }
  }, 1000);

  const calculateReward = (rewards) => {
    Object.keys(rewards).map((key) => {
      const ele = rewards[key];
      if (ele.rewardType == WALKING_REWARD_TYPE.DISTANCE) {
        const count = Math.trunc(meters / ele.provideUnit);
        ele.rewardAmount = Math.min(
          count * ele.pointPerUnit,
          ele.maxRewardAmountPerWalking
        );
      } else if (ele.rewardType == WALKING_REWARD_TYPE.TIME) {
        const count = Math.trunc(seconds / ele.provideUnit);
        ele.rewardAmount = Math.min(
          count * ele.pointPerUnit,
          ele.maxRewardAmountPerWalking
        );
      }
    });
  };

  const goToHome = (params) => {
    Navigator.reset('walking_home', params);
  };

  const goToNextStep = (params) => {
    Navigator.reset('walking_result', params);
  };

  const changeMyLocation = (coords) => {
    walkingPrevCurrentCoords = {
      latitude: coords.latitude,
      longitude: coords.longitude,
    };
    mapRef?.current?.animateToRegion({
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  };

  const hasLocationPermissions = async () => {
    const { status: foregroundStatus } =
      await Location.getForegroundPermissionsAsync();
    if (foregroundStatus === 'granted') {
      const { status: backgroundStatus } =
        await Location.getBackgroundPermissionsAsync();
      if (backgroundStatus === 'granted') {
        return true;
      }
    }
    modalStore.openTwoButtonModal(
      '정상적인 산책 기록을 위해 위치 권한을 항상 사용으로 승인해주세요.',
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
    return false;
  };

  const getMyLocation = async () => {
    const status = await hasLocationPermissions();

    if (!status) return;

    let { coords } = await Location.getCurrentPositionAsync({});

    walkingCurrentCoords = {
      latitude: coords.latitude,
      longitude: coords.longitude,
    };

    changeMyLocation(coords);
  };

  const saveWalking = async () => {
    const params = {
      id: route.params?.walkingId,
      key: route.params?.walkingKey,
      meters: meters,
      seconds: seconds,
      reward: JSON.stringify(rewards.current),
      footprintCoords: JSON.stringify(walkingFootprintCoords),
      savedCoords: JSON.stringify(walkingSavedCoords),
    };
  };

  const stopWalking = async () => {
    modalStore.openTwoButtonModal(
      '산책을 종료하시겠어요?',
      '아니요',
      () => {},
      '네',
      async () => {
        calculateReward(rewards.current);
        await saveWalking();

        await asyncStorage.removeItem('walking_temp_data');

        goToNextStep({ walkingId: route.params?.walkingId });
      }
    );
  };

  return (
    <>
      {startCounter > 0 && (
        <View style={styles.startSplash}>
          <CustomText
            fontColor={COLORS.white}
            fontSize={60}
            fontWeight={FONT_WEIGHT.BOLD}
          >
            {startCounter}
          </CustomText>
          <CustomText
            style={{ marginTop: 10 }}
            fontColor={COLORS.white}
            fontSize={30}
            fontWeight={FONT_WEIGHT.BOLD}
          >
            산책 시작까지...
          </CustomText>
        </View>
      )}
      <Container>
        <View style={styles.section1}>
          <GoogleMap
            defaultRegion={region}
            mapRef={mapRef}
            width={window.width}
            height={window.height}
            longitudeDelta={LONGITUDE_DELTA}
            latitudeDelta={LATITUDE_DELTA}
          />
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
          <View style={styles.dashboard}>
            <View style={{ alignItems: 'center' }}>
              <Timer
                remain={seconds}
                fontWeight={FONT_WEIGHT.BOLD}
                fontSize={16}
              />
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
    </>
  );
};

export default observer(WalkingView);

const styles = StyleSheet.create({
  startSplash: {
    width: window.width,
    height: screen.height,
    backgroundColor: COLORS.warning,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 100,
    elevation: 100,
  },
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
