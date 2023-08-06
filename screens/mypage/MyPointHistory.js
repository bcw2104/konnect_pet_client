import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../components/layouts/Container';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import CustomText from '../../components/elements/CustomText';
import COLORS from '../../commons/colors';
import { FONT_WEIGHT } from '../../commons/constants';
import moment from 'moment';
import serviceApis from '../../utils/ServiceApis';
import { Feather } from '@expo/vector-icons';

const MyPointHistory = (props) => {
  const { route } = props;

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: '적립 내역' },
    { key: 'second', title: '사용 내역' },
  ]);
  const [history, setHistory] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await serviceApis.getPointHistory(
          route.params.pointType
        );

        setHistory({
          saved: response.result?.filter((ele) => ele.balance > 0),
          used: response.result?.filter((ele) => ele.balance < 0),
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  return (
    <Container
      header={true}
      paddingHorizontal={0}
      headerPaddingTop={0}
      bgColor={COLORS.light}
    >
      <View style={styles.summaryWrap}>
        <Feather
          name="alert-circle"
          size={20}
          color={COLORS.dangerDeep}
          style={{ marginRight: 5 }}
        />
        <CustomText fontColor={COLORS.danger} fontSize={14} fontWeight={FONT_WEIGHT.BOLD}>
          History is displayed up to 5 months ago.
        </CustomText>
      </View>
      <TabView
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
              backgroundColor: COLORS.warningDeep,
            }}
          />
        )}
        navigationState={{ index, routes }}
        renderScene={SceneMap({
          first: () => <PointHist items={history.saved} />,
          second: () => <PointHist items={history.used} />,
        })}
        onIndexChange={setIndex}
      />
    </Container>
  );
};

const PointHist = (props) => {
  const { items } = props;
  return (
    <ScrollView style={{ flex: 1 }}>
      {!!items && items.length > 0 ? (
        items?.map((item) => (
          <View key={item.id} style={styles.historyWrap}>
            <View>
              <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={16}>
                {item.historyTypeName}
              </CustomText>
              <CustomText
                fontSize={13}
                fontWeight={FONT_WEIGHT.BOLD}
                fontColor={COLORS.gray}
                style={{ marginTop: 3 }}
              >
                {moment(item.createdDate).format('YYYY.MM.DD')}
              </CustomText>
            </View>
            <View>
              <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={16}>
                {item.balance}
                {item.pointTypeSymbol}
              </CustomText>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.notExistWrap}>
          <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={16}>
            History does not exist.
          </CustomText>
        </View>
      )}
    </ScrollView>
  );
};

export default MyPointHistory;

const styles = StyleSheet.create({
  summaryWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  historyWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 3,
    backgroundColor: COLORS.white,
  },
  notExistWrap: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
