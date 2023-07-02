import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SignupStep1View from '../../screens/signup/SignUpStep1View';
import SignupStep2View from './../../screens/signup/SignUpStep2View';
import SignupStep3View from './../../screens/signup/SignUpStep3View';
import SignupStep4View from './../../screens/signup/SignUpStep4View';
import WelcomeView from '../../screens/WelcomeView';
import FindPasswordStep1View from './../../screens/account/FindPasswordStep1View';
import FindPasswordStep2View from './../../screens/account/FindPasswordStep2View';
import colors from '../../commons/colors';
import TermsView from './../../screens/terms/TermsView';

const AuthStack = createNativeStackNavigator();

const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator
      initialRouteName='welcome'
    >
      <AuthStack.Screen
        name='welcome'
        component={WelcomeView}
        options={{ headerShown: false }}
      ></AuthStack.Screen>
      <AuthStack.Group
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
        <AuthStack.Screen
          name='signup_step1'
          component={SignupStep1View}
        ></AuthStack.Screen>
        <AuthStack.Screen
          name='signup_step2'
          component={SignupStep2View}
        ></AuthStack.Screen>
        <AuthStack.Screen
          name='signup_step3'
          component={SignupStep3View}
        ></AuthStack.Screen>
        <AuthStack.Screen
          name='signup_step4'
          component={SignupStep4View}
        ></AuthStack.Screen>
      </AuthStack.Group>
      <AuthStack.Group
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
        <AuthStack.Screen
          name='find_password_step1'
          component={FindPasswordStep1View}
        ></AuthStack.Screen>
        <AuthStack.Screen
          name='find_password_step2'
          component={FindPasswordStep2View}
        ></AuthStack.Screen>
      </AuthStack.Group>
      <AuthStack.Group
        screenOptions={(props) => ({
          headerTitle: '',
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable onPress={props.navigation.goBack}>
              <Ionicons name='arrow-back-sharp' size={24} color='black' />
            </Pressable>
          ),
          presentation: 'modal',
        })}
      >
        <AuthStack.Screen name='terms' component={TermsView}></AuthStack.Screen>
      </AuthStack.Group>
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigator;
