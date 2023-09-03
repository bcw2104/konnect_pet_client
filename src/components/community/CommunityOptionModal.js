import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomBottomModal from '../elements/CustomBottomModal';
import CustomText from '../elements/CustomText';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../commons/colors';
import { FONT_WEIGHT, COMMUNITY_CONTENT_TYPE } from '../../commons/constants';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { serviceApis } from '../../utils/ServiceApis';
import { useStores } from '../../contexts/StoreContext';
import { observer } from 'mobx-react-lite';

const CommunityOptionModal = ({
  modalRef,
  type,
  onRemove = () => {},
  postId,
  commentId,
  userId,
}) => {
  const { userStore } = useStores();

  const handleReport = async () => {
    const targetId = type == COMMUNITY_CONTENT_TYPE.POST ? postId : commentId;
    try {
      const response = await serviceApis.report(targetId, type);
      let message = 'A report has been filed.';
      if (response.rsp_code == '9600') {
        message = response.rsp_msg_detail;
      }

      Toast.show({
        type: 'success',
        text1: message,
      });
    } catch (err) {
    } finally {
      modalRef.current.closeModal();
    }
  };
  const handleRemove = async () => {
    try {
      let message = '';
      if (type == COMMUNITY_CONTENT_TYPE.POST) {
        const response = await serviceApis.removePost(postId);
        message = 'Post have been deleted.';
      } else {
        const response = await serviceApis.removeComment(postId, commentId);
        message = 'Comment have been deleted.';
      }
      onRemove();
      Toast.show({
        type: 'success',
        text1: message,
      });
    } catch (err) {
    } finally {
      modalRef.current.closeModal();
    }
  };
  const handleClose = () => {
    modalRef.current.closeModal();
  };
  return (
    <CustomBottomModal ref={modalRef}>
      <View style={styles.menuWrap}>
        {userId == userStore.userId ? (
          <>
            {type == COMMUNITY_CONTENT_TYPE.POST ? <></> : <></>}
            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                {
                  backgroundColor: pressed ? COLORS.lightDeep : COLORS.white,
                },
              ]}
              onPress={handleRemove}
            >
              <Ionicons
                name="trash-outline"
                size={24}
                color={COLORS.danger}
                style={{ marginRight: 7 }}
              />
              <CustomText
                fontSize={15}
                fontWeight={FONT_WEIGHT.BOLD}
                fontColor={COLORS.danger}
              >
                Remove
              </CustomText>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                {
                  backgroundColor: pressed ? COLORS.lightDeep : COLORS.white,
                },
              ]}
              onPress={handleReport}
            >
              <MaterialCommunityIcons
                name="alarm-light"
                size={24}
                color={COLORS.danger}
                style={{ marginRight: 7 }}
              />
              <CustomText
                fontSize={15}
                fontWeight={FONT_WEIGHT.BOLD}
                fontColor={COLORS.danger}
              >
                Report
              </CustomText>
            </Pressable>
          </>
        )}
        <Pressable
          style={({ pressed }) => [
            styles.menuItem,
            {
              backgroundColor: pressed ? COLORS.lightDeep : COLORS.white,
            },
          ]}
          onPress={handleClose}
        >
          <CustomText
            fontSize={15}
            fontWeight={FONT_WEIGHT.BOLD}
            fontColor={COLORS.dark}
          >
            Cancel
          </CustomText>
        </Pressable>
      </View>
    </CustomBottomModal>
  );
};

export default observer(CommunityOptionModal);

const styles = StyleSheet.create({
  menuWrap: {},
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
});
