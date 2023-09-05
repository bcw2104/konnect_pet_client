import * as Notifications from 'expo-notifications';
import moment from 'moment';
import ImageResizer from 'react-native-image-resizer';
import { DEEP_LINK_PREFIX } from '../commons/constants';
import { asyncStorage } from '../storage/Storage';
import { baseAxios } from './Axios';

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
  defaultNotification: (_title, _body, _link, _seconds = 1) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: _title,
        body: _body,
        data: {
          url: DEEP_LINK_PREFIX.DEFAULT + _link,
        },
      },
      trigger: {
        seconds: _seconds, //onPress가 클릭이 되면 60초 뒤에 알람이 발생합니다.
      },
    });
  },

  extractExtension: (path) => {
    const split = path.split('/');
    return split[split.length - 1].split('.')[1];
  },
  /**
   *
   * @param {*} imageUri
   * @param {*} path
   * @returns upload image function
   */
  uploadImage: async (imageUri, path) => {
    let image;
    try {
      const resize = await ImageResizer.createResizedImage(
        imageUri,
        400,
        400,
        'PNG',
        100,
        0
      );
      image = resize;
    } catch (e) {
      return null;
    }
    try {
      const accessToken = await asyncStorage.getItem('access_token');

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'content-type': 'multipart/form-data',
      };

      const formData = new FormData();
      formData.append('image', {
        name: image.name,
        type: 'image/*',
        uri: image.uri,
      });
      const response = await baseAxios.post(path, formData, {
        headers: headers,
      });
      return response.result?.imagePath;
    } catch (e) {
      throw new Error(e);
    }
  },
  /**
   *
   * @param {*} imageUris
   * @param {*} path
   * @returns upload multiple image function
   */
  uploadMultipleImages: async (imageUris = [], path) => {
    const images = [];
    for (let uri of imageUris) {
      try {
        const resize = await ImageResizer.createResizedImage(
          uri,
          400,
          400,
          'PNG',
          100,
          0
        );
        images.push(resize);
      } catch (e) {}
    }

    try {
      const accessToken = await asyncStorage.getItem('access_token');

      const headers = {
        Authorization: `Bearer ${accessToken}`,
        'content-type': 'multipart/form-data',
      };

      const formData = new FormData();

      images.map((image, idx) =>
        formData.append('images', {
          name: image.name,
          type: 'image/*',
          uri: image.uri,
        })
      );
      const response = await baseAxios.post(path, formData, {
        headers: headers,
      });
      return response.result.imagePaths;
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
  pathToUri: (path) => {
    if (!path) return null;
    return process.env.EXPO_PUBLIC_BASE_IMAGE_URL + '/' + path;
  },
  isCloseToBottom: ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 34;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  },
  calculateDateAgo: (date) => {
    const diff = parseInt(moment().diff(moment(date), 'minutes'));
    if (diff < 60) {
      if (diff == 1) {
        return diff + ' minute ago';
      }
      return diff + ' minutes ago';
    } else if (diff < 1440) {
      const hours = parseInt(diff / 60);
      if (hours == 1) {
        return hours + ' hour ago';
      }
      return hours + ' hours ago';
    } else {
      const days = parseInt(diff / 1440);
      if (days == 1) {
        return days + ' day ago';
      }
      return days + ' days ago';
    }
  },
};
