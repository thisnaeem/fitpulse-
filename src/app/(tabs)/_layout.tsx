import { Tabs } from 'expo-router';
import React from 'react';
import { C, F } from '../../theme';
import { Icon, type IconName } from '../../icons';

function tabIcon(name: IconName) {
  return ({ focused }: { focused: boolean }) => (
    <Icon name={name} size={focused ? 25 : 23} color={focused ? C.lime : C.faint} strokeWidth={focused ? 2.1 : 1.7} />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: C.bg },
        tabBarStyle: {
          backgroundColor: '#12161A', borderTopColor: C.border, borderTopWidth: 1,
          height: 66, paddingBottom: 10, paddingTop: 6,
        },
        tabBarActiveTintColor: C.lime,
        tabBarInactiveTintColor: C.faint,
        tabBarLabelStyle: { fontFamily: F.semi, fontSize: 11 },
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
