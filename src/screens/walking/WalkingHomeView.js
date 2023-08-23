import {
  Dimensions,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useStores } from '../../contexts/StoreContext';
import Container from '../../components/layouts/Container';
import GoogleMap from '../../components/map/GoogleMap';
import CustomButton from '../../components/elements/CustomButton';
import { COLORS } from '../../commons/colors';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import { serviceApis } from '../../utils/ServiceApis';
import { Navigator } from '../../navigations/Navigator';
import { asyncStorage } from '../../storage/Storage';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { utils } from '../../utils/Utils';
import { useIsFocused } from '@react-navigation/native';
import FootprintDetailModal from '../../components/walking/FootprintDetailModal';
import WalkingSettingModal from '../../components/walking/WalkingSettingModal';
import FootprintMarker from '../../components/walking/FootprintMarker';
import { observer } from 'mobx-react-lite';
import { FONT_WEIGHT } from '../../commons/constants';
import CustomText from '../../components/elements/CustomText';
import WalkingDashboard from '../../components/walking/WalkingDashboard';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import moment from 'moment';
import WalkingHistoryItem from '../../components/walking/WalkingHistoryItem';

const window = Dimensions.get('window');
const ASPECT_RATIO = window.width / window.height;

const LATITUDE_DELTA = 0.003;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const WalkingHomeView = (props) => {
  const isFocused = useIsFocused();
  const { route } = props;
  const { modalStore, systemStore, userStore } = useStores();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Walking' },
    { key: 'second', title: 'History' },
  ]);

  const FirstRoute = useCallback(() => <WalkingStartView />, []);
  const SecondRoute = useCallback(() => <WalkingHistoryView />, []);

  useEffect(() => {
    if (!!route.params?.tab) {
      setIndex(route.params.tab);
    }
  }, [route.params]);

  useEffect(() => {
    if (isFocused && !userStore.profile) {
      modalStore.openOneButtonModal(
        'Please register your profile.',
        'Regist',
        () => {
          Navigator.navigate({}, 'mypage_nav', 'profile_form');
        }
      );
      return;
    }
  }, [isFocused]);

  return (
    <Container paddingHorizontal={0} bgColor={COLORS.light}>
      <TabView
        lazy
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={{ backgroundColor: COLORS.white, paddingVertical: 5 }}
            renderLabel={({ route, focused, color }) => (
              <CustomText
                fontWeight={FONT_WEIGHT.BOLD}
                fontSize={16}
                fontColor={focused ? COLORS.dark : COLORS.gray}
              >
                {route.title}
              </CustomText>
            )}
            indicatorStyle={{
              height: 3,
              backgroundColor: COLORS.main,
            }}
          />
        )}
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          first: FirstRoute,
          second: SecondRoute,
        })}
        onIndexChange={setIndex}
      />
    </Container>
  );
};

export default observer(WalkingHomeView);

