import { makeAutoObservable } from 'mobx';

export default class UserStore {
  _rootStore = null;
  _email = null;
  _password = null;
  _platform = null;
  _token = null;

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

  updateToken(newToken) {
    this._token = newToken;
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

  get token() {
    return this._token;
  }
  get rootStore() {
    return this._rootStore;
  }
}
