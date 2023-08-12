import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomText from '../elements/CustomText';
import CustomButton from '../elements/CustomButton';
import { COLORS } from '../../commons/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { FONT_WEIGHT } from '../../commons/constants';
import Timer from '../elements/Timer';
import { utils } from '../../utils/Utils';

const WalkingDashboard = ({
  seconds = 0,
  meters = 0,
  onPress,
  type = 'start',
}) => {
  return (
    <>
      <View style={styles.dashboard}>
        <View style={{ alignItems: 'center' }}>
          <Timer remain={seconds} fontWeight={FONT_WEIGHT.BOLD} fontSize={16} />
          <CustomText
            fontSize={15}
            fontColor={COLORS.grayDeep}
            style={{ marginTop: 5 }}
          >
            시간
          </CustomText>
        </View>
        <CustomButton
          bgColor={COLORS.main}
          bgColorPress={COLORS.mainDeep}
          render={
            type == 'start' ? (
              <MaterialIcons name="play-arrow" size={30} color={COLORS.white} />
            ) : (
              <MaterialIcons name="pause" size={30} color={COLORS.white} />
            )
          }
          fontColor={COLORS.white}
          onPress={onPress}
          width={60}
          height={60}
          style={{
            borderRadius: 30,
          }}
        />
        <View style={{ alignItems: 'center' }}>
          <CustomText fontWeight={FONT_WEIGHT.BOLD}>
            {utils.toFormatNumber(meters)} m
          </CustomText>
          <CustomText
            fontSize={15}
            fontColor={COLORS.grayDeep}
            style={{ marginTop: 5 }}
          >
            거리
          </CustomText>
        </View>
      </View>
    </>
  );
};

export default WalkingDashboard;

const styles = StyleSheet.create({
  dashboard: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
});
