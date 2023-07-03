import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Container from '../../components/layouts/Container'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const MyPageHomeView = () => {
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <Container outerElementHeight={tabBarHeight}>
      <Text>MypageView</Text>
    </Container>
  )
}

export default MyPageHomeView;

const styles = StyleSheet.create({})