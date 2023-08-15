import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import CustomText from '../../components/elements/CustomText';
import { COLORS } from '../../commons/colors';
import { FONT_WEIGHT } from '../../commons/constants';
import Container from '../../components/layouts/Container';
import { serviceApis } from '../../utils/ServiceApis';
import { useStores } from '../../contexts/StoreContext';
import CustomInput from '../../components/elements/CustomInput';
import { FontAwesome } from '@expo/vector-icons';
import FriendItem from '../../components/mypage/FriendItem';

const FriendsView = (props) => {
  const { route } = props;

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Friends' },
    { key: 'second', title: 'Requests' },
  ]);

  const FirstRoute = useCallback(() => <Friends />, []);
  const SecondRoute = useCallback(() => <RequestedFriends />, []);

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

const Friends = () => {
  const { systemStore } = useStores();
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const originFriends = useRef(null);
  const [friends, setFriends] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      systemStore.setIsLoading(true);
      try {
        const response = await serviceApis.getFriends();
        originFriends.current = response.result?.friends;
        filtering(search);
      } catch (err) {
        console.log(err);
      } finally {
        systemStore.setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    filtering(value);
  };

  const filtering = (search) => {
    let friend = originFriends.current;
    if (!!search) {
      friend = friend.filter((ele) => ele.nickname.startsWith(search));
    }

    setFriends(friend);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await serviceApis.getFriends();
      originFriends.current = response.result?.friends;
      filtering(search);
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  };
  return (
    <View style={styles.section1}>
      <View style={styles.searchWrap}>
        <CustomInput
          value={search}
          maxLength={15}
          onValueChange={handleSearch}
          wrapperStyle={styles.input}
          placeholder="Please enter the nickname."
        />
        <FontAwesome
          name="search"
          style={styles.searchIcon}
          size={24}
          color={COLORS.dark}
        />
      </View>
      <View style={styles.friendsWrap}>
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <CustomText
            fontSize={16}
            fontWeight={FONT_WEIGHT.BOLD}
            style={styles.title}
          >
            Friends ({friends?.length})
          </CustomText>
          {friends?.map((item) => (
            <View>{item.userId}</View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const RequestedFriends = () => {
  const { systemStore } = useStores();
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const originRequest = useRef(null);
  const originRequested = useRef(null);
  const [request, setRequest] = useState(null);
  const [requested, setRequested] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      systemStore.setIsLoading(true);
      try {
        const response = await serviceApis.getPendingFriends();
        originRequest.current = response.result?.request;
        originRequested.current = response.result?.requested;

        filtering(search);
      } catch (err) {
        console.log(err);
      } finally {
        systemStore.setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
    filtering(value);
  };

  const filtering = (search) => {
    let request = originRequest.current;
    let requested = originRequested.current;
    if (!!search && search.length > 0) {
      request = request.filter((ele) => ele.nickname.startsWith(search));
      requested = requested.filter((ele) => ele.nickname.startsWith(search));
    }

    setRequest(request);
    setRequested(requested);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const response = await serviceApis.getFriends();
      originRequest.current = response.result?.request;
      originRequested.current = response.result?.requested;

      filtering(search);
    } catch (err) {
      console.log(err);
    } finally {
      setRefreshing(false);
    }
  };
  return (
    <View style={styles.section1}>
      <View style={styles.searchWrap}>
        <CustomInput
          value={search}
          maxLength={15}
          onValueChange={handleSearch}
          wrapperStyle={styles.input}
          placeholder="Please enter the nickname."
        />
        <FontAwesome
          name="search"
          style={styles.searchIcon}
          size={24}
          color={COLORS.dark}
        />
      </View>
      <View style={styles.friendsWrap}>
        <ScrollView
          style={{
            flex: 1,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <CustomText
            fontSize={16}
            fontWeight={FONT_WEIGHT.BOLD}
            style={styles.title}
          >
            Request ({request?.length})
          </CustomText>
          {request?.map((item) => (
            <FriendItem item={item} type={'request'} />
          ))}
          <CustomText
            fontSize={16}
            fontWeight={FONT_WEIGHT.BOLD}
            style={styles.title}
          >
            Requested ({requested?.length})
          </CustomText>
          {requested?.map((item) => (
            <View>
              <FriendItem item={item} type={'requested'} />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default FriendsView;

const styles = StyleSheet.create({
  section1: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  input: {
    marginTop: 10,
  },
  searchIcon: {
    position: 'absolute',
    right: 15,
    top: 20,
  },
  friendsWrap: {
    flex: 1,
    marginTop: 20,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    marginTop: 30,
    marginBottom: 20,
  },
});
