import React from "react";
import { Image, Pressable, StyleSheet } from "react-native";
import serviceApis from "../../utils/ServiceApis";
import { platform } from "../../commons/constants";
import { asyncStorage } from "../../storage/Storage";
import { useStores } from "../../contexts/StoreContext";
import { Navigator } from "../../navigations/Navigator";
import {
  AccessToken,
  LoginManager,
} from "react-native-fbsdk-next";

const FacebookLogin = () => {
  const { userStore, commonStore } = useStores();

  const signIn = async () => {
    commonStore.setIsLoading(true);
    try {
      const { isCancelled } = await LoginManager.logInWithPermissions([
        "email",
        "public_profile",
      ]);

      if (isCancelled) {
        commonStore.setIsLoading(false);
        return;
      }

      const token = await AccessToken.getCurrentAccessToken();

      const response = await serviceApis.socialLogin(token.accessToken, platform.FACEBOOK);

      if (response.rsp_code === "1000") {
        asyncStorage.setItem("access_token", response.result.accessToken);
        asyncStorage.setItem(
          "access_token_expire_at",
          response.result.accessTokenExpireAt
        );
        asyncStorage.setItem("refresh_token", response.result.refreshToken);
        asyncStorage.setItem(
          "refresh_token_expire_at",
          response.result.refreshTokenExpireAt
        );
        userStore.initUserInfo();
      } else if (response.rsp_code === "9216") {
        Navigator.navigate("signup_step1", {
          platform: platform.FACEBOOK,
          emailVerifyKey: response.result.key,
        });
      }
    } catch (error) {
    } finally {
      commonStore.setIsLoading(false);
    }
  };

  return (
    <Pressable
      title="Sign in with Google"
      onPress={signIn}
      style={styles.button}
    >
      <Image
        style={styles.logo}
        source={require("../../assets/images/logos/logo_facebook.png")}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});

export default FacebookLogin;
