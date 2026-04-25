export default {
  expo: {
    name: 'ImtuDev',
    slug: 'imtudev',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      backgroundColor: '#F9F9FB',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: false,
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#F9F9FB',
      },
      package: 'com.imtudev.app',
      usesCleartextTraffic: true,
    },
    extra: {
      SUPABASE_URL: 'https://kmqkivzznhkrzzhdespc.supabase.co/',
      SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttcWtpdnp6bmhrcnp6aGRlc3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMTM2NDIsImV4cCI6MjA5MjU4OTY0Mn0.D8ikzPmkHzNQH_u2zzc5ezmLjZeSKpQsB8drs9Erbaw',
      eas: {
        projectId: '8e001a35-2271-479a-80f2-e832f3598540',
      },
    },
  },
};
