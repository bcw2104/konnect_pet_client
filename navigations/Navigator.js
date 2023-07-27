import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();
export const Navigator = {
  goBack: () => {
    navigationRef.current?.goBack();
  },
  navigate: (name, params) => {
    navigationRef.current?.navigate(name, params);
  },

  reset: (name, params) => {
    navigationRef.current?.reset({ routes: [{ name: name, params: params }] });
  },
};
