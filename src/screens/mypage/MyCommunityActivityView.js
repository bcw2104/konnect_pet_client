import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { COLORS } from '../../commons/colors';
import { FONT_WEIGHT } from '../../commons/constants';
import PostItem from '../../components/community/PostItem';
import UserDetailModal from '../../components/community/UserDetailModal';
import CustomText from '../../components/elements/CustomText';
import ImageViewer from '../../components/elements/ImageViewer';
import Container from '../../components/layouts/Container';
import { serviceApis } from '../../utils/ServiceApis';
import { utils } from '../../utils/Utils';
import Hr from '../../components/elements/Hr';
import CommentItem from '../../components/community/CommentItem';

const PAGE_SIZE = 20;
const TAB_TYPE = {
  first: 'posts',
  second: 'comments',
  third: 'likes',
};

const MyCommunityActivityView = (props) => {
  const { route } = props;

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Posts' },
    { key: 'second', title: 'Comments' },
    { key: 'third', title: 'Likes' },
  ]);

  useEffect(() => {
    if (!!route.params?.tab) {
      setIndex(route.params.tab);
    }
  }, [route.params]);

  const FirstRoute = useCallback(() => <MyPosts />, []);
  const SecondRoute = useCallback(() => <MyComments />, []);

  const ThirdRoute = useCallback(() => <MyPostLikes />, []);
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
          third: ThirdRoute,
        })}
        onIndexChange={setIndex}
      />
    </Container>
  );
};

