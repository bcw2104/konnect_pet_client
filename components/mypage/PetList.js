import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import CustomText from '../elements/CustomText';
import { FONT_WEIGHT } from '../../commons/constants';
import { AntDesign } from '@expo/vector-icons';
import COLORS from '../../commons/colors';
import { Navigator } from '../../navigations/Navigator';
import { utils } from '../../utils/Utils';
import moment from 'moment';
import { useStores } from '../../contexts/StoreContext';
import { observer } from 'mobx-react-lite';

const PetList = ({ items }) => {
  const { userStore } = useStores();

  const addNewPet = () => {
    Navigator.navigate('mypage_nav', {
      screen: 'pet_add_form',
    });
  };

  const editPet = (pet) => {
    Navigator.navigate('mypage_nav', {
      screen: 'pet_add_form',
      params: { pet: pet },
    });
  };

  return (
    <FlatList
      scrollEnabled={false}
      data={items || [...userStore.pets, { petId: -1 }]}
      renderItem={({ item }) => (
        <>
          {item.petId >= 0 ? (
            <Pressable
              style={styles.petItem}
              onPress={() => {
                editPet(item);
              }}
            >
              <Image
                source={
                  !!item?.petImgUrl
                    ? { uri: item?.petImgUrl }
                    : require('../../assets/images/profile/pet_default.png')
                }
                style={styles.petImg}
              />
              <View style={styles.pet}>
                <CustomText
                  fontSize={15}
                  fontWeight={FONT_WEIGHT.BOLD}
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                >
                  {item?.petName}
                </CustomText>
                <CustomText fontSize={13} style={{ marginTop: 5 }}>
                  {utils.getAge(moment(item?.birthDate, 'YYYYMMDD').toDate())}
                  {'Y '}({item?.petGender == 'M' ? 'Male' : 'Female'})
                </CustomText>
              </View>
            </Pressable>
          ) : (
            <Pressable style={styles.petItem} onPress={addNewPet}>
              <AntDesign
                name="pluscircleo"
                size={40}
                color="black"
                style={styles.petImg}
              />
              <View style={styles.pet}>
                <CustomText
                  fontSize={15}
                  fontWeight={FONT_WEIGHT.BOLD}
                  numberOfLines={1}
                >
                  반려동물 추가
                </CustomText>
              </View>
            </Pressable>
          )}
        </>
      )}
      keyExtractor={(item, index) => item?.petId}
      numColumns={2}
    />
  );
};

export default observer(PetList);

const styles = StyleSheet.create({
  petWrap: {
    flexDirection: 'row',
  },
  petItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.warningDeep,
    borderWidth: 2,
    borderRadius: 15,
    padding: 8,
    margin: 5,
    flex: 1,
  },
  petImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  pet: {
    flex: 1,
    justifyContent: 'center',
  },
});
