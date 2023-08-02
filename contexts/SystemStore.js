import { makeAutoObservable } from 'mobx';

export default class SystemStore {
  _rootStore = null;
  _displayTabBar = true;
  _isLoading = false;
  _backHandlerCallback = null;

  constructor(rootStore) {
    makeAutoObservable(this);

    this._rootStore = rootStore;
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

  get isLoading() {
    return this._isLoading;
  }
  
  get backHandlerCallback(){
    return this._backHandlerCallback;
  }

  get displayTabBar() {
    return this._displayTabBar;
  }

  get rootStore() {
    return this._rootStore;
  }
}
