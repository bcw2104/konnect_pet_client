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
import MoreButton from '../../components/elements/MoreButton';

const PAGE_SIZE = 20;
const TAB_TYPE = {
  first: 'plus',
  second: 'minus',
};

const MyPointHistoryView = (props) => {
  const { route } = props;

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Saved' },
    { key: 'second', title: 'Used' },
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
      bgColor={COLORS.containerGray}
    >
      <TabView
        lazy
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={{ backgroundColor: COLORS.white, paddingVertical: 5 }}
            renderLabel={({ route, focused, color }) => (
              <CustomText
                fontWeight={FONT_WEIGHT.BOLD}
                fontSize={16}
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

  const [histories, setHistories] = useState(null);
  const [hasNext, setHasNext] = useState(false);

  const getData = async (init) => {
    try {
      const response = await serviceApis.getPointHistories(
        pointType,
        type,
        PAGE_SIZE,
        page.current
      );
      if (init) {
        setHistories(response.result?.histories);
      } else {
        setHistories([...histories, ...response.result?.histories]);
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

  return (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {!!histories &&
        (histories.length > 0 ? (
          <>
            {histories?.map((item) => (
              <PointHistoryItem key={item.id} item={item} />
            ))}
            {hasNext && (
              <MoreButton onPress={getNextData} />
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
  notExistWrap: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
