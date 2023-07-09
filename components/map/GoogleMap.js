import { StyleSheet, View } from 'react-native';
import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useStores } from '../../contexts/StoreContext';

const GoogleMap = ({
  mapRef,
  region,
  onRegionChange=()=>{},
  onMapReady=()=>{},
  markers = [],
}) => {
  const { systemStore } = useStores();

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        region={region}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        width={systemStore.winWidth}
        height={systemStore.winHeight}
        onRegionChange={onRegionChange}
        onMapReady={onMapReady}
        showsUserLocation={true}
        followsUserLocation={true}
        showsMyLocationButton={false}
        showsIndoors={false}
      >
      </MapView>
    </View>
  );
};

export default GoogleMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {},
});
