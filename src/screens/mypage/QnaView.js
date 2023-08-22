import { StyleSheet, View, RefreshControl, ScrollView } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Container from '../../components/layouts/Container';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { COLORS } from '../../commons/colors';
import { FONT_WEIGHT } from '../../commons/constants';
import CustomText from '../../components/elements/CustomText';
import { serviceApis } from '../../utils/ServiceApis';
import { useStores } from '../../contexts/StoreContext';
import MoreButton from '../../components/elements/MoreButton';
import QnaItem from '../../components/mypage/QnaItem';
import { Navigator } from '../../navigations/Navigator';

const PAGE_SIZE = 20;
const TAB_TYPE = {
  first: 'unanswered',
  second: 'answered',
};

const QnaView = (props) => {
  const { route } = props;

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Unanswered' },
    { key: 'second', title: 'Answered' },
  ]);

  useEffect(() => {
    if (!!route.params?.tab) {
      setIndex(route.params.tab);
    }
  }, [route.params]);

  const FirstRoute = useCallback(
    () => <QnaListView type={TAB_TYPE.first} />,
    []
  );
  const SecondRoute = useCallback(
    () => <QnaListView type={TAB_TYPE.second} />,
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

export default QnaView;

const QnaListView = ({ type }) => {
  const [qna, setQna] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const { systemStore } = useStores();
  const page = useRef(1);
  const [refreshing, setRefreshing] = useState(false);

  const getData = async (init) => {
    try {
      const response = await serviceApis.getQnas(type, PAGE_SIZE, page.current);
      if (init) {
        setQna(response.result?.qnas);
      } else {
        setQna([...qna, ...response.result?.qnas]);
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

  const goToDetail = useCallback((id) => {
    Navigator.navigate({ qnaId: id }, 'qna_detail');
  }, []);

  return (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {!!qna &&
        (qna.length > 0 ? (
          <>
            {qna?.map((item) => (
              <QnaItem key={item.qnaId} item={item} onPress={goToDetail} />
            ))}
            {hasNext && <MoreButton onPress={getNextData} />}
          </>
        ) : (
          <View style={styles.notExistWrap}>
            <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={16}>
              {type == "unanswered" ? "Question" : "Answered question"} does not exist.
            </CustomText>
          </View>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  section1: {
    flex: 1,
    paddingHorizontal: 20,
  },
  submitTheme: { borderRadius: 0 },
  notExistWrap: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
