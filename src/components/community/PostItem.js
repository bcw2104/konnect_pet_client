import { Feather, FontAwesome } from '@expo/vector-icons';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { COLORS } from '../../commons/colors';
import { FONT_WEIGHT } from '../../commons/constants';
import { Navigator } from '../../navigations/Navigator';
import { serviceApis } from '../../utils/ServiceApis';
import { utils } from '../../utils/Utils';
import CustomText from '../elements/CustomText';
import ProfileImage from '../modules/ProfileImage';
import ReportModal from './ReportModal';

const PostItem = ({ item, onUserProfilePress, openImageViewer }) => {
  const [lockLike, setLockLike] = useState(false);
  const [postLike, setPostLike] = useState(false);
  const [postLikeCount, setPostLikeCount] = useState(0);

  const reportModal = useRef(null);

  useEffect(() => {
    setPostLike(item.likeYn);
    setPostLikeCount(item.likeCount);
  }, [item]);

  const onMenuPress = useCallback(() => {
    reportModal.current.openModal(true);
  }, []);

  const handlePostLike = async () => {
    if (lockLike) return;
    setLockLike(true);
    const likeYn = !postLike;
    try {
      const response = await serviceApis.changePostLike(item.postId, likeYn);
      setPostLike(likeYn);
      setPostLikeCount((prev) => (likeYn ? prev + 1 : prev - 1));
    } catch (e) {
      console.log(e);
    } finally {
      setLockLike(false);
    }
  };

  const goToDetail = () => {
    Navigator.navigate({ postId: item.postId }, 'community_nav', 'post_detail');
  };

  return (
    <Pressable style={styles.post} key={item.postId} onPress={goToDetail}>
      <View style={{ marginBottom: 10 }}>
        <CustomText
          fontSize={15}
          fontColor={COLORS.main}
          fontWeight={FONT_WEIGHT.BOLD}
        >
          {item?.category}
        </CustomText>
      </View>
      <Pressable
        style={styles.postProfile}
        onPress={() => {
          onUserProfilePress(item.userId);
        }}
      >
        <ProfileImage
          uri={utils.pathToUri(item.profileImgPath)}
          style={styles.profileImg}
        />
        <View style={styles.profile}>
          <View>
            <CustomText fontSize={15} fontWeight={FONT_WEIGHT.BOLD}>
              {item?.nickname}
            </CustomText>

            <CustomText
              fontSize={13}
              style={{ marginTop: 3 }}
              fontWeight={FONT_WEIGHT.BOLD}
              fontColor={COLORS.gray}
            >
              {utils.calculateDateAgo(item.createdDate)}
            </CustomText>
          </View>

          <Pressable onPress={onMenuPress} hitSlop={10}>
            <Feather name='more-vertical' size={20} color={COLORS.dark} />
          </Pressable>
        </View>
      </Pressable>
      <View style={styles.postContent}>
        {item.filePaths.length > 0 && (
          <View style={styles.contentImgWrap}>
            {item.filePaths.map((path, idx) => {
              if (idx == 0) {
                return (
                  <Pressable
                    style={styles.contentImg}
                    key={idx}
                    onPress={() => {
                      openImageViewer(
                        [
                          ...item.filePaths?.map((path) =>
                            utils.pathToUri(path)
                          ),
                        ],
                        0
                      );
                    }}
                  >
                    <Image
                      source={{ uri: utils.pathToUri(path) }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode='cover'
                    />
                  </Pressable>
                );
              } else if (idx == 1) {
                return (
                  <Pressable
                    style={[styles.contentImg, { marginLeft: 7 }]}
                    key={idx}
                    onPress={() => {
                      openImageViewer(
                        [
                          ...item.filePaths?.map((path) =>
                            utils.pathToUri(path)
                          ),
                        ],
                        1
                      );
                    }}
                  >
                    <Image
                      source={{ uri: utils.pathToUri(path) }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode='cover'
                    />
                    {item.filePaths.length >= 3 && (
                      <View
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          backgroundColor: COLORS.semiTransparentDark,
                          width: '100%',
                          height: '100%',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CustomText
                          fontSize={24}
                          fontWeight={FONT_WEIGHT.BOLD}
                          fontColor={COLORS.white}
                        >
                          +{item.filePaths.length - 2}
                        </CustomText>
                      </View>
                    )}
                  </Pressable>
                );
              } else {
                return <View key={idx}></View>;
              }
            })}
          </View>
        )}
        <View style={styles.content}>
          <CustomText
            fontSize={15}
            style={{ marginTop: 5, lineHeight: 20 }}
            numberOfLines={4}
            ellipsizeMode={'tail'}
          >
            {item.content}
          </CustomText>
          <CustomText
            fontSize={15}
            fontWeight={FONT_WEIGHT.BOLD}
            fontColor={COLORS.gray}
            style={{ marginTop: 5 }}
          >
            More
          </CustomText>
        </View>
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
          <CustomText fontSize={15}>{item.commentCount}</CustomText>
        </View>
      </View>

      <ReportModal modalRef={reportModal} userId={item.userId} />
    </Pressable>
  );
};

export default memo(PostItem);

const styles = StyleSheet.create({
  post: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginBottom: 10,
  },
  postProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postContent: {
    paddingVertical: 15,
  },
  contentImgWrap: {
    flexDirection: 'row',

    marginBottom: 10,
  },
  contentImg: {
    flex: 1,
    height: 250,
  },
  content: {},
  postInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postInfoItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
});
