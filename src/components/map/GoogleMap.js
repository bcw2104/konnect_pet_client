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
    if (!defaultRegion) return;
    setRegion({
      latitude: defaultRegion.latitude,
      longitude: defaultRegion.longitude,
      latitudeDelta: latitudeDelta,
      longitudeDelta: longitudeDelta,
    });
  }, [defaultRegion]);

  return (
    <>
      {!!region && (
        <MapView
          customMapStyle={mapStyle}
          ref={mapRef}
          region={region}
          provider={PROVIDER_GOOGLE}
          style={{ width: width, height: height, ...style }}
          onRegionChange={onRegionChange}
          onMapReady={onMapReady}
          showsUserLocation={userLocation}
          showsMyLocationButton={false}
          showsIndoors={false}
          showsBuildings={true}
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

const mapStyle =[
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
];