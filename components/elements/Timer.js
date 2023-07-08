import React from 'react';
import moment from 'moment';
import CustomText from './CustomText';

const Timer = ({ remain = 0, style = {} }) => {
  return (
    <CustomText style={style}>
      {`${moment.duration(remain, 's').minutes()}:${(
        '00' + moment.duration(remain, 's').seconds()
      )?.slice(-2)}`}
    </CustomText>
  );
};

export default Timer;
