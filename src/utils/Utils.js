import * as Notifications from 'expo-notifications';
import * as FileSystem from 'expo-file-system';
import { DEEP_LINK_PREFIX } from '../commons/constants';
import { asyncStorage } from '../storage/Storage';
import ImageResizer from 'react-native-image-resizer';
import { Platform } from 'react-native';

export const utils = {
  coordsDist: (lat1, lon1, lat2, lon2) => {
    rad = function (x) {
      return (x * Math.PI) / 180;
    };

    var R = 6378.137; //Earth radius in km (WGS84)
    var dLat = rad(lat2 - lat1);
    var dLong = rad(lon2 - lon1);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(lat1)) *
        Math.cos(rad(lat2)) *
        Math.sin(dLong / 2) *
        Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c * 1000;

    return parseInt(d); //Return 3 decimals
  },

  getAroundCoord: (lat, lng, meters) => {
    const kmInLongitudeDegree = 111.32 * Math.cos((lat / 180.0) * Math.PI);
    const km = meters / 1000;

    let deltaLat = km / 111.1;
    let deltaLng = km / kmInLongitudeDegree;

    const aroundCoords = {
      minLat: lat - deltaLat,
      maxLat: lat + deltaLat,
      minLng: lng - deltaLng,
      maxLng: lng + deltaLng,
    };

    return aroundCoords;
  },
  defaultNotification: (_title, _body, _link, _seconds) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: _title,
        body: _body,
        data: {
          url: DEEP_LINK_PREFIX.DEFAULT + _link,
        },
      },
      trigger: {
        seconds: _seconds || 1, //onPress가 클릭이 되면 60초 뒤에 알람이 발생합니다.
      },
    });

    console.log('send notification');
  },

  /**
   *
   * @param {*} imageUri
   * @param {*} path
   * @returns upload image function
   */
  uploadImage: async (imageUri, path) => {
    try {
      const resize = await ImageResizer.createResizedImage(
        imageUri,
        250,
        250,
        'PNG',
        80,
        0
      );
      imageUri = resize.uri;
    } catch (e) {}

    const BASE_API_URL =
      process.env.NODE_ENV == 'development'
        ? Platform.OS == 'ios'
          ? 'http://127.0.0.1:8080'
          : 'http://10.0.2.2:8080'
        : process.env.EXPO_PUBLIC_BASE_API_URL;

    try {
      const accessToken = await asyncStorage.getItem('access_token');

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await FileSystem.uploadAsync(
        BASE_API_URL + path,
        imageUri,
        {
          headers: headers,
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          fieldName: 'image',
        }
      );
      return JSON.parse(response.body).result;
    } catch (e) {
      throw new Error(e);
    }
  },
  getAge: (d1) => {
    var now = new Date();
    var d2 = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59
    );
    var diff = d2.getTime() - d1.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  },
  calculateKcal: (meters, kg) => {
    return (1.1 * kg * meters) / 1000;
  },
  calculateSpeed: (meters, seconds) => {
    return seconds == 0 ? 0 : parseInt((meters / seconds) * 3.6);
  },
  toFormatNumber: (val) => {
    return val.toLocaleString('ko-KR');
  },
};