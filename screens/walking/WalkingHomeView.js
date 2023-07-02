import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomButton from '../../components/elements/CustomButton';
import { useStores } from '../../contexts/StoreContext';
import CustomText from '../../components/elements/CustomText';
import Container from '../../components/layout/Container';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const HomeView = () => {
  const { userStore } = useStores();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <Container outerElementHeight={tabBarHeight}>
      <CustomText>HomeView</CustomText>
      <CustomButton
        text='logout'
        onPress={() => {
          userStore.logout();
        }}
      />
    </Container>
  );
};

export default HomeView;

const styles = StyleSheet.create({});
