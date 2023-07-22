import * as Notifications from 'expo-notifications';
import { DEEP_LINK_PREFIX } from '../commons/constants';

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

  getAroundCoord : (lat,lng, meters) => {
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
};
