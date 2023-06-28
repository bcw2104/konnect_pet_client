import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomButton from '../components/elements/CustomButton';
import { useStores } from '../contexts/StoreContext';
import CustomText from '../components/elements/CustomText';

const HomeView = () => {
  const { userStore } = useStores();
  return (
    <View>
      <CustomText>HomeView</CustomText>
      <CustomButton
        text='logout'
        onPress={() => {
          userStore.logout();
        }}
      />
    </View>
  );
};

export default HomeView;

const styles = StyleSheet.create({});
