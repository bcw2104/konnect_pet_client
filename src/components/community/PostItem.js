import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { memo, useState } from 'react';
import ProfileImage from '../modules/ProfileImage';
import CustomText from '../elements/CustomText';
import { COLORS } from '../../commons/colors';
import { FONT_WEIGHT } from '../../commons/constants';
import { utils } from '../../utils/Utils';
import { FontAwesome } from '@expo/vector-icons';
import { Navigator } from '../../navigations/Navigator';
import ImageViewer from '../elements/ImageViewer';
import { serviceApis } from '../../utils/ServiceApis';

const PostItem = ({ item, onUserProfilePress }) => {
  const [viewerIndex, setViewerIndex] = useState(0);
  const [openImageViewer, setOpenImageViewer] = useState(false);
  const [lockLike, setLockLike] = useState(false);
  const [postLike, setPostLike] = useState(item.likeYn);
  const [postLikeCount, setPostLikeCount] = useState(item.likeCount);

  const handleViewerClose = () => {
    setOpenImageViewer(false);
  };

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
    Navigator.navigate({ postId: item.postId }, 'post_detail');
  };
  return (
    <View style={styles.post} key={item.postId}>
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
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <CustomText fontSize={15} fontWeight={FONT_WEIGHT.BOLD}>
              {item?.nickname}
            </CustomText>
            <CustomText
              fontSize={15}
              fontColor={COLORS.main}
              fontWeight={FONT_WEIGHT.BOLD}
            >
              {item?.category}
            </CustomText>
          </View>
          <CustomText
            fontSize={12}
            style={{ marginTop: 3 }}
            fontWeight={FONT_WEIGHT.BOLD}
            fontColor={COLORS.gray}
          >
            {utils.calculateDateAgo(item.createdDate)}
          </CustomText>
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
                      setViewerIndex(0);
                      setOpenImageViewer(true);
                    }}
                  >
                    <Image
                      source={{ uri: utils.pathToUri(path) }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  </Pressable>
                );
              } else if (idx == 1) {
                return (
                  <Pressable
                    style={[styles.contentImg, { marginLeft: 7 }]}
                    key={idx}
                    onPress={() => {
                      setViewerIndex(1);
                      setOpenImageViewer(true);
                    }}
                  >
                    <Image
                      source={{ uri: utils.pathToUri(path) }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
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
          <Pressable>
            <CustomText
              fontSize={15}
              fontWeight={FONT_WEIGHT.BOLD}
              fontColor={COLORS.gray}
              style={{ marginTop: 5 }}
            >
              More
            </CustomText>
          </Pressable>
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
        <Pressable style={[styles.postInfoItem, { marginLeft: 15 }]}>
          <FontAwesome
            name="commenting-o"
            size={20}
            color={COLORS.dark}
            style={{ marginRight: 5 }}
          />
          <CustomText fontSize={15}>{item.commentCount}</CustomText>
        </Pressable>
      </View>
      {item.filePaths.length > 0 && (
        <ImageViewer
          index={viewerIndex}
          open={openImageViewer}
          handleClose={handleViewerClose}
          uris={[...item.filePaths.map((path) => utils.pathToUri(path))]}
        />
      )}
    </View>
  );
};

export default memo(PostItem);

const styles = StyleSheet.create({
  post: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  postProfile: {
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
