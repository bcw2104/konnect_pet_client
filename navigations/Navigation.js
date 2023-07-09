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

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.white,
  },
};

const Navigation = () => {
  const { userStore } = useStores();
  return (
    <NavigationContainer ref={navigationRef} theme={navTheme}>
      {userStore.isLogin ? (
        <Tab.Navigator>
          <Tab.Screen
            name="walking_tab"
            component={WalkingStackNavigator}
            options={{
              headerShown: false,
              tabBarLabel: 'Walking',
            }}
          />
          <Tab.Screen
            name="mypage_tab"
            component={MyPageStackNavigator}
            options={{
              headerShown: false,
              tabBarLabel: 'My Page',
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
