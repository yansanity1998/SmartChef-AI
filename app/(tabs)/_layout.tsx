import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Home, NotebookText, Scan, Heart, MessageSquare } from 'lucide-react-native';

export default function TabLayout() {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.muted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Main/recipes"
        options={{
          title: 'Recipes',
          tabBarIcon: ({ color }) => <NotebookText size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Main/scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color }) => (
            <View style={[styles.scanButton, { backgroundColor: theme.tint }]}>
              <Scan size={28} color="white" />
            </View>
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="Main/favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="Main/chat"
        options={{
          title: 'AI Chat',
          tabBarIcon: ({ color }) => <MessageSquare size={24} color={color} />,
        }}
      />

      {/* Hide screens from tab bar */}
      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="Main/settings"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  scanButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
});
