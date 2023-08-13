import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Container from '../../components/layouts/Container';
import moment from 'moment';
import CustomText from '../../components/elements/CustomText';
import { FONT_WEIGHT, FOOTPRINT_TYPE } from '../../commons/constants';
import GoogleMap from '../../components/map/GoogleMap';
import { Polyline } from 'react-native-maps';
import { COLORS } from '../../commons/colors';
import Timer from '../../components/elements/Timer';
import { serviceApis } from '../../utils/ServiceApis';
import { Navigator } from '../../navigations/Navigator';
import { useStores } from '../../contexts/StoreContext';
import { Ionicons } from '@expo/vector-icons';
import { utils } from '../../utils/Utils';
import FootprintImage from '../../components/modules/FootprintImage';
import FootprintDetailModal from '../../components/walking/FootprintDetailModal';

const window = Dimensions.get('window');
const ASPECT_RATIO = window.width / window.height;

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const WalkingResultView = (props) => {
  const { route, navigation } = props;
  const mapRef = useRef(null);
  const [region, setRegion] = useState(null);
  const [report, setReport] = useState(null);
  const footprintDetailModalRef = useRef(null);

  const [selectedFootprintId, setSelectedFootprintId] = useState(null);

  const { systemStore } = useStores();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          onPress={() => {
            if (route.params?.backAction == 'home') {
              Navigator.reset({}, 'home_tabs', 'walking_tab', 'walking_home');
            } else {
              Navigator.goBack();
            }
          }}
        >
          <Ionicons name="arrow-back-outline" size={24} color={COLORS.dark} />
        </Pressable>
      ),
    });
    if (route.params?.backAction == 'home') {
      systemStore.setBackHandlerCallback(() => {
        Navigator.reset({}, 'home_tabs', 'walking_tab', 'walking_home');
      });
    }

    const fetchData = async () => {
      systemStore.setIsLoading(true);
      try {
        const response = await serviceApis.getWalkingReport(
          route.params?.walkingId
        );
        const routesObj = JSON.parse(response.result.routes);

        const lastCoords = routesObj[parseInt(routesObj.length / 2)];
        setRegion({
          latitude: lastCoords[0],
          longitude: lastCoords[1],
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });

        const rewardObj = {};

        response.result?.pointTypes?.map((ele) => {
          rewardObj[ele.codeName] = [];
        });

        response.result?.rewardHistories?.map((ele) => {
          if (!rewardObj[ele.pointTypeName]) {
            rewardObj[ele.pointTypeName] = [];
          }
          rewardObj[ele.pointTypeName].push(ele);
        });

        const footPrintList = [];
        const catched = response.result?.footprintCatchHistories;
        for (let i = 0; i < response.result?.maxFootprintAmount; i++) {
          if (i < catched.length) {
            footPrintList.push(catched[i]);
          } else {
            footPrintList.push({});
          }
        }

        setReport({
          footprints: footPrintList,
          routes: routesObj.map((ele) => ({
            latitude: ele[0],
            longitude: ele[1],
          })),
          rewards: rewardObj,
          startDate: moment(response.result?.startDate).format(
            'YYYY.MM.DD (ddd)'
          ),
          endDate: moment(response.result?.endDate).format('YYYY.MM.DD (ddd)'),
          seconds: response.result?.seconds,
          meters: response.result?.meters,
        });
      } catch (e) {
        goToHome();
      } finally {
        systemStore.setIsLoading(false);
      }
    };
    fetchData();

    return () => {
      systemStore.setBackHandlerCallback(null);
    };
  }, []);

  const goToHome = (params) => {
    Navigator.reset({ params }, 'home_tabs', 'walking_tab', 'walking_home');
  };

  const handleOpenFootprintDetail = (footprintId) => {
    setSelectedFootprintId(footprintId);
    footprintDetailModalRef.current.openModal(true);
  };

  return (
    <Container header={true} headerPaddingTop={0}>
      {!!report && (
        <ScrollView>
          <View style={styles.section1}>
            <CustomText fontSize={16} style={{ marginBottom: 10 }}>
              {report?.endDate}
            </CustomText>
            <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={18}>
              산책 리포트
            </CustomText>
          </View>
          <View style={styles.section2}>
            <GoogleMap
              defaultRegion={region}
              mapRef={mapRef}
              height={window.width * 0.5}
              style={{ borderRadius: 20 }}
              userLocation={false}
              longitudeDelta={LONGITUDE_DELTA}
              latitudeDelta={LATITUDE_DELTA}
            >
              <Polyline
                coordinates={report?.routes}
                strokeColor="#e23dff"
                strokeWidth={6}
              />
            </GoogleMap>
          </View>
          <View style={styles.section3}>
            <View style={styles.reportSection}>
              <CustomText
                fontSize={18}
                style={{ marginBottom: 10 }}
                fontWeight={FONT_WEIGHT.BOLD}
              >
                산책 기록
              </CustomText>
              <View style={styles.reportItemWrap}>
                <View style={styles.reportItem}>
                  <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
                    산책 시간
                  </CustomText>
                  <Timer
                    remain={report?.seconds}
                    fontWeight={FONT_WEIGHT.BOLD}
                    fontSize={16}
                  />
                </View>
                <View style={styles.reportItem}>
                  <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
                    산책 거리
                  </CustomText>
                  <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
                    {utils.toFormatNumber(report?.meters)} m
                  </CustomText>
                </View>
                <View style={styles.reportItem}>
                  <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
                    활동량
                  </CustomText>
                  <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
                    {utils.calculateSpeed(report?.meters, report?.seconds)} km/h
                  </CustomText>
                </View>
              </View>
            </View>
            <View style={styles.reportSection}>
              {Object.keys(report?.rewards)?.map((k) => (
                <View key={k}>
                  <CustomText
                    fontSize={18}
                    style={{ marginBottom: 10 }}
                    fontWeight={FONT_WEIGHT.BOLD}
                  >
                    획득 {k}
                  </CustomText>
                  <View style={styles.reportItemWrap}>
                    {report?.rewards[k].map((ele, idx) => (
                      <View style={styles.reportItem} key={idx}>
                        <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
                          {ele.policyName}
                        </CustomText>
                        <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
                          {!ele.paymentYn && '(지급 예정)'} {ele.amount}
                          {ele.pointTypeSymbol}
                        </CustomText>
                      </View>
                    ))}
                    {report?.rewards[k].length == 0 && (
                      <View style={styles.reportItem}>
                        <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
                          획득한 {k}가 없어요.
                        </CustomText>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.reportSection}>
              <CustomText
                fontSize={18}
                style={{ marginBottom: 10 }}
                fontWeight={FONT_WEIGHT.BOLD}
              >
                Catched Footprints
              </CustomText>
              <View style={styles.reportItemWrap}>
                <View style={styles.footPrintWrap}>
                  {report?.footprints?.map((ele, idx) => (
                    <Pressable
                      key={idx}
                      onPress={() => {
                        if (!!ele.footprintId) {
                          handleOpenFootprintDetail(ele.footprintId);
                        }
                      }}
                    >
                      <FootprintImage
                        size={50}
                        type={
                          !!ele.footprintId
                            ? FOOTPRINT_TYPE.CATCHED
                            : FOOTPRINT_TYPE.DISABLED
                        }
                      />
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
      <FootprintDetailModal
        modalRef={footprintDetailModalRef}
        footprintId={selectedFootprintId}
      />
    </Container>
  );
};

export default WalkingResultView;

const styles = StyleSheet.create({
  section1: {
    marginTop: 20,
    marginBottom: 20,
  },
  section2: {
    marginBottom: 20,
  },
  section3: {
    paddingHorizontal: 5,
  },

  reportSection: {
    marginBottom: 20,
  },
  reportItemWrap: {
    backgroundColor: COLORS.light,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  reportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  footPrintWrap: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});
