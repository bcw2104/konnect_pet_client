import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Container from '../../components/layouts/Container';
import CustomText from '../../components/elements/CustomText';
import COLORS from '../../commons/colors';
import { FONT_WEIGHT } from '../../commons/constants';
import moment from 'moment';
import serviceApis from '../../utils/ServiceApis';
import { Foundation } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useStores } from '../../contexts/StoreContext';

const PAGE_SIZE = 20;

const MyNotificationView = () => {
  const [notification, setNotification] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const { systemStore } = useStores();
  const page = useRef(1);

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

  const goToLocation = (item) => {
    console.log(item);
  };

  return (
    <Container
      header={true}
      paddingHorizontal={0}
      headerPaddingTop={0}
      bgColor={COLORS.light}
    >
      <ScrollView style={{ flex: 1 }}>
        {!!notification &&
          (notification.length > 0 ? (
            <>
              {notification?.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.notificationWrap}
                  onPress={() => {
                    goToLocation(item);
                  }}
                >
                  <View style={styles.notificationHeader}>
                    <View style={styles.notificationCategory}>
                      <CustomText
                        fontWeight={FONT_WEIGHT.BOLD}
                        fontColor={COLORS.mainDeep}
                        fontSize={14}
                      >
                        {item.categoryName}
                      </CustomText>
                      {!item.visitedYn && (
                        <Foundation
                          name="burst-new"
                          size={22}
                          color={COLORS.mainDeep}
                          style={{ marginLeft: 5 }}
                        />
                      )}
                    </View>
                    <CustomText
                      fontSize={14}
                      fontWeight={FONT_WEIGHT.BOLD}
                      fontColor={COLORS.gray}
                      style={{ marginTop: 3 }}
                    >
                      {moment(item.createdDate).format('YYYY.MM.DD')}
                    </CustomText>
                  </View>
                  <View style={styles.notificationBody}>
                    <CustomText
                      fontWeight={FONT_WEIGHT.BOLD}
                      fontSize={16}
                      style={{ marginBottom: 5 }}
                    >
                      {item.title}
                    </CustomText>
                    <CustomText fontSize={14}>{item.content}</CustomText>
                  </View>
                </Pressable>
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
  summaryWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  notificationWrap: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 3,
    backgroundColor: COLORS.white,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  notificationCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notExistWrap: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  more: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    backgroundColor: COLORS.white,
  },
});
