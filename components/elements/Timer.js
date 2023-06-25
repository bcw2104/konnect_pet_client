import {  Text } from 'react-native';
import React from 'react';
import moment from 'moment';

const Timer = ({ remain = 0, style = {} }) => {
  return (
    <Text style={style}>
      {`${moment.duration(remain, 's').minutes()}:${(
        '00' + moment.duration(remain, 's').seconds()
      )?.slice(-2)}`}
    </Text>
  );
};

export default Timer;
