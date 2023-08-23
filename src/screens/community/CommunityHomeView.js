import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import Container from '../../components/layouts/Container';
import { COLORS } from '../../commons/colors';
import { serviceApis } from '../../utils/ServiceApis';
import BannerSwiper from '../../components/service/BannerSwiper';
import { FONT_WEIGHT } from '../../commons/constants';
import CustomText from '../../components/elements/CustomText';
import { Navigator } from '../../navigations/Navigator';

const CommunityHomeView = ({navigation}) => {
  const isFocused = useIsFocused();
  const [post, setPost] = useState([]);
  const [communityData, setCommunityData] = useState({});
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (isFocused) {
      const fetchData = async () => {
        try {
          const response = await serviceApis.getCommunityData();
          setCommunityData(response.result);
          navigation.setOptions({
            headerRight: () => (
              <HeaderRight newNotiCount={response.result.newNotiCount} />
            ),
          });
        } catch (error) {}
      };
      fetchData();
    }
  }, [isFocused]);

  return (
    <Container
      header={true}
      bgColor={COLORS.light}
      paddingHorizontal={0}
      headerPaddingTop={0}
    >
      <View style={styles.section1}>
        <View style={styles.categoryWrap}>
          <View style={styles.category}>

          </View>
        </View>
      </View>
      <ScrollView>
        {!!communityData && communityData.banners?.length > 0 && (
          <BannerSwiper banners={communityData.banners} />
        )}
        <View style={styles.section2}></View>
      </ScrollView>
    </Container>
  );
};

const HeaderRight = ({ newNotiCount }) => {
  return (
    <View style={{ flexDirection: 'row', paddingRight: 15 }}>
      <Pressable
        onPress={() => {
          Navigator.navigate({}, 'mypage_nav', 'notification_history');
        }}
        hitSlop={5}
        style={({ pressed }) => [
          {
            paddingHorizontal: 5,
            marginRight: 10,
            backgroundColor: pressed ? COLORS.lightDeep : COLORS.white,
          },
        ]}
      >
        <Ionicons name='notifications-outline' size={24} color={COLORS.dark} />
        {newNotiCount > 0 && (
          <View style={styles.notiLabel}>
            <CustomText
              fontColor={COLORS.white}
              fontWeight={FONT_WEIGHT.BOLD}
              fontSize={11}
            >
              {newNotiCount}
            </CustomText>
          </View>
        )}
      </Pressable>
      <Pressable
        onPress={() => {
          Navigator.navigate({}, 'mypage_nav', 'setting');
        }}
        hitSlop={5}
        style={({ pressed }) => [
          {
            paddingHorizontal: 5,
            backgroundColor: pressed ? COLORS.lightDeep : COLORS.white,
          },
        ]}
      >
        <Ionicons name='settings-outline' size={24} color={COLORS.dark} />
      </Pressable>
    </View>
  );
};

export default CommunityHomeView;

const styles = StyleSheet.create({
  notiLabel: {
    position: 'absolute',
    right: -7,
    bottom: -5,
    backgroundColor: COLORS.dangerLight,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  section1: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },
  section2: {
    paddingHorizontal: 15,
  },
});
