import { makeAutoObservable, runInAction } from 'mobx';
import serviceApis from './../utils/ServiceApis';
import { asyncStorage } from '../storage/Storage';

export default class UserStore {
  _rootStore = null;
  _userId = null;
  _email = null;
  _tel = null;
  _platform = null;
  _isLogin = false;

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
    Toast.show({
      type: 'error',
      text1: accessToken,
    });
    if (!accessToken) return;

    try {
      const response = await serviceApis.getUserInfo();
      runInAction(() => {
        this._userId = response.result.userId;
        this._email = response.result.email;
        this._tel = response.result.tel;
        this._platform = response.result.platform;
        this._isLogin = true;
      });

      await serviceApis.updateDeviceInfo(
        this._deviceModel,
        this._deviceOs,
        this._deviceOsVersion,
        this._deviceToken
      );
    } catch (error) {}
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

  get isLogin() {
    return this._isLogin;
  }

  get rootStore() {
    return this._rootStore;
  }
}
