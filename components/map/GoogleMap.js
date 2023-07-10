import {  StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Toast from 'react-native-toast-message/lib/src/Toast';

const GoogleMap = ({
  mapRef,
  onRegionChange = () => {},
  onMapReady = () => {},
  userLocation = true,
  scrollEnabled = true,
  style = {},
  width = 'auto',
  height = 'auto',
  longitudeDelta,
  latitudeDelta,
  children,
}) => {
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: latitudeDelta,
    longitudeDelta: longitudeDelta,
  });

  const a = async () => {
    confirm('Are you sure you want to');
  };
  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setRegion({
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: latitudeDelta,
          longitudeDelta: longitudeDelta,
        });
      },
      (error) => {
        Toast.show({
          type: 'error',
          text1: '위치 정보를 가져울 수 없습니다.',
        });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        region={region}
        provider={PROVIDER_GOOGLE}
        style={{ width: width, height: height, ...style }}
        onRegionChange={onRegionChange}
        onMapReady={onMapReady}
        showsUserLocation={userLocation}
        followsUserLocation={userLocation}
        showsMyLocationButton={false}
        showsIndoors={false}
        showsBuildings={false}
        scrollEnabled={scrollEnabled}
        pitchEnabled={false}
        loadingEnabled={true}
        toolbarEnabled={false}
      >
        {children}
      </MapView>
    </View>
  );
};

export default GoogleMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
