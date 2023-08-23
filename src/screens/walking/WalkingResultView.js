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
  const [mapIsReady, setMapIsReady] = useState(false);
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
          <Ionicons name='arrow-back-outline' size={24} color={COLORS.dark} />
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
            <View style={styles.reportSection}>
              <CustomText fontSize={16} style={{ marginBottom: 10 }}>
                {report?.endDate}
              </CustomText>
              <CustomText
                fontWeight={FONT_WEIGHT.BOLD}
                fontSize={18}
                style={styles.reportTitle}
              >
                Walking Routes
              </CustomText>
              <GoogleMap
                defaultRegion={region}
                mapRef={mapRef}
                height={window.width * 0.5}
                style={{ borderRadius: 20 }}
                onMapLoaded={() => {
                  setMapIsReady(true);
                }}
                userLocation={false}
                longitudeDelta={LONGITUDE_DELTA}
                latitudeDelta={LATITUDE_DELTA}
              >
                {mapIsReady && (
                  <Polyline
                    coordinates={report?.routes}
                    strokeColor='#e23dff'
                    strokeWidth={6}
                  />
                )}
              </GoogleMap>
            </View>
            <View style={styles.reportSection}>
              <CustomText
                fontSize={18}
                style={styles.reportTitle}
                fontWeight={FONT_WEIGHT.BOLD}
              >
                Walking Record
              </CustomText>
              <View style={styles.reportItemWrap}>
                <View style={styles.reportItem}>
                  <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
                    Time
                  </CustomText>
                  <Timer
                    remain={report?.seconds}
                    fontWeight={FONT_WEIGHT.BOLD}
                    fontSize={16}
                  />
                </View>
                <View style={styles.reportItem}>
                  <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
                    Distance
                  </CustomText>
                  <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
                    {utils.toFormatNumber(report?.meters)} m
                  </CustomText>
                </View>
                <View style={styles.reportItem}>
                  <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
                    Average speed
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
                    style={styles.reportTitle}
                    fontWeight={FONT_WEIGHT.BOLD}
                  >
                    Earned {k}
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
                          No {k} earned.
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
                style={styles.reportTitle}
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
    flex: 1,
  },

  reportSection: {
    marginBottom: 30,
  },
  reportTitle: {
    marginBottom: 10,
  },
  reportItemWrap: {
    backgroundColor: COLORS.light,
    paddingHorizontal: 15,
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
