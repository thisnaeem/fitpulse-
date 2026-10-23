import React, { useEffect, useRef } from 'react';
import { Platform, View } from 'react-native';
import mobileAds, { BannerAd, BannerAdSize, InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { ADMOB } from './config';

let initialized = false;
export function initAds() {
  if (initialized || Platform.OS !== 'android') return;
  initialized = true;
  mobileAds().initialize().catch(() => {});
}

export function AdBanner({ style }: { style?: object }) {
  if (Platform.OS !== 'android') return null;
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
  if (Platform.OS !== 'android') return;
  completions += 1;
  const now = Date.now();
  if (completions < 2 || now - lastShown < 180000) return;
  try {
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
