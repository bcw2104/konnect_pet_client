import { makeAutoObservable } from 'mobx';

export default class CommonStore {
  _rootStore = null;
  _isLoading = false;

  constructor(rootStore) {
    makeAutoObservable(this);
    this._rootStore = rootStore;
  }

  setIsLoading(isLoading) {
    this._isLoading = isLoading;
  }

  get isLoading() {
    return this._isLoading;
  }

  get rootStore() {
    return this._rootStore;
  }
}
