import { Feather, FontAwesome } from '@expo/vector-icons';
import React, { useCallback, useRef, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import AutoHeightImage from 'react-native-auto-height-image';
import { COLORS } from '../../commons/colors';
import { FONT_WEIGHT, COMMUNITY_CONTENT_TYPE } from '../../commons/constants';
import { utils } from '../../utils/Utils';
import CustomText from '../elements/CustomText';
import ProfileImage from '../modules/ProfileImage';
import CommunityOptionModal from './CommunityOptionModal';

const window = Dimensions.get('window');

const CommentItem = ({
  item,
  onUserProfilePress = () => {},
  openImageViewer = () => {},
  paddingLeft = 0,
  onReplyPress = () => {},
}) => {
  const communityOptionModalRef = useRef(null);
  const [isRemoved, setIsRemoved] = useState(item.removedYn);
  const [isBlocked, setIsBlocked] = useState(item.blockedYn);
  const onMenuPress = useCallback(() => {
    communityOptionModalRef.current.openModal(true);
  }, []);

  return (
    <View style={styles.comment}>
      <Pressable
        style={styles.profileWrap}
        onPress={() => {
          onUserProfilePress(item?.userId);
        }}
      >
        <ProfileImage
          uri={utils.pathToUri(item?.profileImgPath)}
          style={styles.profileImg}
        />

        <View style={styles.profile}>
          <View>
            <CustomText fontSize={14} fontWeight={FONT_WEIGHT.BOLD}>
              {item?.nickname}
            </CustomText>
            <CustomText
              fontSize={13}
              style={{ marginTop: 3 }}
              fontWeight={FONT_WEIGHT.BOLD}
              fontColor={COLORS.gray}
            >
              {utils.calculateDateAgo(item?.createdDate)}
            </CustomText>
          </View>
          {!isRemoved && !isBlocked && (
            <Pressable onPress={onMenuPress} hitSlop={10}>
              <Feather name="more-vertical" size={20} color={COLORS.dark} />
            </Pressable>
          )}
        </View>
      </Pressable>
      <View style={styles.content}>
        {(isRemoved || isBlocked || !!item.content) && (
          <CustomText
            fontSize={14}
            fontColor={!isRemoved && !isBlocked ? COLORS.dark : COLORS.gray}
          >
            {isRemoved
              ? 'This comment has been deleted.'
              : isBlocked
              ? 'This comment has been deleted by administrator.'
              : item.content}
          </CustomText>
        )}
        {!isRemoved && !isBlocked && !!item.imgPath && (
          <View
            style={{
              marginTop: !!item.content ? 15 : 0,
            }}
          >
            <Pressable
              style={styles.contentImg}
              onPress={() => {
                openImageViewer([utils.pathToUri(item.imgPath)], 0);
              }}
            >
              <AutoHeightImage
                source={{
                  uri: utils.pathToUri(item.imgPath),
                }}
                width={window.width - 30 - paddingLeft}
              />
            </Pressable>
          </View>
        )}
      </View>
      {!isRemoved && !isBlocked && (
        <>
          <Pressable
            style={styles.reply}
            hitSlop={5}
            onPress={() => {
              onReplyPress({
                nickname: item.nickname,
                replayId: !!item.parentCommentId
                  ? item.parentCommentId
                  : item.commentId,
              });
            }}
          >
            <FontAwesome
              name="reply"
              size={16}
              color={COLORS.gray}
              style={{ marginRight: 5 }}
            />
            <CustomText
              fontSize={12}
              fontWeight={FONT_WEIGHT.BOLD}
              fontColor={COLORS.gray}
            >
              Reply
            </CustomText>
          </Pressable>
        </>
      )}
      <CommunityOptionModal
        modalRef={communityOptionModalRef}
        type={COMMUNITY_CONTENT_TYPE.COMMENT}
        postId={item.postId}
        commentId={item.commentId}
        userId={item.userId}
        onRemove={() => {
          setIsRemoved(true);
        }}
      />
    </View>
  );
};

export default CommentItem;

const styles = StyleSheet.create({
  comment: {
    flex: 1,
    marginVertical: 15,
  },
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
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  content: {
    paddingVertical: 15,
    paddingLeft: 50,
  },
  contentImg: {},
  reply: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
