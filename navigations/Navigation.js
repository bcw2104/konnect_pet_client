import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { useStores } from '../contexts/StoreContext';
import { observer } from 'mobx-react-lite';
import { navigationRef } from './Navigator';
import AuthStackNavigator from './stacks/AuthStackNavigator';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import COLORS from '../commons/colors';
import MyPageStackNavigator from './stacks/MyPageStackNavigator';
import WalkingStackNavigator from './stacks/WalkingStackNavigator';
import { MaterialIcons } from '@expo/vector-icons';

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
              position: 'relative'
            },
            tabBarLabelStyle: {
              position: 'relative',
              top:0,
              fontSize: 12,
              fontFamily: 'Roboto',
              fontWeight: 'bold',
              paddingBottom: 5,
            },
            tabBarIconStyle:{
              position: 'relative',
              top: 4,

            }
          }}
        >
          <Tab.Screen
            name="walking_tab"
            component={WalkingStackNavigator}
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
            component={MyPageStackNavigator}
            options={{
              headerShown: false,
              tabBarLabel: 'My Page',
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="person" size={20} color={color} />
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
