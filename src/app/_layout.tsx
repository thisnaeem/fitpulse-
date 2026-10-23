import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts, PlusJakartaSans_400Regular, PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { FitStoreProvider, useFit } from '../store';
import { AuthProvider } from '../auth';
import { initAds } from '../ads';
import { C } from '../theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

function Gate({ children }: { children: React.ReactNode }) {
  const fit = useFit();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => { initAds(); }, []);

  useEffect(() => {
    if (!fit.loaded) return;
    const inOnboarding = segments[0] === 'onboarding';
    if (!fit.profile.onboarded && !inOnboarding) router.replace('/onboarding');
    if (fit.profile.onboarded && inOnboarding) router.replace('/(tabs)');
  }, [fit.loaded, fit.profile.onboarded, segments, router]);

  return <>{children}</>;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: C.bg }}>
      <SafeAreaProvider>
        <FitStoreProvider>
          <AuthProvider>
            <StatusBar style="light" />
            <Gate>
              <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: C.bg } }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="workout/[id]" />
                <Stack.Screen name="player/[id]" />
                <Stack.Screen name="auth/login" />
                <Stack.Screen name="auth/register" />
              </Stack>
            </Gate>
          </AuthProvider>
        </FitStoreProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
