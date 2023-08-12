import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { memo } from 'react';
import CustomText from '../elements/CustomText';
import moment from 'moment';
import { FONT_WEIGHT } from '../../commons/constants';
import { COLORS } from '../../commons/colors';
import { Ionicons } from '@expo/vector-icons';
import Timer from '../elements/Timer';
import { utils } from '../../utils/Utils';

const WalkingHistoryItem = ({ item, onPress }) => {
  return (
    <Pressable style={styles.historyItem} onPress={onPress}>
      <View style={styles.dateTime}>
        <CustomText
          fontWeight={FONT_WEIGHT.BOLD}
          fontColor={COLORS.white}
          fontSize={15}
        >
          {moment(item.startDate).format('Do')}
        </CustomText>
        <CustomText
          fontWeight={FONT_WEIGHT.BOLD}
          fontColor={COLORS.white}
          fontSize={15}
        >
          {moment(item.startDate).format('ha')}
        </CustomText>
      </View>
      <View style={styles.history}>
        <View style={styles.historyData}>
          <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={18}>
            {utils.toFormatNumber(item.meters)}
          </CustomText>
          <CustomText
            fontWeight={FONT_WEIGHT.BOLD}
            fontSize={14}
            style={{
              position: 'relative',
              top: 2,
            }}
          >
            m
          </CustomText>
        </View>
        <View style={styles.historyData}>
          <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={18}>
          {utils.toFormatNumber(parseInt(item.seconds / 60))}
          </CustomText>
          <CustomText
            fontWeight={FONT_WEIGHT.BOLD}
            fontSize={14}
            style={{
              position: 'relative',
              top: 2,
            }}
          >
            min
          </CustomText>
        </View>
        <View style={styles.historyData}>
          <CustomText fontWeight={FONT_WEIGHT.BOLD} fontSize={18}>
            {utils.toFormatNumber(
              utils.calculateSpeed(item.meters, item.seconds)
            )}
          </CustomText>
          <CustomText
            fontWeight={FONT_WEIGHT.BOLD}
            fontSize={14}
            style={{
              position: 'relative',
              top: 2,
            }}
          >
            km/h
          </CustomText>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={28} color={COLORS.dark} />
    </Pressable>
  );
};

export default memo(WalkingHistoryItem);

const styles = StyleSheet.create({
  historyItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    alignItems: 'center',
  },
  dateTime: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  history: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  historyData: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
