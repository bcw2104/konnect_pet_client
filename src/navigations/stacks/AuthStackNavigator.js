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
import { COLORS } from '../../commons/colors';
import TermsView from './../../screens/terms/TermsView';
import CustomText from '../../components/elements/CustomText';
import { FONT_WEIGHT } from '../../commons/constants';

const AuthStack = createNativeStackNavigator();

const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator initialRouteName="welcome">
      <AuthStack.Screen
        name="welcome"
        component={WelcomeView}
        options={{ headerShown: false, animation: 'slide_from_bottom' }}
      ></AuthStack.Screen>
      <AuthStack.Group
        screenOptions={(props) => ({
          headerTitle: () => (
            <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
              Sign Up
            </CustomText>
          ),
          headerTitleAlign: 'center',
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable onPress={props.navigation.goBack}>
              <Ionicons name="arrow-back-outline" size={24} color={COLORS.dark} />
            </Pressable>
          ),
          animation: 'slide_from_right',
        })}
      >
        <AuthStack.Screen
          name="signup_step1"
          component={SignupStep1View}
        ></AuthStack.Screen>
        <AuthStack.Screen
          name="signup_step2"
          component={SignupStep2View}
        ></AuthStack.Screen>
        <AuthStack.Screen
          name="signup_step3"
          component={SignupStep3View}
        ></AuthStack.Screen>
        <AuthStack.Screen
          name="signup_step4"
          component={SignupStep4View}
        ></AuthStack.Screen>
      </AuthStack.Group>
      <AuthStack.Group
        screenOptions={(props) => ({
          headerTitle: () => (
            <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
              Find Password
            </CustomText>
          ),
          headerTitleAlign: 'center',
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable onPress={props.navigation.goBack}>
              <Ionicons name="arrow-back-outline" size={24} color={COLORS.dark} />
            </Pressable>
          ),
          animation: 'slide_from_right',
        })}
      >
        <AuthStack.Screen
          name="find_password_step1"
          component={FindPasswordStep1View}
        ></AuthStack.Screen>
        <AuthStack.Screen
          name="find_password_step2"
          component={FindPasswordStep2View}
        ></AuthStack.Screen>
      </AuthStack.Group>
      <AuthStack.Group
        screenOptions={(props) => ({
          headerTitle: '',
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable onPress={props.navigation.goBack}>
              <Ionicons name="arrow-back-outline" size={24} color={COLORS.dark} />
            </Pressable>
          ),
          animation: 'slide_from_bottom',
        })}
      >
        <AuthStack.Screen name="terms" component={TermsView}></AuthStack.Screen>
      </AuthStack.Group>
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigator;
