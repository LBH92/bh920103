import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.byeongdol.investment',
  appName: 'byeongdol-investment',
  webDir: 'dist'
};

export default config;

config.plugins = {
  SplashScreen: {
    launchShowDuration: 2000,
    launchAutoHide: true,
    backgroundColor: "#0b0e14",
    androidSplashResourceName: "splash",
    androidScaleType: "CENTER_CROP",
    showSpinner: true,
    androidSpinnerStyle: "large",
    iosSpinnerStyle: "small",
    spinnerColor: "#f43f5e",
    splashFullScreen: true,
    splashImmersive: true,
  },
};
