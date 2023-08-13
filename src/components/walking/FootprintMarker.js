import { StyleSheet } from 'react-native';
import React, { memo } from 'react';
import { Marker } from 'react-native-maps';
import FootprintImage from '../modules/FootprintImage';
import { FOOTPRINT_TYPE } from '../../commons/constants';

const FootprintMarker = ({ userId, footprints, handleOpenFootprintDetail }) => {
  return (
    <>
      {Object.values(footprints)
        .filter((e) => e.userId == userId)
        .map((ele, idx) => (
          <Marker
            key={ele.id}
            coordinate={{
              latitude: ele.latitude,
              longitude: ele.longitude,
            }}
            onPress={() => {
              handleOpenFootprintDetail(ele.id);
            }}
          >
            <FootprintImage size={24} type={FOOTPRINT_TYPE.MINE} />
          </Marker>
        ))}
      {Object.values(footprints)
        .filter((e) => e.userId != userId && !e.catched)
        .map((ele, idx) => (
          <Marker
            key={ele.id}
            coordinate={{
              latitude: ele.latitude,
              longitude: ele.longitude,
            }}
            onPress={() => {
              handleOpenFootprintDetail(ele.id);
            }}
          >
            <FootprintImage size={24} type={FOOTPRINT_TYPE.OTHERS} />
          </Marker>
        ))}
      {Object.values(footprints)
        .filter((e) => e.userId != userId && e.catched)
        .map((ele, idx) => (
          <Marker
            key={ele.id}
            coordinate={{
              latitude: ele.latitude,
              longitude: ele.longitude,
            }}
            onPress={() => {
              handleOpenFootprintDetail(ele.id);
            }}
          >
            <FootprintImage size={24} type={FOOTPRINT_TYPE.CATCHED} />
          </Marker>
        ))}
    </>
  );
};

export default memo(FootprintMarker);

const styles = StyleSheet.create({});
