import React from 'react';
import { NativeModules, Platform, View } from 'react-native';
import { ADMOB } from './config';

// react-native-google-mobile-ads is a NATIVE module: it is present in EAS /
// dev-client builds but NOT in Expo Go. Importing it unconditionally crashes
// Expo Go at load time, so it is loaded lazily and only when the native
// module actually exists. In Expo Go, ads silently disable themselves and
// the rest of the app runs normally.
let Ads: any = null;
try {
  if (Platform.OS === 'android' && NativeModules.RNGoogleMobileAdsModule) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Ads = require('react-native-google-mobile-ads');
  }
} catch {
  Ads = null;
}

let initialized = false;
export function initAds() {
  if (!Ads || initialized || Platform.OS !== 'android') return;
  initialized = true;
  Ads.default().initialize().catch(() => {});
}

export function AdBanner({ style }: { style?: object }) {
  if (!Ads || Platform.OS !== 'android') return null;
  const { BannerAd, BannerAdSize, TestIds } = Ads;
  return (
    <View style={[{ alignItems: 'center' }, style]}>
      <BannerAd unitId={ADMOB.banner || TestIds.BANNER} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </View>
  );
}

// Interstitial with a frequency cap: at most once per 3 minutes,
// and only after the 2nd workout completion of the session.
let lastShown = 0;
let completions = 0;
export function showWorkoutInterstitial() {
  if (!Ads || Platform.OS !== 'android') return;
  completions += 1;
  const now = Date.now();
  if (completions < 2 || now - lastShown < 180000) return;
  try {
    const { InterstitialAd, AdEventType, TestIds } = Ads;
    const ad = InterstitialAd.createForAdRequest(ADMOB.interstitial || TestIds.INTERSTITIAL);
    const unsubLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      lastShown = Date.now();
      ad.show().catch(() => {});
      unsubLoaded();
    });
    const unsubErr = ad.addAdEventListener(AdEventType.ERROR, () => { unsubLoaded(); unsubErr(); });
    ad.load();
  } catch { /* ads are optional garnish — never break the flow */ }
}
