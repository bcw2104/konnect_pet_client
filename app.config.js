import 'dotenv/config';

module.exports = ({ config }) => {
  return {
    ...config,
    updates: {
      url: 'https://u.expo.dev/e88864d0-c7ed-4de6-8dc3-cdf243511a52',
    },
    runtimeVersion: {
      policy: 'sdkVersion',
    },
    ios: {
      bundleIdentifier: 'com.konnect.pet',
      buildNumber: '1.0.1',
      supportsTablet: true,
      googleServicesFile: process.env.GOOGLE_IOS_SERVICE_FILE,
      config: {
        googleMapsApiKey: process.env.GOOGLE_IOS_API_KEY,
      },
      infoPlist: {
        UIBackgroundModes: ['location', 'fetch'],
      },
    },
    android: {
      package: 'com.konnect.pet',
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      googleServicesFile: process.env.GOOGLE_ANDROID_SERVICE_FILE,
      softwareKeyboardLayoutMode: 'pan',
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_ANDROID_API_KEY,
        },
      },
    },
    extra: {
      eas: {
        projectId: 'e88864d0-c7ed-4de6-8dc3-cdf243511a52',
      },
      googleAndroidApiKey: process.env.GOOGLE_ANDROID_API_KEY,
      googleIOSApiKey: process.env.GOOGLE_IOS_API_KEY,
      googleWebApiKey: process.env.GOOGLE_WEB_API_KEY,
    },
  };
};
