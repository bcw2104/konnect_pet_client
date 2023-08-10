import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();
export const Navigator = {
  goBack: () => {
    navigationRef.current?.goBack();
  },
  navigate: (params, lvl1, lvl2, lvl3) => {
    navigationRef.current?.navigate(
      lvl1,
      !!lvl2
        ? {
            screen: lvl2,
            params: !!lvl3
              ? { screen: lvl3, params: params }
              : params,
          }
        : params
    );
  },

  reset: (params, lvl1, lvl2, lvl3) => {
    navigationRef.current?.reset({
      index: 0,
      routes: [
        !!lvl2
          ? {
              name: lvl1,
              state: {
                routes: [
                  !!lvl3
                    ? {
                        name: lvl2,
                        state: {
                          routes: [
                            {
                              name: lvl3,
                              params: params,
                            },
                          ],
                        },
                      }
                    : { name: lvl2, params: params },
                ],
              },
            }
          : { name: lvl1, params: params },
      ],
    });
  },
};
