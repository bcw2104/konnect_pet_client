import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MyPageHomeView from '../../screens/mypage/MyPageHomeView';
import CustomText from '../../components/elements/CustomText';
const MyPageTabStack = createNativeStackNavigator();

const MyPageTabStackNavigator = ({ navigation, route }) => {
  return (
    <MyPageTabStack.Navigator initialRouteName="mypage_home">
      <MyPageTabStack.Screen
        name="mypage_home"
        component={MyPageHomeView}
        options={(props) => ({
          headerTitle: '',
          headerLeft: () => (
            <View style={{ flexDirection: 'row', paddingLeft: 15 }}>
              <CustomText>My Page</CustomText>
            </View>
          ),
          headerRight: () => (
            <View style={{ flexDirection: 'row', paddingRight: 15 }}>
              <Pressable
                onPress={props.navigation.goBack}
                hitSlop={5}
                style={{ marginRight: 20 }}
              >
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="black"
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  props.navigation.navigate('setting', {});
                }}
                hitSlop={5}
              >
                <Ionicons name="settings-outline" size={24} color="black" />
              </Pressable>
            </View>
          ),
        })}
      ></MyPageTabStack.Screen>
    </MyPageTabStack.Navigator>
  );
};

export default MyPageTabStackNavigator;