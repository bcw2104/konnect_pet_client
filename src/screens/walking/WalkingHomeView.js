import { Dimensions, Modal, StyleSheet, View } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useStores } from '../../contexts/StoreContext';
import Container from '../../components/layouts/Container';
import GoogleMap from '../../components/map/GoogleMap';
import CustomButton from '../../components/elements/CustomButton';
import {COLORS} from '../../commons/colors';
import { MaterialIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import { serviceApis } from '../../utils/ServiceApis';
import { Navigator } from '../../navigations/Navigator';
import { asyncStorage } from '../../storage/Storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Marker } from 'react-native-maps';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { Ionicons } from '@expo/vector-icons';
import { utils } from '../../utils/Utils';
import { useIsFocused } from '@react-navigation/native';
import FootprintDetailModal from '../../components/walking/FootprintDetailModal';
import WalkingSettingModal from '../../components/walking/WalkingSettingModal';
import FootprintMarker from '../../components/walking/FootprintMarker';
import { observer } from 'mobx-react-lite';
import { FONT_WEIGHT } from '../../commons/constants';

const window = Dimensions.get('window');
const ASPECT_RATIO = window.width / window.height;

const LATITUDE_DELTA = 0.003;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const WalkingHomeView = (props) => {
  const { route } = props;
  const mapRef = useRef(null);
  const footprintDetailModalRef = useRef(null);
  const settingModalRef = useRef(null);
  const aroundStandardCoords = useRef(null);
  const isFocused = useIsFocused();

  const [selectedFootprintId, setSelectedFootprintId] = useState(null);
  const [permission, setPermission] = useState(false);
  const [region, setRegion] = useState(null);
  const { modalStore, systemStore, userStore } = useStores();
  const [footprints, setFootprints] = useState([]);

  const [setting, setSetting] = useState({
    footprintYn: true,
  });

  useEffect(() => {
    if (isFocused && !userStore.profile) {
      modalStore.openOneButtonModal(
        '이용 전 프로필을 등록해주세요.',
        '등록하기',
        () => {
          Navigator.navigate({}, 'mypage_nav', 'profile_form');
        }
      );
      return;
    }
  }, [isFocused]);

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
              goToResult({ walkingId: walkingTempData.id });
            }
          } catch (err) {
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

  const goToResult = (params) => {
    Navigator.reset(params, 'walking_nav', 'walking_result');
  };

  const handleChangeSetting = (setting) => {
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
        '산책 전 반려동물을 등록해주세요.',
        '취소',
        null,
        '추가하기',
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
    <Container>
      <View style={styles.section1}>
        <CustomButton
          bgColor={COLORS.white}
          bgColorPress={COLORS.lightDeep}
          render={<Ionicons name="options" size={30} color="black" />}
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
          {!!setting.footprintYn && (
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
          render={<MaterialIcons name="my-location" size={30} color="black" />}
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
          bgColor={COLORS.main}
          bgColorPress={COLORS.mainDeep}
          text="산책 시작"
          fontWeight={FONT_WEIGHT.BOLD}
          fontColor={COLORS.white}
          fontSize={18}
          onPress={startWalking}
          height={50}
          wrapperStyle={styles.start}
        />
      </View>
      <FootprintDetailModal
        modalRef={footprintDetailModalRef}
        footprintId={selectedFootprintId}
      />
      <WalkingSettingModal
        modalRef={settingModalRef}
        setting={setting}
        handleChangeSetting={handleChangeSetting}
      />
    </Container>
  );
};

export default observer(WalkingHomeView);

const styles = StyleSheet.create({
  section1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapSetting: {
    alignSelf: 'flex-end',
    top: 90,
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
  start: {},
});
