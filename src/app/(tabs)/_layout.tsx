import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { C, F } from '../../theme';
import { Icon, type IconName } from '../../icons';

function tabIcon(name: IconName) {
  return ({ focused }: { focused: boolean }) => (
    <View style={{
      width: 46, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center',
      backgroundColor: focused ? C.lime : 'transparent',
    }}>
      <Icon name={name} size={21} color={focused ? C.ink : C.faint} strokeWidth={focused ? 2.1 : 1.7} />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: C.bg },
        tabBarStyle: {
          position: 'absolute', left: 16, right: 16, bottom: 16,
          height: 66, paddingBottom: 8, paddingTop: 8,
          borderRadius: 28, borderWidth: 1, borderTopWidth: 1, borderColor: C.glassBorder,
          backgroundColor: 'rgba(16,20,24,0.94)',
          shadowColor: '#000', shadowOpacity: 0.45, shadowRadius: 18, shadowOffset: { width: 0, height: 10 },
          elevation: 14,
        },
        tabBarActiveTintColor: C.lime,
        tabBarInactiveTintColor: C.faint,
        tabBarLabelStyle: { fontFamily: F.semi, fontSize: 10.5, marginTop: 2 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: tabIcon('home') }} />
      <Tabs.Screen name="workouts" options={{ title: 'Workouts', tabBarIcon: tabIcon('dumbbell') }} />
      <Tabs.Screen name="tools" options={{ title: 'Tools', tabBarIcon: tabIcon('calc') }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarIcon: tabIcon('chart') }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: tabIcon('user') }} />
    </Tabs>
  );
}
