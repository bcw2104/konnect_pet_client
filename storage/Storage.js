import AsyncStorage from '@react-native-async-storage/async-storage';

export const asyncStorage = {
  setItem : async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {}
  },
  
  getItem : async (key) => {
    try {
      let data = await AsyncStorage.getItem(key);
  
      if (!data) {
        return null;
      }
      return JSON.parse(data);
    } catch (e) {}
  },

  removeItem : async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {}
  },

  resetToken : async () => {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('access_token_expire_at');
    await AsyncStorage.removeItem('refresh_token');
    await AsyncStorage.removeItem('refresh_token_expire_at');
  }
}

