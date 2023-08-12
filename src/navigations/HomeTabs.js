import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import WalkingTabStackNavigator from './stacks/WalkingTabStackNavigator';
import MyPageTabStackNavigator from './stacks/MyPageTabStackNavigator';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import { useStores } from '../contexts/StoreContext';
import {COLORS} from '../commons/colors';

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  const { systemStore } = useStores();

  return (
    <Tab.Navigator
      initialRouteName="walking_tab"
      screenOptions={{
        tabBarActiveTintColor: COLORS.main,
        tabBarStyle: {
          display: systemStore.displayTabBar ? 'flex' : 'none',
          position: 'relative',
        },
        tabBarLabelStyle: {
          position: 'relative',
          top: 0,
          fontSize: 12,
          fontFamily: 'Maple-Bold',
          paddingBottom: 5,
        },
        tabBarIconStyle: {
          position: 'relative',
          top: 4,
        },
      }}
    >
      <Tab.Screen
        name="walking_tab"
        component={WalkingTabStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Walking',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="pets" size={20} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="mypage_tab"
        component={MyPageTabStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'My Page',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={20} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default observer(HomeTabs);

const styles = StyleSheet.create({});
