import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeView from '../screens/WelcomeView';
import HomeView from '../screens/HomeView';
import { useStores } from '../contexts/StoreContext';
import { observer } from 'mobx-react-lite';
import { navigationRef } from './Navigator';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SignUpStep1View from '../screens/signup/SignUpStep1View';
import SignUpStep2View from '../screens/signup/SignUpStep2View';
import SignUpStep3View from '../screens/signup/SignUpStep3View';
import SignUpStep4View from '../screens/signup/SignUpStep4View';

const Stack = createNativeStackNavigator();
const Navigation = () => {
  const { userStore } = useStores();
  return (
    <NavigationContainer ref={navigationRef}>
      {userStore.isLogin ? (
        <Stack.Navigator
          initialRouteName='home'
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name='home' component={HomeView}></Stack.Screen>
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName='welcome'>
          <Stack.Screen
            name='welcome'
            component={WelcomeView}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Group
            screenOptions={(props) => ({
              headerTitle: 'Sign Up',
              headerTitleAlign: 'center',
              headerBackVisible: false,
              headerLeft: () => (
                <Pressable onPress={props.navigation.goBack}>
                  <Ionicons name='arrow-back-sharp' size={24} color='black' />
                </Pressable>
              ),
            })}
          >
            <Stack.Screen
              name='signup_step1'
              component={SignUpStep1View}
            ></Stack.Screen>
            <Stack.Screen
              name='signup_step2'
              component={SignUpStep2View}
            ></Stack.Screen>
            <Stack.Screen
              name='signup_step3'
              component={SignUpStep3View}
            ></Stack.Screen>
            <Stack.Screen
              name='signup_step4'
              component={SignUpStep4View}
            ></Stack.Screen>
          </Stack.Group>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};
export default observer(Navigation);
