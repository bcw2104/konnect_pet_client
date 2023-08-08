import { StyleSheet } from 'react-native';
import React, { memo } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Marker } from 'react-native-maps';

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
            <MaterialCommunityIcons name="dog" size={24} color="blue" />
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
            <MaterialCommunityIcons name="dog" size={24} color="black" />
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
            <MaterialCommunityIcons name="dog" size={24} color="red" />
          </Marker>
        ))}
    </>
  );
};

export default memo(FootprintMarker);

const styles = StyleSheet.create({});
