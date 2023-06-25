import { makeAutoObservable, runInAction } from 'mobx';
import serviceApis from './../utils/ServiceApis';
import { asyncStorage } from '../storage/Storage';

export default class UserStore {
  _rootStore = null;
  _userId = null;
  _email = null;
  _platform = null;
  _isLogin = false;

  constructor(rootStore) {
    makeAutoObservable(this);
    this._rootStore = rootStore;
  }

  async initUserInfo() {
    const response = await serviceApis.getUserInfo();

    runInAction(() => {
      this._userId = response.result.userId;
      this._email = response.result.email;
      this._platform = response.result.platform;
      this._isLogin = true;
    });
  }

  setLoginStatus(isLogin) {
    this._isLogin = isLogin;
  }

  logout() {
    this._isLogin = false;
    asyncStorage.resetToken();
  }

  get email() {
    return this._email;
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
