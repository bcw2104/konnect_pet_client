import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable } from 'react-native';

import { COLORS } from '../../commons/colors';
import { FONT_WEIGHT } from '../../commons/constants';
import CustomText from '../../components/elements/CustomText';
import CommunityDetailView from '../../screens/community/CommunityDetailView';

const CommunityStack = createNativeStackNavigator();

const CommunityStackNavigator = ({ navigation, route }) => {
  return (
    <CommunityStack.Navigator>
      <CommunityStack.Group
        screenOptions={(props) => ({
          headerTitle: ({ children }) => (
            <CustomText fontSize={16} fontWeight={FONT_WEIGHT.BOLD}>
              {children}
            </CustomText>
          ),
          headerTitleAlign: 'center',
          headerBackVisible: false,
          headerLeft: () => (
            <Pressable onPress={props.navigation.goBack}>
              <Ionicons
                name="arrow-back-outline"
                size={24}
                color={COLORS.dark}
              />
            </Pressable>
          ),
          animation: 'slide_from_bottom',
        })}
      >
        <CommunityStack.Screen
          options={{ title: 'Post' }}
          name="post_detail"
          component={CommunityDetailView}
        ></CommunityStack.Screen>
      </CommunityStack.Group>
    </CommunityStack.Navigator>
  );
};

export default CommunityStackNavigator;
