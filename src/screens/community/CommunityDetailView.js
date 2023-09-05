import { Feather, FontAwesome, AntDesign } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import { COLORS } from '../../commons/colors';
import { FONT_WEIGHT, COMMUNITY_CONTENT_TYPE } from '../../commons/constants';
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
import CommunityOptionModal from '../../components/community/CommunityOptionModal';
import ImageUploader from '../../components/modules/ImageUploader';

const PAGE_SIZE = 10;

const window = Dimensions.get('window');

const CommunityDetailView = (props) => {
  const { route } = props;
  const { systemStore, modalStore } = useStores();

  const page = useRef(1);
  const [post, setPost] = useState({});

  const [comments, setComments] = useState(null);
  const [hasNext, setHasNext] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState([]);
  const userDetailModalRef = useRef(null);
  const communityOptionModalRef = useRef(null);
  const imageUploaderRef = useRef(null);

  const [reply, setReply] = useState(null);
  const commentInputRef = useRef(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [lockLike, setLockLike] = useState(false);
  const [postLike, setPostLike] = useState(false);
  const [postLikeCount, setPostLikeCount] = useState(0);

  const [myComment, setMyComment] = useState('');
  const [myCommentImage, setMyCommentImage] = useState(null);

  const [isRemoved, setIsRemoved] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      getPost();
      getData(true);
    };
    fetchData();
  }, []);

  const resetMyComment = () => {
    setMyComment('');
    setMyCommentImage(null);
    setReply(null);
    commentInputRef.current.blur();
  };
  const getPost = async () => {
    try {
      const response = await serviceApis.getPost(route.params.postId);
      setPost(response.result);
      setPostLike(response.result.likeYn);
      setPostLikeCount(response.result.likeCount);
      setIsRemoved(response.result.removedYn);
      setIsBlocked(response.result.blockedYn);
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
    page.current = 1;
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

  const onMenuPress = useCallback(() => {
    communityOptionModalRef.current.openModal(true);
  }, []);

  const onReplyPress = useCallback((reply) => {
    setReply(reply);
    commentInputRef.current.focus();
  }, []);

  const handleImageChange = (image) => {
    setMyCommentImage(image.uri);
    commentInputRef.current.focus();
  };

  const saveComment = async () => {
    const valid = !!myComment || !!myCommentImage;

    if (!valid) {
      modalStore.openOneButtonModal(
        'Please enter the contents.',
        'Confirm',
        () => {}
      );
      return;
    }

    try {
      let imagePath = null;
      systemStore.setIsLoading(true);
      if (!!myCommentImage) {
        try {
          const uploadPath = await utils.uploadImage(
            myCommentImage,
            '/api/v1/upload/images/community/comment'
          );
          imagePath = uploadPath;
        } catch (err) {
          console.log(err);
        }
      }
      const response = await serviceApis.saveComment(post.postId, {
        content: myComment,
        imagePath: imagePath,
        parentId: reply ? reply.replayId : null,
      });
      resetMyComment();
      getData(true);
    } catch (err) {
      console.log(err);
    } finally {
      systemStore.setIsLoading(false);
    }
  };
  return (
    <Container header={true} headerPaddingTop={0}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScrollEndDrag={({ nativeEvent }) => {
          if (utils.isCloseToBottom(nativeEvent) && hasNext) {
            getNextData();
          }
        }}
      >
        <View
          style={{
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          <CustomText
            fontSize={15}
            fontColor={COLORS.main}
            fontWeight={FONT_WEIGHT.BOLD}
          >
            {post?.category}
          </CustomText>
        </View>
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
            <View>
              <CustomText fontSize={15} fontWeight={FONT_WEIGHT.BOLD}>
                {post?.nickname}
              </CustomText>
              <CustomText
                fontSize={13}
                style={{ marginTop: 3 }}
                fontWeight={FONT_WEIGHT.BOLD}
                fontColor={COLORS.gray}
              >
                {utils.calculateDateAgo(post?.createdDate)}
              </CustomText>
            </View>
            {!isRemoved && !isBlocked && (
              <Pressable onPress={onMenuPress} hitSlop={10}>
                <Feather name='more-vertical' size={20} color={COLORS.dark} />
              </Pressable>
            )}
          </View>
        </Pressable>
        <View style={styles.postContent}>
          <View style={styles.content}>
            <CustomText
              fontSize={15}
              style={{ marginTop: 5, lineHeight: 20 }}
              fontColor={!isRemoved && !isBlocked ? COLORS.dark : COLORS.gray}
            >
              {isRemoved
                ? 'This post has been deleted.'
                : isBlocked
                ? 'This post has been deleted by administrator.'
                : post?.content}
            </CustomText>
          </View>
          {!isRemoved &&
            !isBlocked &&
            !!post?.filePaths &&
            post?.filePaths.length > 0 && (
              <View style={styles.contentImgWrap}>
                {post?.filePaths?.map((path, idx) => (
                  <Pressable
                    style={styles.contentImg}
                    key={idx}
                    onPress={() => {
                      openImageViewer(
                        [
                          ...post?.filePaths.map((path) =>
                            utils.pathToUri(path)
                          ),
                        ],
                        idx
                      );
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
                        onReplyPress={onReplyPress}
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
                            onReplyPress={onReplyPress}
                          />
                        </View>
                      ))}
                    </View>
                  ))}
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

        <CommunityOptionModal
          modalRef={communityOptionModalRef}
          type={COMMUNITY_CONTENT_TYPE.POST}
          postId={post.postId}
          userId={post.userId}
          onRemove={() => {
            setIsRemoved(true);
          }}
        />
      </ScrollView>
      <CustomKeyboardAvoidingView>
        {myCommentImage && (
          <View
            style={{
              paddingVertical: 20,
              backgroundColor: COLORS.dark,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Pressable
              onPress={() => {
                setMyCommentImage(null);
              }}
              style={{ position: 'absolute', top: 10, right: 10 }}
            >
              <AntDesign name='closecircleo' size={24} color={COLORS.white} />
            </Pressable>
            <AutoHeightImage
              source={{ uri: myCommentImage }}
              width={window.width / 2}
            />
          </View>
        )}
        {reply && (
          <View
            style={{
              paddingTop: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <CustomText
              fontWeight={FONT_WEIGHT.BOLD}
              fontSize={14}
              fontColor={COLORS.gray}
            >
              @ {reply.nickname}
            </CustomText>
            <Pressable
              onPress={() => {
                setReply(null);
              }}
            >
              <AntDesign name='closecircleo' size={24} color={COLORS.gray} />
            </Pressable>
          </View>
        )}
        <View style={styles.myCommentWrap}>
          <ImageUploader
            onImageChange={handleImageChange}
            ref={imageUploaderRef}
          >
            <Pressable
              onPress={() => {
                imageUploaderRef.current.pickImage();
              }}
              style={{ marginRight: 5 }}
            >
              <Feather name='image' size={30} color={COLORS.grayDeep} />
            </Pressable>
          </ImageUploader>
          <CustomInput
            value={myComment}
            maxLength={800}
            height={'auto'}
            maxHeight={200}
            onValueChange={setMyComment}
            wrapperStyle={styles.commentInput}
            placeholder='Comment'
            multiline={true}
            textAlignVertical={'center'}
            outline={true}
            innerRef={commentInputRef}
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
            disabled={!myComment && !myCommentImage}
            onPress={saveComment}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 20,
  },
  commentInput: {
    flex: 1,
    paddingRight: 5,
  },
  commentBtn: {},
  notExistWrap: {
    marginVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
