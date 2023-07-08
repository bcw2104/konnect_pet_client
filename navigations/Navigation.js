import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import WalkingHomeView from '../screens/walking/WalkingHomeView';
import { useStores } from '../contexts/StoreContext';
import { observer } from 'mobx-react-lite';
import { navigationRef } from './Navigator';
import AuthStackNavigator from './stacks/AuthStackNavigator';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import colors from '../commons/colors';
import MyPageStackNavigator from './stacks/MyPageStackNavigator';

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.white,
  },
};

const Navigation = () => {
  const { userStore } = useStores();
  return (
    <NavigationContainer ref={navigationRef} theme={navTheme}>
      {userStore.isLogin ? (
        <Tab.Navigator>
          <Tab.Screen
            name='walking_tab'
            component={WalkingHomeView}
            options={{
              headerShown: false,
              tabBarLabel: 'Walking',
            }}
          />
          <Tab.Screen
            name='mypage_tab'
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
