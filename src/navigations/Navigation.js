import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { useStores } from '../contexts/StoreContext';
import { navigationRef } from './Navigator';
import AuthStackNavigator from './stacks/AuthStackNavigator';
import COLORS from '../commons/colors';
import HomeTabs from './HomeTabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyPageStackNavigator from './stacks/MyPageStackNavigator';
import WalkingStackNavigator from './stacks/WalkingStackNavigator';
import { observer } from 'mobx-react-lite';
import { useBackPressHandler } from '../hooks/useBackPressHandler';

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.white,
  },
};

const Stack = createNativeStackNavigator();

const Navigation = () => {
  useBackPressHandler();

  const { userStore } = useStores();
  return (
    <NavigationContainer ref={navigationRef} theme={navTheme}>
      {userStore.isLogin ? (
        <Stack.Navigator
          initialRouteName="walking_home"
          screenOptions={{ animation: 'slide_from_right' }}
        >
          <Stack.Screen
            name="home_tabs"
            component={HomeTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="mypage_nav"
            component={MyPageStackNavigator}
            options={{ headerShown: false, animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="walking_nav"
            component={WalkingStackNavigator}
            options={{ headerShown: false, animation: 'slide_from_bottom' }}
          />
        </Stack.Navigator>
      ) : (
        <AuthStackNavigator />
      )}
    </NavigationContainer>
  );
};
export default observer(Navigation);
