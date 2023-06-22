import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomButton from '../components/elements/CustomButton';
import { useStores } from '../contexts/StoreContext';

const HomeView = () => {
  const { userStore } = useStores();
  return (
    <View>
      <Text>HomeView</Text>
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
