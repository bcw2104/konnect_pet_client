import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Container from '../../components/layouts/Container';
import moment from 'moment';
import CustomText from '../../components/elements/CustomText';
import { FONT_WEIGHT, NUMBER_TO_LANG } from '../../commons/constants';
import GoogleMap from '../../components/map/GoogleMap';
import { Polyline } from 'react-native-maps';
import {COLORS} from '../../commons/colors';
import Timer from '../../components/elements/Timer';
import serviceApis from '../../utils/ServiceApis';
import { Navigator } from '../../navigations/Navigator';
import { useStores } from '../../contexts/StoreContext';
import { observer } from 'mobx-react-lite';

const window = Dimensions.get('window');
const ASPECT_RATIO = window.width / window.height;

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const WalkingResultView = (props) => {
  const { route } = props;
  const mapRef = useRef(null);
  const [region, setRegion] = useState(null);
  const [rewards, setRewards] = useState({});
  const [footprints, setFootprints] = useState({});
  const [routes, setRoutes] = useState([]);
  const [report, setReport] = useState({});

  const { systemStore } = useStores();

  useEffect(() => {
    systemStore.setBackHandlerCallback(() => {
      Navigator.reset({}, 'home_tabs', 'walking_tab', 'walking_home');
    });

    const fetchData = async () => {
      systemStore.setIsLoading(true);
      try {
        const response = await serviceApis.getWalkingReport(
          route.params?.walkingId
        );
        const routes = JSON.parse(response.result.routes);
        setRoutes(
          routes.map((ele) => ({ latitude: ele[0], longitude: ele[1] }))
        );

        const lastCoords = routes[parseInt(routes.length / 2)];
        setRegion({
          latitude: lastCoords[0],
          longitude: lastCoords[1],
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });

        const rewardObj = {};
        response.result?.rewardHistories?.map((ele) => {
          if (!rewardObj[ele.pointTypeName]) {
            rewardObj[ele.pointTypeName] = [];
          }
          rewardObj[ele.pointTypeName].push(ele);
        });
        setRewards(rewardObj);

        setReport({
          startDate: moment(response.result?.startDate).format(
            'YYYY.MM.DD (ddd)'
          ),
          endDate: moment(response.result?.endDate).format('YYYY.MM.DD (ddd)'),
          seconds: response.result?.seconds,
          meters: response.result?.meters,
        });

        setFootprints({
          catched: response.result?.footprintCatchHistories,
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

  return (
    <Container header={true} headerPaddingTop={0}>
      {!systemStore.isLoading && (
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
                coordinates={routes}
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
                    {report?.meters.toLocaleString('ko-KR')} m
                  </CustomText>
                </View>
                <View style={styles.reportItem}>
                  <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
                    활동량
                  </CustomText>
                  <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
                    100 kcal
                  </CustomText>
                </View>
              </View>
            </View>
            <View style={styles.reportSection}>
              {Object.keys(rewards)?.map((k) => (
                <View key={k}>
                  <CustomText
                    fontSize={18}
                    style={{ marginBottom: 10 }}
                    fontWeight={FONT_WEIGHT.BOLD}
                  >
                    획득 {k}
                  </CustomText>
                  <View style={styles.reportItemWrap}>
                    {rewards[k].map((ele, idx) => (
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
                획득 발자국 ({footprints?.catched?.length || 0}개)
              </CustomText>
              <View style={styles.reportItemWrap}>
                {footprints?.catched?.map((ele, idx) => (
                  <View style={styles.reportItem} key={idx}>
                    <CustomText fontSize={16}>
                      {`${NUMBER_TO_LANG[idx + 1]} 획득`}
                    </CustomText>
                    <CustomText fontSize={16}>
                      {moment(ele.createdDate).format('YYYY.MM.DD (ddd)')}
                    </CustomText>
                  </View>
                ))}
                {footprints?.catched.length == 0 && (
                  <View style={styles.reportItem}>
                    <CustomText fontSize={16}>
                      획득한 발자국이 없어요.
                    </CustomText>
                  </View>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </Container>
  );
};

export default observer(WalkingResultView);

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
    backgroundColor: COLORS.lightDeep,
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
});
