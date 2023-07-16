import { StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useStores } from '../../contexts/StoreContext';

const GoogleMap = ({
  mapRef,
  defaultRegion = 'residence',
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
  const { userStore } = useStores();
  const [region, setRegion] = useState(null);

  useEffect(() => {
    if (!defaultRegion) return;

    if (defaultRegion === 'residence') {
      const residenceCoords = userStore.residenceCoords;
      setRegion({
        latitude: residenceCoords?.lat || 14.552,
        longitude: residenceCoords?.lng || 121.047,
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
  }, [defaultRegion]);

  return (
    <>
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
    </>
  );
};

export default GoogleMap;

const styles = StyleSheet.create({
  container: {},
});
