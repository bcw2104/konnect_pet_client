import { StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import { FONT_WEIGHT } from '../../commons/constants';
import CustomText from '../elements/CustomText';
import { COLORS } from '../../commons/colors';
import moment from 'moment';

const PointHistoryItem = ({ item }) => {
  return (
    <View key={item.id} style={styles.historyItem}>
      <View>
        <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={16}>
          {item.historyTypeName}
        </CustomText>
        <CustomText
          fontSize={12}
          fontWeight={FONT_WEIGHT.BOLD}
          fontColor={COLORS.gray}
          style={{ marginTop: 5 }}
        >
          {moment(item.createdDate).format('YYYY.MM.DD')}
        </CustomText>
      </View>
      <View>
        <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={16}>
          {item.balance}
          {item.pointTypeSymbol}
        </CustomText>
      </View>
    </View>
  );
};

export default memo(PointHistoryItem);

const styles = StyleSheet.create({
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 3,
    backgroundColor: COLORS.white,
  },
});
