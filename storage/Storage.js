import AsyncStorage from '@react-native-async-storage/async-storage';

export const setStoreData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {}
};

export const getStoreData = async (key) => {
  try {
    let data = await AsyncStorage.getItem(key);

    if (!data) {
      return null;
    }
    return JSON.parse(data);
  } catch (e) {}
};
