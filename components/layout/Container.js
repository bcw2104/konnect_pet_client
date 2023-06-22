import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useStores } from '../../contexts/StoreContext';
import { useHeaderHeight } from '@react-navigation/elements';

const Container = ({ outerElementHeight = 0,children }) => {
  const { systemStore } = useStores();
  const headerHeight = useHeaderHeight();

  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
          marginTop: systemStore.statusBarHeight,
          minHeight:
            systemStore.winHeight -
            systemStore.statusBarHeight -
            headerHeight -
            outerElementHeight,
        }}
      >
        {children}
      </View>
    </ScrollView>
  );
};

export default Container;
