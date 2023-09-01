import { Feather, FontAwesome } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import { COLORS } from '../../commons/colors';
import { FONT_WEIGHT } from '../../commons/constants';
import CommentItem from '../../components/community/CommentItem';
import UserDetailModal from '../../components/community/UserDetailModal';
import CustomButton from '../../components/elements/CustomButton';
import CustomInput from '../../components/elements/CustomInput';
import CustomKeyboardAvoidingView from '../../components/elements/CustomKeyboardAvoidingView';
import CustomText from '../../components/elements/CustomText';
import Hr from '../../components/elements/Hr';
import ImageViewer from '../../components/elements/ImageViewer';
import Container from '../../components/layouts/Container';
import ProfileImage from '../../components/modules/ProfileImage';
import { useStores } from '../../contexts/StoreContext';
import { serviceApis } from '../../utils/ServiceApis';
import { utils } from '../../utils/Utils';

const PAGE_SIZE = 10;

const window = Dimensions.get('window');

const CommunityDetailView = (props) => {
  const { route } = props;
  const { systemStore } = useStores();

  const page = useRef(1);
  const [post, setPost] = useState({});

  const [comments, setComments] = useState(null);
  const [hasNext, setHasNext] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState([]);
  const userDetailModalRef = useRef(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [lockLike, setLockLike] = useState(false);
  const [postLike, setPostLike] = useState(false);
  const [postLikeCount, setPostLikeCount] = useState(0);

  const [myComment, setMyComment] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      getPost();
      getData(true);
    };
    fetchData();
  }, []);

  const getPost = async () => {
    try {
      const response = await serviceApis.getPost(route.params.postId);
      setPost(response.result);
      setPostLike(response.result.likeYn);
      setPostLikeCount(response.result.likeCount);
    } catch (err) {
      console.log(err);
    }
  };
  const getData = async (init) => {
    try {
      const response = await serviceApis.getComments(
        route.params.postId,
        PAGE_SIZE,
        page.current
      );
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
    systemStore.setIsLoading(true);
    await getData(false);
    systemStore.setIsLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getData(true);
    setRefreshing(false);
  };

  const onUserProfilePress = useCallback((userId) => {
    setSelectedUserId(userId);
    userDetailModalRef.current.openModal(true);
  }, []);

  const handleViewerClose = () => {
    setImageViewerOpen(false);
  };
  const handlePostLike = async () => {
    if (lockLike) return;
    setLockLike(true);
    const likeYn = !postLike;
    try {
      const response = await serviceApis.changePostLike(
        route.params.postId,
        likeYn
      );
      setPostLike(likeYn);
      setPostLikeCount((prev) => (likeYn ? prev + 1 : prev - 1));
    } catch (e) {
      console.log(e);
    } finally {
      setLockLike(false);
    }
  };

  const openImageViewer = useCallback((images, index = 0) => {
    setViewerIndex(index);
    setImageViewerOpen(true);
    setViewerImages(images);
  }, []);

  return (
    <Container header={true} headerPaddingTop={0}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Pressable
          style={styles.profileWrap}
          onPress={() => {
            onUserProfilePress(post?.userId);
          }}
        >
          <ProfileImage
            uri={utils.pathToUri(post?.profileImgPath)}
            style={styles.profileImg}
          />
          <View style={styles.profile}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <CustomText fontSize={15} fontWeight={FONT_WEIGHT.BOLD}>
                {post?.nickname}
              </CustomText>
              <CustomText
                fontSize={14}
                fontColor={COLORS.main}
                fontWeight={FONT_WEIGHT.BOLD}
              >
                {post?.category}
              </CustomText>
            </View>
            <CustomText
              fontSize={13}
              style={{ marginTop: 3 }}
              fontWeight={FONT_WEIGHT.BOLD}
              fontColor={COLORS.gray}
            >
              {utils.calculateDateAgo(post?.createdDate)}
            </CustomText>
          </View>
        </Pressable>
        <View style={styles.postContent}>
          <View style={styles.content}>
            <CustomText fontSize={15} style={{ marginTop: 5, lineHeight: 20 }}>
              {post?.content}
            </CustomText>
          </View>
          {!!post?.filePaths && post?.filePaths.length > 0 && (
            <View style={styles.contentImgWrap}>
              {post?.filePaths?.map((path, idx) => (
                <Pressable
                  style={styles.contentImg}
                  key={idx}
                  onPress={() => {
                    openImageViewer([
                      ...post?.filePaths.map((path) => utils.pathToUri(path)),
                    ]);
                  }}
                >
                  <AutoHeightImage
                    source={{ uri: utils.pathToUri(path) }}
                    width={window.width - 30}
                  />
                </Pressable>
              ))}
            </View>
          )}
        </View>
        <View style={styles.postInfo}>
          <Pressable style={styles.postInfoItem} onPress={handlePostLike}>
            <FontAwesome
              name={postLike ? 'heart' : 'heart-o'}
              size={20}
              color={postLike ? COLORS.danger : COLORS.dark}
              style={{ marginRight: 5 }}
            />
            <CustomText fontSize={15}>{postLikeCount}</CustomText>
          </Pressable>
          <View style={[styles.postInfoItem, { marginLeft: 15 }]}>
            <FontAwesome
              name='commenting-o'
              size={20}
              color={COLORS.dark}
              style={{ marginRight: 5 }}
            />
            <CustomText fontSize={15}>{post.commentCount}</CustomText>
          </View>
        </View>
        <View style={styles.commentWrap}>
          {!!comments &&
            (comments.length > 0 ? (
              <>
                {comments
                  ?.filter((item) => !item.parentCommentId)
                  .map((item) => (
                    <View key={item.commentId}>
                      <Hr />
                      <CommentItem
                        item={item}
                        onUserProfilePress={onUserProfilePress}
                        openImageViewer={openImageViewer}
                        paddingLeft={50}
                      />
                      {item.childrens?.map((child) => (
                        <View
                          key={child.commentId}
                          style={{ flexDirection: 'row' }}
                        >
                          <View
                            style={{
                              width: 50,
                              height: 42,
                              alignItems: 'flex-end',
                              justifyContent: 'flex-end',
                            }}
                          >
                            <Feather
                              name='corner-down-right'
                              size={20}
                              color={COLORS.dark}
                              style={{ paddingRight: 10 }}
                            />
                          </View>
                          <CommentItem
                            item={child}
                            onUserProfilePress={onUserProfilePress}
                            openImageViewer={openImageViewer}
                            paddingLeft={100}
                          />
                        </View>
                      ))}
                    </View>
                  ))}
                {hasNext && <MoreButton onPress={getNextData} />}
              </>
            ) : (
              <>
                <Hr />
                <View style={styles.notExistWrap}>
                  <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={15}>
                    Comment does not exist.
                  </CustomText>
                </View>
              </>
            ))}
        </View>
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
      </ScrollView>
      <CustomKeyboardAvoidingView>
        <View style={styles.myCommentWrap}>
          <CustomInput
            value={myComment}
            maxLength={800}
            height={'auto'}
            onValueChange={setMyComment}
            wrapperStyle={styles.commentInput}
            placeholder='Comment'
            multiline={true}
            textAlignVertical={'center'}
          />
          <CustomButton
            fontWeight={FONT_WEIGHT.BOLD}
            fontColor={COLORS.white}
            bgColor={COLORS.main}
            bgColorPress={COLORS.mainDeep}
            wrapperStyle={styles.commentBtn}
            width={70}
            height={'100%'}
            fontSize={14}
            disabled={!myComment}
            onPress={() => {}}
            render={
              <Feather
                name='send'
                size={20}
                color={COLORS.white}
                style={{ marginRight: 5 }}
              />
            }
          />
        </View>
      </CustomKeyboardAvoidingView>
    </Container>
  );
};

export default CommunityDetailView;

const styles = StyleSheet.create({
  profileWrap: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile: {
    flex: 1,
  },
  profileImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  postContent: {
    paddingVertical: 15,
  },
  contentImgWrap: {
    marginTop: 15,
  },
  contentImg: {
    width: '100%',
    marginVertical: 5,
  },
  postInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  postInfoItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  commentWrap: {},

  myCommentWrap: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    paddingVertical: 20,
  },
  commentInput: {
    flex: 1,
    paddingRight: 5,
  },
  commentBtn: {},
  notExistWrap: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
