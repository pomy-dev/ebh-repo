import React from 'react';
import { Tabs } from 'expo-router';
import { Icons } from '../../constant/icons';;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Icons.FontAwesome name='home' size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="maintenance"
        options={{
          title: 'Requests',
          tabBarIcon: ({ color, size }) => <Icons.MaterialCommunityIcons name='clipboard-list-outline' size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: 'Payments',
          tabBarIcon: ({ color, size }) => <Icons.AntDesign name='wallet' size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, size }) => <Icons.AntDesign name='bells' size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Icons.Ionicons name='settings-outline' size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}