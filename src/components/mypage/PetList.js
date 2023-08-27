import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
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

const PetList = ({ items, max }) => {
  const { userStore } = useStores();
  const [pets, setPets] = useState([]);

  useEffect(() => {
    if (!max) return;

    const pets = items || [...userStore.pets];

    const left = max - pets.length;
    for (let i = 0; i < left; i++) {
      pets.push({ petId: -1 });
    }

    if (pets.left % 2 != 0) {
      pets.push({ petId: -2 });
    }

    setPets(pets);
  }, [max]);

  const addNewPet = () => {
    Navigator.navigate({}, 'mypage_nav', 'pet_add_form');
  };

  const editPet = (pet) => {
    Navigator.navigate({ pet: pet }, 'mypage_nav', 'pet_add_form');
  };

  return (
    <FlatList
      scrollEnabled={false}
      data={pets}
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
                uri={utils.pathToUri(item?.imgPath)}
                style={styles.petImg}
              />
              <View style={styles.pet}>
                <CustomText
                  fontSize={14}
                  fontWeight={FONT_WEIGHT.BOLD}
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                >
                  {item?.name}
                </CustomText>
                <CustomText fontSize={12}>
                  {utils.getAge(moment(item?.birthDate, 'YYYYMMDD').toDate())}
                  {'Y '}({item?.gender == 'M' ? 'Male' : 'Female'})
                </CustomText>
              </View>
            </Pressable>
          ) : item.petId == -1 ? (
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
                name="pluscircleo"
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
          ) : (
            <View
              style={{
                paddingVertical: 5,
                paddingHorizontal: 7,
                margin: 3,
                flex: 1,
              }}
            ></View>
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
