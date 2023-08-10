import React from 'react';
import moment from 'moment';
import CustomText from './CustomText';
import { FONT_FAMILY, FONT_WEIGHT } from '../../commons/constants';

const Timer = ({
  remain = 0,
  style = {},
  fontFamily,
  fontWeight,
  fontColor,
  fontSize,
}) => {
  var toHHMMSS = (secs) => {
    var sec_num = parseInt(secs, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor(sec_num / 60) % 60;
    var seconds = sec_num % 60;

    return [hours, minutes, seconds]
      .map((v) => (v < 10 ? '0' + v : v))
      .filter((v, i) => v !== '00' || i > 0)
      .join(':');
  };

  return (
    <CustomText
      style={style}
      fontFamily={fontFamily}
      fontWeight={fontWeight}
      fontColor={fontColor}
      fontSize={fontSize}
    >
      {toHHMMSS(remain)}
    </CustomText>
  );
};

export default Timer;
