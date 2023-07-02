import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useStores } from '../../contexts/StoreContext';
import { useHeaderHeight } from '@react-navigation/elements';
import colors from '../../commons/colors';

const Container = ({ outerElementHeight = 0, children }) => {
  const { systemStore } = useStores();
  const headerHeight = useHeaderHeight();

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 15,
        marginTop: systemStore.statusBarHeight,
      }}
    >
      {children}
    </View>
  );
};

export default Container;
