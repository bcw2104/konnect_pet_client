import { useEffect } from 'react';
import { useStores } from '../contexts/StoreContext';

export const useTabBarHandler = (visible) => {
  const { systemStore } = useStores();

  useEffect(() => {
    if (systemStore.displayTabBar == !visible) {
      systemStore.setDisplayTabBar(visible);
      return () => {
        systemStore.setDisplayTabBar(!visible);
      };
    }
  }, []);
};
