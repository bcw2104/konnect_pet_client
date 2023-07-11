import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const GoogleMap = ({
  mapRef,
  defaultRegion = null,
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
  const [region, setRegion] = useState(null);

  useEffect(() => {
    if (!defaultRegion) {
      setRegion({
        latitude: 0,
        longitude: 0,
        latitudeDelta: latitudeDelta,
        longitudeDelta: longitudeDelta,
      });
    } else {
      setRegion({
        latitude: defaultRegion.latitude,
        longitude: defaultRegion.longitude,
        latitudeDelta: latitudeDelta,
        longitudeDelta: longitudeDelta,
      });
    }
  }, []);

  return (
    <View style={styles.container}>
      {!!region && (
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
      )}
    </View>
  );
};

export default GoogleMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
