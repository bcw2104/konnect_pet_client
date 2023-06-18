import axios from 'axios';
import Constants  from 'expo-constants';

export const baseAxios = axios.create({
  baseURL: Constants.expoConfig.extra.BASE_API_URL,
});

baseAxios.interceptors.response.use(
  function (response) {
      return response.data;
  },

  function (error) {
      console.log(error.response.data);
      return Promise.reject(error);
  }
);

