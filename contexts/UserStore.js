import { makeAutoObservable, runInAction } from 'mobx';
import serviceApis from './../utils/ServiceApis';
import { asyncStorage } from '../storage/Storage';

export default class UserStore {
  _rootStore = null;
  _userId = null;
  _email = null;
  _tel = null;
  _platform = null;
  _residenceAddress = null;
  _residenceCoords = null;

  _profile = null
  _isLogin = false;

  _pets = null;

  _deviceModel = null;
  _deviceOs = null;
  _deviceOsVersion = null;
  _deviceToken = null;

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
        this._tel = response.result.tel;
        this._platform = response.result.platform;
        this._residenceAddress = response.result.residenceAddress;
        this._residenceCoords = response.result.residenceCoords;
        this._isLogin = true;
        this._pets = response.result.pets;
        this._profile = response.result.profile;
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

  addPet(pet) {
    let pets = [];
    if (this._pets != null) {
      pets = [...this._pets];
    }
    pets.push(pet);

    this._pets = pets;
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

  get email() {
    return this._email;
  }

  get tel() {
    return this._tel;
  }

  get platform() {
    return this._platform;
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

  get rootStore() {
    return this._rootStore;
  }
}
