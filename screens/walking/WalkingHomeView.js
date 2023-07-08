import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useStores } from '../../contexts/StoreContext';
import Container from '../../components/layouts/Container';
import GoogleMap from '../../components/map/GoogleMap';

const HomeView = () => {
  const { userStore } = useStores();

  return (
    <Container>
      <View style={styles.section1}>
        <GoogleMap />
      </View>
    </Container>
  );
};

export default HomeView;

const styles = StyleSheet.create({
  section1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
