import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import { FONT_WEIGHT } from '../../commons/constants';
import CustomText from '../elements/CustomText';
import { COLORS } from '../../commons/colors';
import moment from 'moment';

const QnaItem = ({ item, onPress }) => {
  return (
    <Pressable
      key={item.qnaId}
      style={styles.qnaItem}
      onPress={() => {
        onPress(item.qnaId);
      }}
    >
      <View style={styles.qnaHeader}>
        <CustomText
          fontWeight={FONT_WEIGHT.BOLD}
          fontColor={COLORS.main}
          fontSize={14}
        >
          {item.categoryName}
        </CustomText>
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
          fontSize={14}
          style={{ marginBottom: 7 }}
          numberOfLines={2}
          ellipsizeMode={'tail'}
        >
          {item.title}
        </CustomText>
      </View>
    </Pressable>
  );
};

export default memo(QnaItem);

const styles = StyleSheet.create({
  qnaItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 3,
    backgroundColor: COLORS.white,
  },
  qnaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});
