import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Container from '../../components/layouts/Container';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import CustomText from '../../components/elements/CustomText';
import { COLORS } from '../../commons/colors';
import { FONT_WEIGHT } from '../../commons/constants';
import { serviceApis } from '../../utils/ServiceApis';
import { useStores } from '../../contexts/StoreContext';
import { MaterialIcons } from '@expo/vector-icons';
import PointHistoryItem from '../../components/mypage/PointHistoryItem';

const PAGE_SIZE = 20;
const TAB_TYPE = {
  first: 'plus',
  second: 'minus',
};

const MyPointHistoryView = (props) => {
  const { route } = props;

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: '적립 내역' },
    { key: 'second', title: '사용 내역' },
  ]);

  const FirstRoute = useCallback(
    () => (
      <PointHist type={TAB_TYPE.first} pointType={route.params.pointType} />
    ),
    []
  );
  const SecondRoute = useCallback(
    () => (
      <PointHist type={TAB_TYPE.second} pointType={route.params.pointType} />
    ),
    []
  );

  return (
    <Container
      header={true}
      paddingHorizontal={0}
      headerPaddingTop={0}
      bgColor={COLORS.light}
    >
      <TabView
        lazy
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={{ backgroundColor: '#fff', paddingVertical: 5 }}
            renderLabel={({ route, focused, color }) => (
              <CustomText
                fontWeight={FONT_WEIGHT.BOLD}
                fontSize={17}
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

const PointHist = (props) => {
  const { type, pointType } = props;

  const { systemStore } = useStores();
  const page = useRef(1);
  const [refreshing, setRefreshing] = useState(false);

  const [history, setHistory] = useState(null);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      systemStore.setIsLoading(true);
      try {
        const response = await serviceApis.getPointHistories(
          pointType,
          type,
          PAGE_SIZE,
          page.current
        );
        setHistory(response.result?.histories);
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
      const response = await serviceApis.getPointHistories(
        pointType,
        type,
        PAGE_SIZE,
        page.current
      );

      setHistory([...history, ...response.result?.histories]);
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
      const response = await serviceApis.getPointHistories(
        pointType,
        type,
        PAGE_SIZE,
        page.current
      );
      setHistory(response.result?.histories);
      setHasNext(response.result?.hasNext);
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
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
              <PointHistoryItem key={item.id} item={item} />
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
              History does not exist.
            </CustomText>
          </View>
        ))}
    </ScrollView>
  );
};

export default MyPointHistoryView;

const styles = StyleSheet.create({
  more: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    backgroundColor: COLORS.white,
  },
});
