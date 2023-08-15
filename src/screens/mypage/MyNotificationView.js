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
import { MaterialIcons } from '@expo/vector-icons';
import { useStores } from '../../contexts/StoreContext';
import NotificationItem from '../../components/mypage/NotificationItem';
import { Navigator } from '../../navigations/Navigator';

const PAGE_SIZE = 20;

const MyNotificationView = () => {
  const [notification, setNotification] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const { systemStore } = useStores();
  const page = useRef(1);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      systemStore.setIsLoading(true);
      try {
        const response = await serviceApis.getNotifications(
          PAGE_SIZE,
          page.current
        );
        setNotification(response.result?.notifications);
        setHasNext(response.result?.hasNext);
      } catch (err) {
        console.log(err);
      } finally {
        systemStore.setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getNextData = async () => {
    page.current += 1;
    systemStore.setIsLoading(true);
    try {
      const response = await serviceApis.getNotifications(
        PAGE_SIZE,
        page.current
      );
      setNotification([...notification, ...response.result?.notifications]);
      setHasNext(response.result?.hasNext);
    } catch (err) {
      console.log(err);
    } finally {
      systemStore.setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    page.current = 1;
    try {
      const response = await serviceApis.getNotifications(
        PAGE_SIZE,
        page.current
      );
      setNotification(response.result?.notifications);
      setHasNext(response.result?.hasNext);
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  };
  const landing = useCallback((item) => {
    if (item.landingUrl == 'walking_history') {
      Navigator.reset({ tab: 1 }, 'home_tabs', 'walking_tab', 'walking_home');
    }
  }, []);

  return (
    <Container
      header={true}
      paddingHorizontal={0}
      headerPaddingTop={0}
      bgColor={COLORS.light}
    >
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {!!notification &&
          (notification.length > 0 ? (
            <>
              {notification?.map((item) => (
                <NotificationItem key={item.id} item={item} onPress={landing} />
              ))}
              {hasNext && (
                <Pressable style={styles.more} onPress={getNextData}>
                  <MaterialIcons
                    name="expand-more"
                    size={28}
                    color={COLORS.dark}
                    style={{ marginRight: 5 }}
                  />
                  <CustomText fontSize={16}>more</CustomText>
                </Pressable>
              )}
            </>
          ) : (
            <View style={styles.notExistWrap}>
              <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={16}>
                Notifications does not exist.
              </CustomText>
            </View>
          ))}
      </ScrollView>
    </Container>
  );
};

export default MyNotificationView;

const styles = StyleSheet.create({
  more: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    backgroundColor: COLORS.white,
  },
  notExistWrap: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