const MyPosts = () => {
  const isFocused = useIsFocused();
  const [posts, setPosts] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const page = useRef(1);
  const [refreshing, setRefreshing] = useState(false);
  const userDetailModalRef = useRef(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [viewerIndex, setViewerIndex] = useState(0);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState([]);

  useEffect(() => {
    if (isFocused) {
      page.current = 1;
      const fetchData = async () => {
        try {
          await getData(true);
        } catch (error) {}
      };
      fetchData();
    }
  }, [isFocused]);

  const openImageViewer = useCallback((images, index = 0) => {
    setViewerIndex(index);
    setImageViewerOpen(true);
    setViewerImages(images);
  }, []);

  const handleViewerClose = () => {
    setImageViewerOpen(false);
  };

  const onUserProfilePress = useCallback((userId) => {
    setSelectedUserId(userId);
    userDetailModalRef.current.openModal(true);
  }, []);

  const getData = async (init) => {
    try {
      const response = await serviceApis.getMyPosts(PAGE_SIZE, page.current);
      if (init) {
        setPosts(response.result?.posts);
      } else {
        setPosts([...posts, ...response.result?.posts]);
      }
      setHasNext(response.result?.hasNext);
    } catch (err) {
      console.log(err);
    }
  };

  const getNextData = async () => {
    page.current += 1;
    await getData(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    page.current = 1;
    await getData(true);
    setRefreshing(false);
  };

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScrollEndDrag={({ nativeEvent }) => {
          if (utils.isCloseToBottom(nativeEvent) && hasNext) {
            getNextData();
          }
        }}
      >
        {!!posts &&
          (posts.length > 0 ? (
            <>
              {posts.map((item) => (
                <PostItem
                  key={item.postId}
                  item={item}
                  onUserProfilePress={onUserProfilePress}
                  openImageViewer={openImageViewer}
                />
              ))}
            </>
          ) : (
            <View style={styles.notExistWrap}>
              <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={15}>
                The post does not exist.
              </CustomText>
            </View>
          ))}
      </ScrollView>
      <ImageViewer
        index={viewerIndex}
        open={imageViewerOpen}
        handleClose={handleViewerClose}
        uris={viewerImages}
      />
      <UserDetailModal
        modalRef={userDetailModalRef}
        userId={selectedUserId}
        friendBtn={true}
      />
    </>
  );
};

const MyComments = () => {
  const isFocused = useIsFocused();
  const [comments, setComments] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const page = useRef(1);
  const [refreshing, setRefreshing] = useState(false);
  const userDetailModalRef = useRef(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [viewerIndex, setViewerIndex] = useState(0);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState([]);

  useEffect(() => {
    if (isFocused) {
      page.current = 1;
      const fetchData = async () => {
        try {
          await getData(true);
        } catch (error) {}
      };
      fetchData();
    }
  }, [isFocused]);

  const openImageViewer = useCallback((images, index = 0) => {
    setViewerIndex(index);
    setImageViewerOpen(true);
    setViewerImages(images);
  }, []);

  const handleViewerClose = () => {
    setImageViewerOpen(false);
  };

  const onUserProfilePress = useCallback((userId) => {
    setSelectedUserId(userId);
    userDetailModalRef.current.openModal(true);
  }, []);

  const getData = async (init) => {
    try {
      const response = await serviceApis.getMyComments(PAGE_SIZE, page.current);
      if (init) {
        setComments(response.result?.comments);
      } else {
        setComments([...comments, ...response.result?.comments]);
      }
      setHasNext(response.result?.hasNext);
    } catch (err) {
      console.log(err);
    }
  };

  const getNextData = async () => {
    page.current += 1;
    await getData(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    page.current = 1;
    await getData(true);
    setRefreshing(false);
  };

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScrollEndDrag={({ nativeEvent }) => {
          if (utils.isCloseToBottom(nativeEvent) && hasNext) {
            getNextData();
          }
        }}
        style={{
          backgroundColor: COLORS.white,
          paddingHorizontal: 15,
        }}
      >
        {!!comments &&
          (comments.length > 0 ? (
            <>
              {comments.map((item) => (
                <View key={item.commentId}>
                  <Hr />
                  <CommentItem
                    item={item}
                    onUserProfilePress={onUserProfilePress}
                    openImageViewer={openImageViewer}
                    paddingLeft={50}
                  />
                </View>
              ))}
            </>
          ) : (
            <View style={styles.notExistWrap}>
              <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={15}>
                Comment does not exist.
              </CustomText>
            </View>
          ))}
      </ScrollView>
      <ImageViewer
        index={viewerIndex}
        open={imageViewerOpen}
        handleClose={handleViewerClose}
        uris={viewerImages}
      />
      <UserDetailModal
        modalRef={userDetailModalRef}
        userId={selectedUserId}
        friendBtn={true}
      />
    </>
  );
};

const MyPostLikes = () => {
  const isFocused = useIsFocused();
  const [posts, setPosts] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const page = useRef(1);
  const [refreshing, setRefreshing] = useState(false);
  const userDetailModalRef = useRef(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [viewerIndex, setViewerIndex] = useState(0);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState([]);

  useEffect(() => {
    if (isFocused) {
      page.current = 1;
      const fetchData = async () => {
        try {
          await getData(true);
        } catch (error) {}
      };
      fetchData();
    }
  }, [isFocused]);

  const openImageViewer = useCallback((images, index = 0) => {
    setViewerIndex(index);
    setImageViewerOpen(true);
    setViewerImages(images);
  }, []);

  const handleViewerClose = () => {
    setImageViewerOpen(false);
  };

  const onUserProfilePress = useCallback((userId) => {
    setSelectedUserId(userId);
    userDetailModalRef.current.openModal(true);
  }, []);

  const getData = async (init) => {
    try {
      const response = await serviceApis.getMyPostLikes(
        PAGE_SIZE,
        page.current
      );
      if (init) {
        setPosts(response.result?.posts);
      } else {
        setPosts([...posts, ...response.result?.posts]);
      }
      setHasNext(response.result?.hasNext);
    } catch (err) {
      console.log(err);
    }
  };

  const getNextData = async () => {
    page.current += 1;
    await getData(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    page.current = 1;
    await getData(true);
    setRefreshing(false);
  };

  return (
    <>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScrollEndDrag={({ nativeEvent }) => {
          if (utils.isCloseToBottom(nativeEvent) && hasNext) {
            getNextData();
          }
        }}
      >
        {!!posts &&
          (posts.length > 0 ? (
            <>
              {posts.map((item) => (
                <PostItem
                  key={item.postId}
                  item={item}
                  onUserProfilePress={onUserProfilePress}
                  openImageViewer={openImageViewer}
                />
              ))}
            </>
          ) : (
            <View style={styles.notExistWrap}>
              <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={15}>
                The liked post does not exist.
              </CustomText>
            </View>
          ))}
      </ScrollView>
      <ImageViewer
        index={viewerIndex}
        open={imageViewerOpen}
        handleClose={handleViewerClose}
        uris={viewerImages}
      />
      <UserDetailModal
        modalRef={userDetailModalRef}
        userId={selectedUserId}
        friendBtn={true}
      />
    </>
  );
};

export default MyCommunityActivityView;

const styles = StyleSheet.create({
  notExistWrap: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
