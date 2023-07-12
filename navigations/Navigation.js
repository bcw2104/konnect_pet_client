import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import WalkingHomeView from '../screens/walking/WalkingHomeView';
import { useStores } from '../contexts/StoreContext';
import { observer } from 'mobx-react-lite';
import { navigationRef } from './Navigator';
import AuthStackNavigator from './stacks/AuthStackNavigator';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import COLORS from '../commons/colors';
import MyPageStackNavigator from './stacks/MyPageStackNavigator';
import WalkingStackNavigator from './stacks/WalkingStackNavigator';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.white,
  },
};

const Navigation = () => {
  const { userStore, systemStore } = useStores();
  return (
    <NavigationContainer ref={navigationRef} theme={navTheme}>
      {userStore.isLogin ? (
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: {
              display: systemStore.displayTabBar ? 'flex' : 'none',
              height: Platform.OS == 'ios' ? 100 : 75,
            },
            tabBarLabelStyle: {
              fontSize: 16,
              marginTop: 0,
              fontFamily: 'Roboto',
              fontWeight: 'bold',
              height: 30,
            },
          }}
        >
          <Tab.Screen
            name="walking_tab"
            component={WalkingStackNavigator}
            options={{
              headerShown: false,
              tabBarLabel: 'Walking',
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="pets" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="mypage_tab"
            component={MyPageStackNavigator}
            options={{
              headerShown: false,
              tabBarLabel: 'My Page',
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="person" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      ) : (
        <AuthStackNavigator />
      )}
    </NavigationContainer>
  );
};
export default observer(Navigation);
