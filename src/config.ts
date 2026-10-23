// FitPulse runtime config.
// API_URL: set after the Vercel deploy (e.g. "https://fitpulse-api.vercel.app").
// While empty, the app runs fully offline (guest mode) and auth shows
// "backend not connected yet" instead of failing.
export const API_URL = 'https://fitpulse-api.vercel.app';

// AdMob — Google's official TEST ids (safe for development builds).
// Replace with the real ids from the user's AdMob account before production.
export const ADMOB = {
  androidAppId: 'ca-app-pub-3940256099942544~3347511713',
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
};
