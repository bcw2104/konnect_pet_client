import ModalStore from './ModalStore';
import SystemStore from './SystemStore';
import UserStore from './UserStore';

export class RootStore {
  userStore;
  systemStore;
  modalStore;

  constructor() {
    this.userStore = new UserStore(this);
    this.systemStore = new SystemStore(this);
    this.modalStore = new ModalStore(this);
  }
}