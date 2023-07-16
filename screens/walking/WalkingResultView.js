import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Container from '../../components/layouts/Container';
import { useTabBarHandler } from '../../hooks/useTabBarHandler';
import moment from 'moment';
import CustomText from '../../components/elements/CustomText';
import { FONT_WEIGHT } from '../../commons/constants';
import GoogleMap from '../../components/map/GoogleMap';
import { Polyline } from 'react-native-maps';
import COLORS from '../../commons/colors';
import Timer from '../../components/elements/Timer';

const window = Dimensions.get('window');
const ASPECT_RATIO = window.width / window.height;

const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const WalkingResultView = (props) => {
  useTabBarHandler();
  const { route } = props;
  const mapRef = useRef(null);
  const [region, setRegion] = useState(null);

  useEffect(() => {
    console.log(route.params);
    const lastCoords = route.params?.currentCoords;
    setRegion({
      latitude: lastCoords?.latitude,
      longitude: lastCoords?.longitude,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    });
  }, []);

  return (
    <Container header={true}>
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={styles.section1}>
          <CustomText fontSize={18} style={{ marginBottom: 10 }}>
            {moment().format('YYYY.MM.DD (ddd)')}
          </CustomText>
          <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={24}>
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
              coordinates={
                route.params?.savedCoords?.map((ele) => ({
                  latitude: ele[0],
                  longitude: ele[1],
                })) || []
              }
              strokeColor="#e23dff"
              strokeWidth={6}
            />
          </GoogleMap>
        </View>
        <View style={styles.section3}>
          <View style={styles.reportSection}>
            <CustomText
              fontSize={20}
              style={{ marginBottom: 10 }}
              fontWeight={FONT_WEIGHT.BOLD}
            >
              산책 리포트
            </CustomText>
            <View style={styles.reportItemWrap}>
              <View style={styles.reportItem}>
                <CustomText fontSize={18}>산책 시간</CustomText>
                <Timer
                  remain={route.params?.seconds}
                  fontWeight={FONT_WEIGHT.BOLD}
                  fontSize={18}
                />
              </View>
              <View style={styles.reportItem}>
                <CustomText fontSize={18}>산책 거리</CustomText>
                <CustomText fontSize={18}>{route.params?.meters} km</CustomText>
              </View>
              <View style={styles.reportItem}>
                <CustomText fontSize={18}>활동량</CustomText>
                <CustomText fontSize={18}>100 kcal</CustomText>
              </View>
            </View>
          </View>
          <View style={styles.reward}>
            <CustomText
              fontSize={20}
              style={{ marginBottom: 10 }}
              fontWeight={FONT_WEIGHT.BOLD}
            >
              획득 포인트
            </CustomText>
            <View style={styles.reportItemWrap}>
              {route.params?.rewards?.Obkect((ele) => (
                <View style={styles.reportItem} key={ele.id}>
                  <CustomText fontSize={18}>{ele.policyName}</CustomText>
                  <CustomText fontSize={18}>{ele.pointType}</CustomText>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
};

export default WalkingResultView;

const styles = StyleSheet.create({
  section1: {
    marginBottom: 30,
  },
  section2: {
    marginBottom: 50,
  },
  section3: {
    paddingHorizontal: 5,
  },

  reportSection: {
    marginBottom: 30,
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
