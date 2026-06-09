import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, Heart, BarChart3, Bell, User } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

function TabIcon({ icon: Icon, color, focused }: { icon: any; color: string; focused: boolean }) {
  if (focused) {
    return (
      <LinearGradient
        colors={['#6b21a8', '#4f46e5', '#3b82f6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.activeTab}
      >
        <Icon size={20} color="#fff" />
      </LinearGradient>
    );
  }
  return <Icon size={20} color={color} />;
}

export default function TabLayout() {
  const scheme = useColorScheme() ?? 'light';
  const colors = Colors[scheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color, focused }) => <TabIcon icon={Home} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="listelerim"
        options={{
          title: 'Listelerim',
          tabBarIcon: ({ color, focused }) => <TabIcon icon={Heart} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="karsilastirma"
        options={{
          title: 'Karşılaştır',
          tabBarIcon: ({ color, focused }) => <TabIcon icon={BarChart3} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="bildirimler"
        options={{
          title: 'Bildirimler',
          tabBarIcon: ({ color, focused }) => <TabIcon icon={Bell} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => <TabIcon icon={User} color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeTab: {
    width: 40,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
