import { AppState, Dimensions, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import {
  DEEP_LINK_PREFIX,
  FONT_WEIGHT,
  WALKING_REWARD_TYPE,
} from '../../commons/constants';
import { Navigator } from '../../navigations/Navigator';
import { observer } from 'mobx-react-lite';
import { asyncStorage } from '../../storage/Storage';
import serviceApis from '../../utils/ServiceApis';
import BackgroundService from 'react-native-background-actions';
import { utils } from '../../utils/Utils';
import { Marker, Polyline } from 'react-native-maps';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { Ionicons } from '@expo/vector-icons';
import CustomModal from '../../components/elements/CustomModal';
import CustomSwitch from '../../components/elements/CustomSwitch';

const window = Dimensions.get('window');
const screen = Dimensions.get('screen');
const ASPECT_RATIO = window.width / window.height;

const SPLASH_TIME = 3;
const LATITUDE_DELTA = 0.003;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const WalkingView = (props) => {
  const mapRef = useRef(null);
  const settingModalRef = useRef(null);
  const { route } = props;
  const appState = useRef(AppState.currentState);
  const rewards = useRef({});

  const policies = useRef({});
  const prevCoords = useRef(null);
  const currentCoords = useRef(null);
  const footprintCoords = useRef([]);
  const savedCoords = useRef([]);
  const savedCoordsProps = useRef({
    balancer: 1,
    counter: 0,
    updated: false,
  });
  const catchedFootprints = useRef([]);
  const metersRef = useRef(0);
  const footprintsRef = useRef([]);
  const updateFootprints = useRef(false);
  const aroundStandardCoords = useRef(null);

  const [seconds, setSeconds] = useState(0);
  const [meters, setMeters] = useState(0);
  const [startCounter, setStartCounter] = useState(SPLASH_TIME);
  const [region, setRegion] = useState(null);
  const [permission, setPermission] = useState(false);

  const [routes, setRoutes] = useState([]);
  const [myFootprints, setMyFootprints] = useState([]);
  const [footprints, setFootprints] = useState([]);
  const [footprintsToggle, setFootprintsToggle] = useState(true);

  const { systemStore, modalStore } = useStores();

  const bgServiceOptions = {
    taskName: 'walking_task',
    taskTitle: '산책 중....',
    taskDesc: '산책이 진행중입니다.',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    linkingURI: DEEP_LINK_PREFIX.DEFAULT + 'walking',
    color: '#ff00ff',
    parameters: {},
  };

  useEffect(() => {
    // const subscription = AppState.addEventListener(
    //   'change',
    //   async (nextAppState) => {
    //     if (
    //       appState.current.match(/inactive|background/) &&
    //       nextAppState === 'active'
    //     ) {
    //       const now = new Date();
    //       const diffTime = Math.ceil(Math.abs(now - prevTime.current) / 1000);
    //       setSeconds((seconds) => seconds + diffTime);
    //     } else {
    //       prevTime.current = new Date();
    //     }

    //     appState.current = nextAppState;
    //   }
    // );

    const fetchData = async () => {
      systemStore.setDisplayTabBar(false);
      setRegion(route.params?.currentCoords);
      await getAroundFootprints(route.params?.currentCoords);
      const rewardPolices = route.params?.walkingRewardPolicies;
      const walkingPolicies = route.params?.walkingPolicies;

      //정책 정보 초기화
      walkingPolicies.map((ele) => {
        policies.current[ele.name] = ele.value;
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
        await BackgroundService.start(locationTask, bgServiceOptions);
      }
    };
    fetchData();

    return async () => {
      // subscription.remove();
      await BackgroundService.stop();

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

      if (meters != metersRef.current && metersRef.current >= 0) {
        setMeters(metersRef.current);
      }

      if (savedCoordsProps.current.updated) {
        savedCoordsProps.current.updated = false;
        setRoutes(
          savedCoords.current.map((coords) => ({
            latitude: coords[0],
            longitude: coords[1],
          }))
        );
      }

      if (updateFootprints.current) {
        setFootprints(footprintsRef.current);
        updateFootprints.current = false;
      }

      if (footprintCoords.current.length != myFootprints.length) {
        setMyFootprints(
          footprintCoords.current.map((coords) => ({
            latitude: coords[0],
            longitude: coords[1],
          }))
        );
      }
      //5초에 한번씩 산책 데이터 저장
      if (newSeconds > 0 && newSeconds % 5 == 0) {
        const params = {
          key: route.params?.walkingKey,
          meters: meters,
          seconds: newSeconds,
          rewardPolicies: route.params?.walkingRewardPolicies,
          currentCoords: currentCoords.current,
          footprintCoords: footprintCoords.current,
          savedCoords: savedCoords.current,
        };
        asyncStorage.setItem('walking_temp_data', JSON.stringify(params));
      }
    }
  }, 1000);

  const sleep = (time) =>
    new Promise((resolve) => setTimeout(() => resolve(), time));

  const locationTask = async (taskDataArguments) => {
    await new Promise(async (resolve) => {
      while (BackgroundService.isRunning()) {
        await updateLocation();
        await sleep(5000);
      }
    });
  };

  const handleOpenSetting = () => {
    settingModalRef.current.openModal(true);
  };

  const getAroundFootprints = async (coords) => {
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
      footprintsRef.current = footprints;
      setFootprints(footprints);
    } catch (e) {}
  };

  const updateLocation = useCallback(async () => {
    try {
      let { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 10,
      });
      currentCoords.current = {
        latitude: coords.latitude,
        longitude: coords.longitude,
      };
      if (!prevCoords.current) {
        prevCoords.current = currentCoords.current;
      }

      changeMyLocation(coords);

      metersRef.current += utils.coordsDist(
        currentCoords.current.latitude,
        currentCoords.current.longitude,
        prevCoords.current.latitude,
        prevCoords.current.longitude
      );
      prevCoords.current = currentCoords.current;

      const aroundCoords = utils.getAroundCoord(
        coords.latitude,
        coords.longitude,
        10
      );

      //발자국 획득 로직
      if (
        policies.current['walking_footprint_catch_amount'] >
        catchedFootprints.current.length
      ) {
        const catchableFootprints = Object.values(footprintsRef.current).filter(
          (f) =>
            f.catched == false &&
            f.latitude >= aroundCoords.minLat &&
            f.latitude <= aroundCoords.maxLat &&
            f.longitude >= aroundCoords.minLng &&
            f.longitude <= aroundCoords.maxLng
        );

        const currentCatchableCount = Math.min(
          catchableFootprints.length,
          policies.current['walking_footprint_catch_amount'] -
            catchedFootprints.current.length
        );

        let catchCount = 0;
        for (let i = 0; i < currentCatchableCount; i++) {
          const target = catchableFootprints[i].id;
          if (target) {
            catchedFootprints.current.push(target);
            footprintsRef.current[target].catched = true;
            catchCount++;
          }
        }

        if (catchCount > 0) {
          updateFootprints.current = false;
        }
      }

      if (metersRef.current > 0) {
        if (
          metersRef.current >=
            parseInt(policies.current['walking_footprint_unit']) *
              (footprintCoords.current.length + 1) &&
          footprintCoords.current.length <
            parseInt(policies.current['walking_footprint_max_amount'])
        ) {
          footprintCoords.current.push([coords.latitude, coords.longitude]);
          utils.defaultNotification(
            '발자국 기록!',
            `${footprintCoords.current.length}"번째 발자국을 기록했어요!`,
            'walking'
          );
        }
      }

      if (metersRef.current >= 70 * savedCoordsProps.current.counter) {
        if (savedCoords.current.length >= 25) {
          if (savedCoordsProps.current.balancer % 2 == 0) {
            savedCoords.current.splice(
              savedCoordsProps.current.balancer - 1,
              1
            );
            savedCoords.current.push([coords.latitude, coords.longitude]);
            savedCoordsProps.current.updated = true;
          }
          savedCoordsProps.current.balancer += 1;
          if (savedCoordsProps.current.balancer == 25) {
            savedCoordsProps.current.balancer = 1;
          }
        } else {
          savedCoords.current.push([coords.latitude, coords.longitude]);
          savedCoordsProps.current.updated = true;
        }
        savedCoordsProps.current.counter += 1;
      }

      const standardCoords = aroundStandardCoords.current;

      const dist = utils.coordsDist(
        coords.latitude,
        coords.longitude,
        standardCoords.latitude,
        standardCoords.longitude
      );

      if (dist >= 2500) {
        getAroundFootprints(coords);
      }
    } catch (e) {
      console.log(e.message);
    }
  }, []);

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
    Navigator.reset(params, 'walking_home');
  };

  const goToNextStep = (params) => {
    Navigator.reset(params, 'walking_nav', 'walking_result');
  };

  const changeMyLocation = useCallback((coords) => {
    mapRef?.current?.animateToRegion({
      latitude: coords.latitude,
      longitude: coords.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  }, []);

  const hasLocationPermissions = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status === 'granted') {
      setPermission(true);
      return true;
    }
    setPermission(false);
    modalStore.openTwoButtonModal(
      '정상적인 산책 기록을 위해 위치 권한을 허용해주세요.',
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

    let { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    currentCoords.current = {
      latitude: coords.latitude,
      longitude: coords.longitude,
    };

    changeMyLocation(coords);
  };

  const stopWalking = async () => {
    modalStore.openTwoButtonModal(
      '산책을 종료하시겠어요?',
      '아니요',
      () => {},
      '네',
      async () => {
        systemStore.setIsLoading(true);
        try {
          let { coords } = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Highest,
          });
          changeMyLocation(coords);
          savedCoords.current.push([coords.latitude, coords.longitude]);
        } catch (error) {}
        try {
          calculateReward(rewards.current);
          const params = {
            id: route.params?.walkingId,
            key: route.params?.walkingKey,
            meters: meters,
            seconds: seconds,
            rewards: JSON.stringify(rewards.current),
            footprintCoords: JSON.stringify(footprintCoords.current),
            savedCoords: JSON.stringify(savedCoords.current),
            catchedFootprints: JSON.stringify(catchedFootprints.current),
          };
          const response = await serviceApis.saveWalking(params);

          if (response?.rsp_code === '1000') {
            await asyncStorage.removeItem('walking_temp_data');

            goToNextStep({ walkingId: route.params?.walkingId });
          }
        } catch (error) {
          goToHome();
        } finally {
          systemStore.setIsLoading(false);
        }
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
          <CustomButton
            bgColor={COLORS.white}
            bgColorPress={COLORS.lightDeep}
            text={<Ionicons name='options' size={30} color='black' />}
            fontColor={COLORS.white}
            onPress={handleOpenSetting}
            width={60}
            height={60}
            wrapperStyle={styles.mapSetting}
            style={{
              borderRadius: 30,
            }}
          />
          {permission && (
            <GoogleMap
              defaultRegion={region}
              mapRef={mapRef}
              width={window.width}
              height={window.height}
              longitudeDelta={LONGITUDE_DELTA}
              latitudeDelta={LATITUDE_DELTA}
              userLocation={permission}
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
                          name='dog'
                          size={24}
                          color='black'
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
                        <MaterialCommunityIcons
                          name='dog'
                          size={24}
                          color='red'
                        />
                      </Marker>
                    ))}
                </>
              )}
              {myFootprints.map((coords, index) => (
                <Marker key={index} coordinate={coords}>
                  <FontAwesome5 name='stamp' size={24} color='black' />
                </Marker>
              ))}
              <Polyline
                coordinates={routes}
                strokeColor='#e23dff'
                strokeWidth={6}
              />
            </GoogleMap>
          )}
        </View>
        <View style={styles.section2}>
          <CustomButton
            bgColor={COLORS.white}
            bgColorPress={COLORS.lightDeep}
            text={<MaterialIcons name='my-location' size={30} color='black' />}
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
              text={<MaterialIcons name='pause' size={30} color='black' />}
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
        <CustomModal
          ref={settingModalRef}
          closeText={'닫기'}
          title={'Map Setting'}
        >
          <View style={styles.settingItemWrap}>
            <View style={{ flexDirection: 'row' }}>
              <MaterialCommunityIcons name='dog' size={27} color='black' />
              <CustomText style={{ marginLeft: 7 }}>발자국</CustomText>
            </View>
            <CustomSwitch
              onValueChange={() => setFootprintsToggle(!footprintsToggle)}
              value={footprintsToggle}
            />
          </View>
        </CustomModal>
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
