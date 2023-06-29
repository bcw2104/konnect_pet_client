import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeView from '../screens/WelcomeView';
import HomeView from '../screens/HomeView';
import { useStores } from '../contexts/StoreContext';
import { observer } from 'mobx-react-lite';
import { navigationRef } from './Navigator';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TermsView from '../screens/terms/TermsView';
import SignupStep1View from './../screens/signup/SignUpStep1View';
import SignupStep2View from './../screens/signup/SignUpStep2View';
import SignupStep3View from './../screens/signup/SignUpStep3View';
import SignupStep4View from './../screens/signup/SignUpStep4View';
import FindPasswordStep1View from '../screens/account/FindPasswordStep1View';
import FindPasswordStep2View from '../screens/account/FindPasswordStep2View';

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
          <Stack.Group
            screenOptions={(props) => ({
              headerBackVisible: false,
              headerLeft: () => (
                <Pressable onPress={props.navigation.goBack}>
                  <Ionicons name='arrow-back-sharp' size={24} color='black' />
                </Pressable>
              ),
              presentation: 'modal',
            })}
          >
            <Stack.Screen name='terms' component={TermsView}></Stack.Screen>
          </Stack.Group>
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
              component={SignupStep1View}
            ></Stack.Screen>
            <Stack.Screen
              name='signup_step2'
              component={SignupStep2View}
            ></Stack.Screen>
            <Stack.Screen
              name='signup_step3'
              component={SignupStep3View}
            ></Stack.Screen>
            <Stack.Screen
              name='signup_step4'
              component={SignupStep4View}
            ></Stack.Screen>
          </Stack.Group>
          <Stack.Group
            screenOptions={(props) => ({
              headerTitle: '',
              headerBackVisible: false,
              headerLeft: () => (
                <Pressable onPress={props.navigation.goBack}>
                  <Ionicons name='arrow-back-sharp' size={24} color='black' />
                </Pressable>
              ),
            })}
          >
            <Stack.Screen
              name='find_password_step1'
              component={FindPasswordStep1View}
            ></Stack.Screen>
            <Stack.Screen
              name='find_password_step2'
              component={FindPasswordStep2View}
            ></Stack.Screen>
          </Stack.Group>
          <Stack.Group
            screenOptions={(props) => ({
              headerBackVisible: false,
              headerTitle: '',
              headerLeft: () => (
                <Pressable onPress={props.navigation.goBack}>
                  <Ionicons name='arrow-back-sharp' size={24} color='black' />
                </Pressable>
              ),
              presentation: 'modal',
            })}
          >
            <Stack.Screen name='terms' component={TermsView}></Stack.Screen>
          </Stack.Group>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};
export default observer(Navigation);
