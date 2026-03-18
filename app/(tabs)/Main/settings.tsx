import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { ChevronRight, User, Bell, Shield, CircleHelp, Info, LogOut, Moon, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const { colorScheme, toggleColorScheme } = useAppTheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  const [notifications, setNotifications] = React.useState(true);

  const SettingItem = ({ icon: Icon, label, value, onPress, isLast, rightContent }: any) => (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.settingItem, 
        { borderBottomColor: theme.border, borderBottomWidth: isLast ? 0 : 1 }
      ]}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: theme.secondary }]}>
          <Icon size={20} color={theme.text} />
        </View>
        <Text style={[styles.settingLabel, { color: theme.text }]}>{label}</Text>
      </View>
      <View style={styles.settingRight}>
        {rightContent ? rightContent : (
          <>
            {value && <Text style={[styles.settingValue, { color: theme.muted }]}>{value}</Text>}
            <ChevronRight size={18} color={theme.muted} />
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.muted }]}>{title}</Text>
      <View style={[styles.sectionCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {children}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.secondary }]} onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Section title="Profile">
          <SettingItem icon={User} label="Account info" value="Jesper Ian" />
          <SettingItem icon={Shield} label="Security" isLast={true} />
        </Section>

        <Section title="Preferences">
          <SettingItem 
            icon={Bell} 
            label="Notifications" 
            rightContent={
              <Switch 
                value={notifications} 
                onValueChange={setNotifications}
                trackColor={{ false: theme.secondary, true: theme.tint }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <SettingItem 
            icon={Moon} 
            label="Dark Mode" 
            rightContent={
              <Switch 
                value={colorScheme === 'dark'} 
                onValueChange={toggleColorScheme}
                trackColor={{ false: theme.secondary, true: theme.tint }}
                thumbColor="#FFFFFF"
              />
            }
            isLast={true}
          />
        </Section>

        <Section title="Help & Support">
          <SettingItem icon={CircleHelp} label="Help Center" />
          <SettingItem icon={Info} label="About SmartChef AI" isLast={true} />
        </Section>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => router.replace('/Auth/login')}
        >
          <LogOut size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={[styles.versionText, { color: theme.muted }]}>Version 1.0.2 (Build 2024)</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 40,
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 20,
  },
});
