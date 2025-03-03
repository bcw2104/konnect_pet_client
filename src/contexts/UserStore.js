import { makeAutoObservable, runInAction } from 'mobx';
import { serviceApis } from './../utils/ServiceApis';
import { asyncStorage } from '../storage/Storage';

export default class UserStore {
  _rootStore = null;
  _userId = null;
  _email = null;
  _tel = null;
  _createdDate = null;
  _platform = null;
  _residenceAddress = null;
  _residenceCity = null;
  _residenceCoords = null;

  _marketingYn = false;

  _profile = null;
  _isLogin = false;

  _pets = null;

  _deviceModel = null;
  _deviceOs = null;
  _deviceOsVersion = null;
  _deviceToken = null;
  _appSettings = null;

  constructor(rootStore) {
    makeAutoObservable(this);
    this._rootStore = rootStore;
  }

  async initUserInfo() {
    const accessToken = await asyncStorage.getItem('access_token');
    if (!accessToken) return;

    try {
      const response = await serviceApis.getUserInfo();
      runInAction(() => {
        this._userId = response.result.userId;
        this._email = response.result.email;
        this._createdDate = response.result.createdDate;
        this._tel = response.result.tel;
        this._platform = response.result.platform;
        this._residenceAddress = response.result.residenceAddress;
        this._residenceCity = response.result.residenceCity;
        this._residenceCoords = response.result.residenceCoords;
        this._isLogin = true;
        this._pets = response.result.pets;
        this._profile = response.result.profile;
        this._marketingYn = response.result.marketingYn;
        this._appSettings = response.result.appSettings;
      });

      await serviceApis.updateDeviceInfo(
        this._deviceModel,
        this._deviceOs,
        this._deviceOsVersion,
        this._deviceToken
      );
    } catch (error) {
      console.error(error);
    }
  }

  setDeviceInfo(deviceModel, deviceOs, deviceOsVersion, deviceToken) {
    this._deviceModel = deviceModel;
    this._deviceOs = deviceOs;
    this._deviceOsVersion = deviceOsVersion;
    this._deviceToken = deviceToken;
  }

  setLoginStatus(isLogin) {
    this._isLogin = isLogin;
  }

  setMarketingYn(marketingYn) {
    this._marketingYn = marketingYn;
  }

  setPets(pets) {
    this._pets = pets;
  }

  addPets(pet) {
    let pets = [];
    if (this._pets != null) {
      pets = [...this._pets];
    }
    pets.push(pet);

    this._pets = pets;
  }

  setAppSettings(appSettings) {
    this._appSettings = appSettings;
  }

  setProfile(profile) {
    this._profile = profile;
  }

  async logout() {
    try {
      await serviceApis.logout();
    } catch (error) {
    } finally {
      runInAction(() => {
        this._isLogin = false;
      });
      asyncStorage.resetToken();
    }
  }
  get userId() {
    return this._userId;
  }
  get email() {
    return this._email;
  }

  get tel() {
    return this._tel;
  }
  get createdDate() {
    return this._createdDate;
  }
  get platform() {
    return this._platform;
  }

  get marketingYn() {
    return this._marketingYn;
  }
  get residenceCity() {
    return this._residenceCity;
  }
  get residenceAddress() {
    return this._residenceAddress;
  }
  get residenceCoords() {
    const defaultCoords = {
      lat: 14.5995124,
      lng: 120.9842195,
    };
    try {
      return !this._residenceCoords
        ? defaultCoords
        : JSON.parse(this._residenceCoords);
    } catch (e) {
      return defaultCoords;
    }
  }

  get isLogin() {
    return this._isLogin;
  }

  get pets() {
    return this._pets;
  }

  get profile() {
    return this._profile;
  }

  get appSettings() {
    return this._appSettings;
  }
  get rootStore() {
    return this._rootStore;
  }
}
