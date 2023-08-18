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
import { COLORS } from '../../commons/colors';
import { Navigator } from '../../navigations/Navigator';
import { utils } from '../../utils/Utils';
import moment from 'moment';
import { useStores } from '../../contexts/StoreContext';
import { observer } from 'mobx-react-lite';
import PetImage from '../modules/PetImage';

const PetList = ({ items }) => {
  const { userStore } = useStores();

  const addNewPet = () => {
    Navigator.navigate({}, 'mypage_nav', 'pet_add_form');
  };

  const editPet = (pet) => {
    Navigator.navigate({ pet: pet }, 'mypage_nav', 'pet_add_form');
  };

  return (
    <FlatList
      scrollEnabled={false}
      data={items || [...userStore.pets, { petId: -1 }]}
      renderItem={({ item }) => (
        <>
          {item.petId >= 0 ? (
            <Pressable
              style={({ pressed }) => [
                styles.petItem,
                {
                  backgroundColor: pressed ? COLORS.lightDeep : COLORS.white,
                },
              ]}
              onPress={() => {
                editPet(item);
              }}
            >
              <PetImage
                uri={process.env.EXPO_PUBLIC_BASE_IMAGE_URL + item?.petImgPath}
                style={styles.petImg}
              />
              <View style={styles.pet}>
                <CustomText
                  fontSize={14}
                  fontWeight={FONT_WEIGHT.BOLD}
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                >
                  {item?.petName}
                </CustomText>
                <CustomText fontSize={12}>
                  {utils.getAge(moment(item?.birthDate, 'YYYYMMDD').toDate())}
                  {'Y '}({item?.petGender == 'M' ? 'Male' : 'Female'})
                </CustomText>
              </View>
            </Pressable>
          ) : (
            <Pressable
              style={({ pressed }) => [
                styles.petItem,
                {
                  backgroundColor: pressed ? COLORS.lightDeep : COLORS.white,
                },
              ]}
              onPress={addNewPet}
            >
              <AntDesign
                name='pluscircleo'
                size={40}
                color={COLORS.dark}
                style={styles.petImg}
              />
              <View style={styles.pet}>
                <CustomText
                  fontSize={15}
                  fontWeight={FONT_WEIGHT.BOLD}
                  numberOfLines={1}
                >
                  Add Pet
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
    borderColor: COLORS.main,
    borderWidth: 2,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 7,
    margin: 3,
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
