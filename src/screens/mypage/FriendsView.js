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
import { PROCESS_STATUS_CODE } from '../../commons/codes';

const FriendsView = (props) => {
  const { route } = props;

  const [refreshFriend, setRefreshFriend] = useState(0);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Friends' },
    { key: 'second', title: 'Requests' },
  ]);

  useEffect(() => {
    if (!!route.params?.tab) {
      setIndex(route.params.tab);
    }
  }, [route.params]);

  const FirstRoute = useCallback(() => <Friends />, [refreshFriend]);
  const SecondRoute = useCallback(
    () => <RequestedFriends setRefreshFriend={setRefreshFriend} />,
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

const Friends = () => {
  const { systemStore } = useStores();
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const originFriends = useRef(null);
  const [friends, setFriends] = useState(null);

  const getData = async () => {
    try {
      const response = await serviceApis.getFriends();
      originFriends.current = response.result?.friends;
      filtering(search);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      systemStore.setIsLoading(true);
      await getData();
      systemStore.setIsLoading(false);
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
    await getData();
    setRefreshing(false);
  };

  const onHandleReply = async (toUserId, code) => {
    systemStore.setIsLoading(true);
    try {
      const response = await serviceApis.replyFriend(toUserId, code);

      if (response.rsp_code != '1000') {
        await getData();
      } else {
        originFriends.current = originFriends.current.filter(
          (ele) => ele.userId != toUserId
        );
        filtering();
      }
    } catch (error) {
    } finally {
      systemStore.setIsLoading(false);
    }
  };

  return (
    <View style={styles.section1}>
      <View style={styles.searchWrap}>
        <CustomInput
          value={search}
          maxLength={15}
          onValueChange={handleSearch}
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
            <FriendItem
              key={item.friendId}
              item={item}
              type={'request'}
              onHandleReply={onHandleReply}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const RequestedFriends = ({ setRefreshFriend }) => {
  const { systemStore } = useStores();
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const originRequest = useRef(null);
  const originRequested = useRef(null);
  const [request, setRequest] = useState(null);
  const [requested, setRequested] = useState(null);

  const getData = async () => {
    try {
      const response = await serviceApis.getPendingFriends();
      originRequest.current = response.result?.request;
      originRequested.current = response.result?.requested;

      filtering(search);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      systemStore.setIsLoading(true);
      await getData();
      systemStore.setIsLoading(false);
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
    await getData();
    setRefreshing(false);
  };

  const onHandleReply = async (toUserId, code) => {
    systemStore.setIsLoading(true);
    try {
      const response = await serviceApis.replyFriend(toUserId, code);

      if (response.rsp_code != '1000') {
        await getData();
      } else {
        if (code == PROCESS_STATUS_CODE.PERMITTED) {
          setRefreshFriend((prev) => (prev += 1));
        }
        originRequest.current = originRequest.current.filter(
          (ele) => ele.userId != toUserId
        );
        originRequested.current = originRequested.current.filter(
          (ele) => ele.userId != toUserId
        );
        filtering();
      }
    } catch (error) {
    } finally {
      systemStore.setIsLoading(false);
    }
  };

  return (
    <View style={styles.section1}>
      <View style={styles.searchWrap}>
        <CustomInput
          value={search}
          maxLength={15}
          onValueChange={handleSearch}
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
            <FriendItem
              key={item.friendId}
              item={item}
              type={'request'}
              onHandleReply={onHandleReply}
            />
          ))}
          <CustomText
            fontSize={16}
            fontWeight={FONT_WEIGHT.BOLD}
            style={styles.title}
          >
            Requested ({requested?.length})
          </CustomText>
          {requested?.map((item) => (
            <FriendItem
              key={item.friendId}
              item={item}
              type={'requested'}
              onHandleReply={onHandleReply}
            />
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
    marginTop: 20,
    paddingHorizontal: 20,
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
  title: {
    marginVertical: 20,
  },
});
