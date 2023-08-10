import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, View } from 'react-native';
import MyPageHomeView from '../../screens/mypage/MyPageHomeView';
import CustomText from '../../components/elements/CustomText';
import { FONT_WEIGHT } from '../../commons/constants';
const MyPageTabStack = createNativeStackNavigator();

const MyPageTabStackNavigator = ({ navigation, route }) => {
  return (
    <MyPageTabStack.Navigator
      initialRouteName="mypage_home"
      screenOptions={{
        animation: 'slide_from_right',
      }}
    >
      <MyPageTabStack.Screen
        name="mypage_home"
        component={MyPageHomeView}
        options={(props) => ({
          headerTitle: '',
          headerLeft: () => (
            <View style={{ flexDirection: 'row', paddingLeft: 15 }}>
              <CustomText fontSize={18} fontWeight={FONT_WEIGHT.BOLD}>
                My Page
              </CustomText>
            </View>
          ),
        })}
      ></MyPageTabStack.Screen>
    </MyPageTabStack.Navigator>
  );
};

export default MyPageTabStackNavigator;
