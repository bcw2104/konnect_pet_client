import { makeAutoObservable } from 'mobx';

export default class ModalStore {
  _rootStore = null;
  _open = false;
  _content = null;
  _firstBtnText = null;
  _firstBtnCallback = null;
  _secondBtnText = null;
  _secondBtnCallback = null;

  constructor(rootStore) {
    makeAutoObservable(this);
    this._rootStore = rootStore;
  }

  openOneButtonModal(content, firstBtnText, firstBtnCallback) {
    this._open = true;
    this._content = content;
    this._firstBtnText = firstBtnText;
    this._firstBtnCallback = firstBtnCallback;
    this._secondBtnText = null;
    this._secondBtnCallback = null;
  }

  openTwoButtonModal(
    content,
    firstBtnText,
    firstBtnCallback,
    secondBtnText,
    secondBtnCallback
  ) {
    this._open = true;
    this._content = content;
    this._firstBtnText = firstBtnText;
    this._firstBtnCallback = firstBtnCallback;
    this._secondBtnText = secondBtnText;
    this._secondBtnCallback = secondBtnCallback;
  }

  closeModal() {
    this._open = false;
    this._content = null;
    this._firstBtnText = null;
    this._firstBtnCallback = null;
    this._secondBtnText = null;
    this._secondBtnCallback = null;
  }

  get open() {
    return this._open;
  }

  get content() {
    return this._content;
  }

  get firstBtnText() {
    return this._firstBtnText;
  }

  get firstBtnCallback() {
    return this._firstBtnCallback;
  }

  get secondBtnText() {
    return this._secondBtnText;
  }
  get secondBtnCallback() {
    return this._secondBtnCallback;
  }
}
