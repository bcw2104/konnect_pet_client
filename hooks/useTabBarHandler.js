import { useEffect } from 'react';
import { useStores } from '../contexts/StoreContext';

export const useTabBarHandler = (hide=true) => {
  const { systemStore } = useStores();

  useEffect(() => {
    systemStore.setDisplayTabBar(!hide);
    return () => {
      systemStore.setDisplayTabBar(hide);
    };
  }, []);
};