const WalkingStartView = () => {
  const mapRef = useRef(null);
  const footprintDetailModalRef = useRef(null);
  const settingModalRef = useRef(null);
  const aroundStandardCoords = useRef(null);
  const { modalStore, systemStore, userStore } = useStores();

  const [selectedFootprintId, setSelectedFootprintId] = useState(null);
  const [permission, setPermission] = useState(false);
  const [region, setRegion] = useState(null);
  const [footprints, setFootprints] = useState(null);

  const [setting, setSetting] = useState({
    footprintYn: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      checkAndSaveAdnormalFinishedWalking();

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

  const checkAndSaveAdnormalFinishedWalking = async () => {
    let walkingTempData = null;
    try {
      walkingTempData = JSON.parse(
        await asyncStorage.getItem('walking_temp_data')
      );
    } catch (error) {}

    asyncStorage.removeItem('walking_temp_data');
    if (!!walkingTempData) {
      modalStore.openTwoButtonModal(
        '중단된 산책 기록이 있어요.\n기록을 저장하시겠어요?',
        '삭제하기',
        () => {},
        '저장하기',
        async () => {
          systemStore.setIsLoading(true);
          //제출
          try {
            const response = await serviceApis.saveWalking(walkingTempData);
            if (response?.rsp_code === '1000') {
              goToReport({ walkingId: walkingTempData.id });
            }
          } catch (err) {
            console.log(err);
            Toast.show({
              type: 'error',
              text1: 'Failed to save walk history.',
            });
          } finally {
            systemStore.setIsLoading(false);
          }
        }
      );
    }
  };

  const goToNextStep = (params) => {
    Navigator.reset(params, 'walking');
  };

  const goToReport = useCallback((params) => {
    Navigator.navigate(params, 'walking_nav', 'walking_result');
  }, []);

  const handleSettingChange = (setting) => {
    setSetting(setting);
  };
  const handleOpenSetting = () => {
    settingModalRef.current.openModal(true);
  };
  const handleOpenFootprintDetail = useCallback((footprintId) => {
    setSelectedFootprintId(footprintId);
    footprintDetailModalRef.current.openModal(true);
  }, []);

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
      'Cancel',
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

    changeMyLocation(coords);
  };

  const startWalking = async () => {
    if (userStore.pets.length == 0) {
      modalStore.openTwoButtonModal(
        'Please register your pet before taking a walk.',
        'Cancel',
        null,
        'Add',
        () => {
          Navigator.navigate({}, 'mypage_nav', 'pet_add_form');
        }
      );
      return;
    }

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
    <>
      <View style={styles.section1}>
        <CustomButton
          bgColor={COLORS.white}
          bgColorPress={COLORS.lightDeep}
          render={<Ionicons name="options" size={30} color={COLORS.dark} />}
          fontColor={COLORS.white}
          onPress={handleOpenSetting}
          width={50}
          height={50}
          wrapperStyle={styles.mapSetting}
          style={{
            borderRadius: 25,
          }}
        />
        <GoogleMap
          userLocation={permission}
          defaultRegion={region}
          mapRef={mapRef}
          width={window.width}
          style={{ position: 'absolute', top: 0 }}
          height={'100%'}
          longitudeDelta={LONGITUDE_DELTA}
          latitudeDelta={LATITUDE_DELTA}
        >
          {!!setting.footprintYn && !!footprints && (
            <FootprintMarker
              userId={userStore.userId}
              footprints={footprints}
              handleOpenFootprintDetail={handleOpenFootprintDetail}
            />
          )}
        </GoogleMap>
      </View>
      <View style={styles.section2}>
        <CustomButton
          bgColor={COLORS.white}
          bgColorPress={COLORS.lightDeep}
          render={
            <MaterialIcons name="my-location" size={30} color={COLORS.dark} />
          }
          fontColor={COLORS.white}
          onPress={getMyLocation}
          width={50}
          height={50}
          wrapperStyle={styles.location}
          style={{
            borderRadius: 25,
          }}
        />
        <WalkingDashboard
          seconds={0}
          meters={0}
          onPress={startWalking}
          type={'start'}
        />
      </View>
      <FootprintDetailModal
        modalRef={footprintDetailModalRef}
        footprintId={selectedFootprintId}
      />
      <WalkingSettingModal
        modalRef={settingModalRef}
        setting={setting}
        handleSettingChange={handleSettingChange}
      />
    </>
  );
};

const WalkingHistoryView = () => {
  const [summary, setSummary] = useState({
    totalCount: 0,
    totalDistance: 0,
    totalPoint: 0,
    totalHours: 0,
    weekAvg: 0,
  });
  const { userStore } = useStores();
  const [history, setHistory] = useState(null);
  const [startDate, setStartDate] = useState(moment().startOf('month'));
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await serviceApis.getWalkingSummary();
        setSummary(response.result);
      } catch (err) {}
    };
    fetchData();
  }, []);

  useEffect(() => {
    getHistory();
  }, [startDate]);

  const getHistory = async () => {
    try {
      const response = await serviceApis.getWalkingHistory(
        startDate.format('YYYY-MM-DDTHH:mm:ss'),
        startDate.clone().endOf('month').format('YYYY-MM-DDTHH:mm:ss')
      );
      setHistory(response.result);
    } catch (err) {}
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getHistory();
    setRefreshing(false);
  };

  const goToReport = useCallback((params) => {
    Navigator.navigate(params, 'walking_nav', 'walking_result');
  }, []);

  return (
    <View style={styles.section1}>
      <View style={styles.summaryWrap}>
        <CustomText
          fontWeight={FONT_WEIGHT.BOLD}
          fontSize={20}
          style={{ marginBottom: 10 }}
        >
          Walking Summary
        </CustomText>

        <View style={styles.summary}>
          <View style={styles.summaryMain}>
            <View style={styles.summaryMainCircle}>
              <CustomText
                fontWeight={FONT_WEIGHT.BOLD}
                fontColor={COLORS.main}
                fontSize={14}
              >
                Total
              </CustomText>
              <CustomText
                fontWeight={FONT_WEIGHT.BOLD}
                fontColor={COLORS.main}
                fontSize={20}
              >
                {utils.toFormatNumber(summary.totalPoint)}P
              </CustomText>
            </View>
          </View>
          <View style={styles.summarySub}>
            <View style={styles.summaryItem}>
              <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={14}>
                Average per week
              </CustomText>
              <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={14}>
                {utils.toFormatNumber(summary.weekAvg)}
              </CustomText>
            </View>
            <View style={styles.summaryItem}>
              <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={14}>
                Total number of times
              </CustomText>
              <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={14}>
                {utils.toFormatNumber(summary.totalCount)}
              </CustomText>
            </View>
            <View style={styles.summaryItem}>
              <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={14}>
                Total distance (km)
              </CustomText>
              <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={14}>
                {utils.toFormatNumber(summary.totalDistance)}
              </CustomText>
            </View>
            <View style={styles.summaryItem}>
              <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={14}>
                Total time (hours)
              </CustomText>
              <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={14}>
                {utils.toFormatNumber(summary.totalHours)}
              </CustomText>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.monthPicker}>
        <Pressable
          onPress={() => {
            const min = moment(userStore.createdDate).format('YYYYMM');
            const newDate = startDate.clone().subtract(1, 'M');
            if (min <= newDate.format('YYYYMM')) {
              setStartDate(newDate);
            }
          }}
        >
          <Ionicons name="chevron-back" size={28} color={COLORS.white} />
        </Pressable>
        <CustomText
          fontWeight={FONT_WEIGHT.BOLD}
          fontSize={17}
          fontColor={COLORS.white}
        >
          {startDate.format('YYYY.MM')}
        </CustomText>
        <Pressable
          onPress={() => {
            const max = moment().format('YYYYMM');
            const newDate = startDate.clone().add(1, 'M');
            if (max >= newDate.format('YYYYMM')) {
              setStartDate(newDate);
            }
          }}
        >
          <Ionicons name="chevron-forward" size={28} color={COLORS.white} />
        </Pressable>
      </View>
      <View style={styles.historyWrap}>
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {!!history &&
            (history.length > 0 ? (
              <>
                {history?.map((item) => (
                  <WalkingHistoryItem
                    key={item.id}
                    item={item}
                    onPress={() => {
                      goToReport({ walkingId: item.id });
                    }}
                  />
                ))}
              </>
            ) : (
              <View style={styles.notExistWrap}>
                <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={16}>
                  History does not exist.
                </CustomText>
              </View>
            ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapSetting: {
    position: 'absolute',
    top: 30,
    right: 20,
    zIndex: 10,
    elevation: 10,
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
  dashboard: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 20,
    paddingHorizontal: 10,
    bordeRadius: 10,
  },

  summaryWrap: {
    width: '100%',
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  summary: {
    flexDirection: 'row',
  },
  summaryMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 30,
  },
  summaryMainCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: COLORS.main,
    borderWidth: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  summarySub: { flex: 1 },
  summaryItem: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyWrap: {
    width: '100%',
    flex: 1,
    backgroundColor: COLORS.light,
  },

  monthPicker: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: COLORS.main,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  notExistWrap: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
