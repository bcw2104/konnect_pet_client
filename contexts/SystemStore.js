import { Dimensions } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";


export default class SystemStore{
  rootStore = null;
  winHeight = 0;
  winWidth = 0;
  statusBarHeight = 0;

  constructor(rootStore) {
    const { width: WIN_WIDTH, height: WIN_HEIGHT } = Dimensions.get('window');

    this.rootStore = rootStore;
    this.winWidth = WIN_WIDTH;
    this.winHeight = WIN_HEIGHT;
    this.statusBarHeight = getStatusBarHeight();
  }
}