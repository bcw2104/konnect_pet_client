import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CommunityHomeView from '../../screens/community/CommunityHomeView';
import CustomText from '../../components/elements/CustomText';
import { FONT_WEIGHT } from '../../commons/constants';
import { View } from 'react-native';

const CommunityTabStack = createNativeStackNavigator();

const CommunityTabStackNavigator = () => {
  return (
    <CommunityTabStack.Navigator
      initialRouteName="community_home"
      screenOptions={{
        animation: 'slide_from_right',
      }}
    >
      <CommunityTabStack.Screen
        name="community_home"
        component={CommunityHomeView}
        options={(props) => ({
          headerTitle: '',
          headerLeft: () => (
            <View style={{ flexDirection: 'row', paddingLeft: 15 }}>
              <CustomText fontSize={18} fontWeight={FONT_WEIGHT.BOLD}>
                Community
              </CustomText>
            </View>
          ),
        })}
      ></CommunityTabStack.Screen>
    </CommunityTabStack.Navigator>
  );
};

export default CommunityTabStackNavigator;
