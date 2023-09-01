import { FontAwesome, Feather } from '@expo/vector-icons';
import React, { useCallback, useRef } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { FONT_WEIGHT } from '../../commons/constants';
import CustomText from '../elements/CustomText';
import ProfileImage from '../modules/ProfileImage';
import { COLORS } from '../../commons/colors';
import AutoHeightImage from 'react-native-auto-height-image';
import { utils } from '../../utils/Utils';
import CustomBottomModal from '../elements/CustomBottomModal';
import ReportModal from './ReportModal';

const window = Dimensions.get('window');

const CommentItem = ({
  item,
  onUserProfilePress,
  openImageViewer,
  paddingLeft = 0,
}) => {
  const reportModal = useRef(null);

  const onMenuPress = useCallback(() => {
    reportModal.current.openModal(true);
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

          <Pressable onPress={onMenuPress} hitSlop={10}>
            <Feather name='more-vertical' size={20} color={COLORS.dark} />
          </Pressable>
        </View>
      </Pressable>
      <View style={styles.content}>
        <CustomText fontSize={14}>{item.content}</CustomText>
        {!!item.imgPath && (
          <View style={styles.contentImgWrap}>
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
      <Pressable
        style={styles.reply}
        onPress={() => {
          onUserProfilePress(post?.userId);
        }}
      >
        <FontAwesome
          name='reply'
          size={18}
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
      <ReportModal modalRef={reportModal} userId={item.userId} />
    </View>
  );
};

export default CommentItem;

const styles = StyleSheet.create({
  comment: {
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
  contentImgWrap: {
    marginTop: 15,
  },
  contentImg: {},
  reply: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
