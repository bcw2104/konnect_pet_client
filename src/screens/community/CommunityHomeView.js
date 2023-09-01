import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { COLORS } from '../../commons/colors';
import { FONT_WEIGHT } from '../../commons/constants';
import CategoryTab from '../../components/community/CategoryTab';
import PostItem from '../../components/community/PostItem';
import UserDetailModal from '../../components/community/UserDetailModal';
import CustomText from '../../components/elements/CustomText';
import ImageViewer from '../../components/elements/ImageViewer';
import Container from '../../components/layouts/Container';
import BannerSwiper from '../../components/service/BannerSwiper';
import { useStores } from '../../contexts/StoreContext';
import { Navigator } from '../../navigations/Navigator';
import { serviceApis } from '../../utils/ServiceApis';
import { utils } from '../../utils/Utils';

const PAGE_SIZE = 10;

const CommunityHomeView = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [posts, setPosts] = useState(null);
  const [communityData, setCommunityData] = useState({});
  const [tab, setTab] = useState(-1);
  const [hasNext, setHasNext] = useState(false);
  const { systemStore } = useStores();
  const page = useRef(1);
  const [refreshing, setRefreshing] = useState(false);
  const userDetailModalRef = useRef(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [viewerIndex, setViewerIndex] = useState(0);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);

  useEffect(() => {
    if (isFocused) {
      const fetchData = async () => {
        try {
          const response = await serviceApis.getCommunityData();
          const categories = [
            { category: 'All', categoryId: -1 },
            ...response.result.categories,
          ];
          response.result.categories = categories;
          setCommunityData(response.result);
          navigation.setOptions({
            headerRight: () => (
              <HeaderRight newNotiCount={response.result.newNotiCount} />
            ),
          });
          await getData(true, tab);
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

  const getData = async (init, id) => {
    try {
      const response = await serviceApis.getPosts(id, PAGE_SIZE, page.current);
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

  const handleTabChange = (tab) => {
    setTab(tab);
    getData(true, tab);
  };

  const getNextData = async () => {
    page.current += 1;
    await getData(false, tab);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    page.current = 1;
    await getData(true, tab);
    setRefreshing(false);
  };

  return (
    <Container
      header={true}
      bgColor={COLORS.containerGray}
      paddingHorizontal={0}
      headerPaddingTop={0}
    >
      <View style={styles.section1}>
        <View style={styles.categoryWrap}>
          <CategoryTab
            tab={tab}
            onTabCange={handleTabChange}
            categories={communityData.categories}
          />
        </View>
      </View>
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
        <BannerSwiper banners={communityData?.banners} />
        <View style={styles.section2}>
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
        </View>
      </ScrollView>
      <ImageViewer
        index={viewerIndex}
        open={imageViewerOpen}
        handleClose={handleViewerClose}
        uris={[...item.filePaths.map((path) => utils.pathToUri(path))]}
      />
      <UserDetailModal
        modalRef={userDetailModalRef}
        userId={selectedUserId}
        friendBtn={true}
      />
    </Container>
  );
};

const HeaderRight = ({ newNotiCount }) => {
  return (
    <View style={{ flexDirection: 'row', paddingRight: 15 }}>
      <Pressable
        onPress={() => {
          Navigator.navigate({}, 'mypage_nav', 'notification_history');
        }}
        hitSlop={5}
        style={({ pressed }) => [
          {
            paddingHorizontal: 5,
            marginRight: 10,
            backgroundColor: pressed ? COLORS.lightDeep : COLORS.white,
          },
        ]}
      >
        <Ionicons name='notifications-outline' size={24} color={COLORS.dark} />
        {newNotiCount > 0 && (
          <View style={styles.notiLabel}>
            <CustomText
              fontColor={COLORS.white}
              fontWeight={FONT_WEIGHT.BOLD}
              fontSize={11}
            >
              {newNotiCount}
            </CustomText>
          </View>
        )}
      </Pressable>
      <Pressable
        onPress={() => {
          Navigator.navigate({}, 'mypage_nav', 'setting');
        }}
        hitSlop={5}
        style={({ pressed }) => [
          {
            paddingHorizontal: 5,
            backgroundColor: pressed ? COLORS.lightDeep : COLORS.white,
          },
        ]}
      >
        <Ionicons name='settings-outline' size={24} color={COLORS.dark} />
      </Pressable>
    </View>
  );
};

export default CommunityHomeView;

const styles = StyleSheet.create({
  notiLabel: {
    position: 'absolute',
    right: -7,
    bottom: -5,
    backgroundColor: COLORS.dangerLight,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  section1: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
  },
  section2: {},
  categoryWrap: {
    paddingVertical: 10,
  },

  notExistWrap: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
