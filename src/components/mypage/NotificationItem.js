import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import CustomText from '../elements/CustomText';
import moment from 'moment';
import { FONT_WEIGHT } from '../../commons/constants';
import { COLORS } from '../../commons/colors';
import { Foundation } from '@expo/vector-icons';

const NotificationItem = ({ item,onPress }) => {

  return (
    <Pressable
      key={item.notiId}
      style={styles.notiItem}
      onPress={() => {
        onPress(item);
      }}
    >
      <View style={styles.notiHeader}>
        <View style={styles.notiCategory}>
          <CustomText
            fontWeight={FONT_WEIGHT.BOLD}
            fontColor={COLORS.main}
            fontSize={14}
          >
            {item.categoryName}
          </CustomText>
          {!item.visitedYn && (
            <Foundation
              name="burst-new"
              size={22}
              color={COLORS.main}
              style={{ marginLeft: 5 }}
            />
          )}
        </View>
        <CustomText
          fontSize={14}
          fontWeight={FONT_WEIGHT.BOLD}
          fontColor={COLORS.gray}
        >
          {moment(item.createdDate).format('YYYY.MM.DD')}
        </CustomText>
      </View>
      <View>
        <CustomText
          fontWeight={FONT_WEIGHT.BOLD}
          fontSize={16}
          style={{ marginBottom: 7 }}
        >
          {item.title}
        </CustomText>
        <CustomText fontSize={14}>{item.content}</CustomText>
      </View>
    </Pressable>
  );
};

export default memo(NotificationItem);

const styles = StyleSheet.create({
  notiItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 3,
    backgroundColor: COLORS.white,
  },
  notiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  notiCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
