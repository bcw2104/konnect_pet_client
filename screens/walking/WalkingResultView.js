import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Container from '../../components/layouts/Container';
import { useTabBarHandler } from '../../hooks/useTabBarHandler';

const WalkingResultView = () => {
  useTabBarHandler();
  return (
    <Container header={true}>
      <Text>WalkingResultView</Text>
    </Container>
  );
};

export default WalkingResultView;

const styles = StyleSheet.create({});
