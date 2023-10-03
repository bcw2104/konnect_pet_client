import { makeAutoObservable } from 'mobx';

export default class SystemStore {
  _rootStore = null;
  _displayTabBar = true;
  _isLoading = false;
  _isWalking = false;
  _backHandlerCallback = null;

  _appVersion = null;
  _lastestAppVersion = null;
  _lastestForcedAppVersion = null;

  constructor(rootStore) {
    makeAutoObservable(this);

    this._rootStore = rootStore;
  }

  initAppInfo(appInfo) {
    this._appVersion = appInfo.version;
    this._lastestAppVersion = appInfo.lastestVersion;
    this._lastestForcedAppVersion = appInfo.lastestForcedVersion;
  }

  setBackHandlerCallback(callback) {
    this._backHandlerCallback = callback;
  }

  setDisplayTabBar(displayTabBar) {
    this._displayTabBar = displayTabBar;
  }

  setIsLoading(isLoading) {
    this._isLoading = isLoading;
  }

  setIsWalking(isWalking) {
    this._isWalking = isWalking;
  }

  get appVersion() {
    return this._appVersion;
  }
  get lastestAppVersion() {
    return this._lastestAppVersion;
  }

  get lastestForcedAppVersion() {
    return this._lastestForcedAppVersion;
  }

  get isLoading() {
    return this._isLoading;
  }

  get isWalking() {
    return this._isWalking;
  }
  get backHandlerCallback() {
    return this._backHandlerCallback;
  }

  get displayTabBar() {
    return this._displayTabBar;
  }

  get rootStore() {
    return this._rootStore;
  }
}
