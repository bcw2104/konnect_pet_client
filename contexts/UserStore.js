import { makeAutoObservable } from 'mobx';
import { utils } from '../utils/Utils';

export default class UserStore {
  _rootStore = null;
  _email = null;
  _password = null;
  _platform = null;
  _isLogin = false;

  constructor(rootStore) {
    makeAutoObservable(this);
    this._rootStore = rootStore;
  }

  initUserInfo(user) {
    this._email = user.email;
    this._platform = user.platform;
  }

  storeJoinDataLevel3(email, password) {
    this._email = email;
    this._password = password;
  }

  setLoginStatus(isLogin) {
    this._isLogin = isLogin;
  }

  logout() {
    this._isLogin = false;
    utils.resetToken();
  }

  get email() {
    return this._email;
  }
  get password() {
    return this._password;
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
