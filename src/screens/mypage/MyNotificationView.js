import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Container from '../../components/layouts/Container';
import CustomText from '../../components/elements/CustomText';
import { COLORS } from '../../commons/colors';
import { FONT_WEIGHT } from '../../commons/constants';
import { serviceApis } from '../../utils/ServiceApis';
import { useStores } from '../../contexts/StoreContext';
import NotificationItem from '../../components/mypage/NotificationItem';
import { Navigator } from '../../navigations/Navigator';
import MoreButton from '../../components/elements/MoreButton';

const PAGE_SIZE = 20;

const MyNotificationView = () => {
  const [notifications, setNotifications] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const { systemStore } = useStores();
  const page = useRef(1);
  const [refreshing, setRefreshing] = useState(false);

  const getData = async (init) => {
    try {
      const response = await serviceApis.getNotifications(
        PAGE_SIZE,
        page.current
      );
      if (init) {
        setNotifications(response.result?.notifications);
      } else {
        setNotifications([...notifications, ...response.result?.notifications]);
      }
      setHasNext(response.result?.hasNext);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      systemStore.setIsLoading(true);
      await getData(true);
      systemStore.setIsLoading(false);
    };
    fetchData();
  }, []);

  const getNextData = async () => {
    page.current += 1;
    systemStore.setIsLoading(true);
    await getData(false);
    systemStore.setIsLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    page.current = 1;
    await getData(true);
    setRefreshing(false);
  };

  const landing = useCallback((item) => {
    if (item.landingUrl == 'walking_history_tab2') {
      if (systemStore.isWalking) {
        Navigator.navigate({}, 'home_tabs', 'walking_tab');
      } else {
        Navigator.reset({ tab: 1 }, 'home_tabs', 'walking_tab', 'walking_home');
      }
    } else if (item.landingUrl == 'friends_tab1') {
      Navigator.reset({ tab: 0 }, 'friends');
    } else if (item.landingUrl == 'friends_tab2') {
      Navigator.reset({ tab: 1 }, 'friends');
    }
  }, []);

  return (
    <Container
      header={true}
      paddingHorizontal={0}
      headerPaddingTop={0}
      bgColor={COLORS.containerGray}
    >
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {!!notifications &&
          (notifications.length > 0 ? (
            <>
              {notifications?.map((item) => (
                <NotificationItem
                  key={item.notiId}
                  item={item}
                  onPress={landing}
                />
              ))}
              {hasNext && <MoreButton onPress={getNextData} />}
            </>
          ) : (
            <View style={styles.notExistWrap}>
              <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={15}>
                Notifications received for 1 month does not exist.
              </CustomText>
            </View>
          ))}
      </ScrollView>
    </Container>
  );
};

export default MyNotificationView;

const styles = StyleSheet.create({
  notExistWrap: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
