import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.suzgec.app',
  appName: 'SüzGeç',
  webDir: 'public',
  server: {
    // Canlı web sitenize yönlendir — birebir aynı tasarım!
    url: 'https://suzgec.vercel.app',
    androidScheme: 'https',
  },
  android: {
    backgroundColor: '#1C1F26',
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#6b21a8',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      launchAutoHide: true,
    },
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#1C1F26',
    },
  },
};

export default config;
