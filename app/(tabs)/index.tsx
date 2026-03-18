import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView, Dimensions } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { Bell, Camera, ChevronRight, Clock, Star, Users, Settings } from 'lucide-react-native';


import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const RECENTLY_COOKED = [
  {
    id: '1',
    title: 'Mediterranean Salmon',
    subtitle: 'Healthy • High Protein',
    time: '25 m',
    image: require('@/assets/images/mediterranean_salmon_1773798250272.png'),
  },
  {
    id: '2',
    title: 'Artisan Pepperoni',
    subtitle: 'Comfort • Family Size',
    time: '40 m',
    image: require('@/assets/images/pepperoni_pizza_1773798546792.png'),
  },
  {
    id: 'rec3',
    title: 'Classic Carbonara',
    subtitle: 'Rich • Authentic',
    time: '20 m',
    image: require('@/assets/images/carbonara_1773798653961.png'),
  },
];


const TRENDING_RECIPES = [
  {
    id: '3',
    title: 'Spicy Miso Ramen',
    rating: 4.8,
    reviews: '2.1k',
    image: require('@/assets/images/miso_ramen_1773798576551.png'),
  },
  {
    id: '4',
    title: 'Truffle Beef Burger',
    rating: 4.9,
    reviews: '1.5k',
    image: require('@/assets/images/truffle_beef_burger_1773798604806.png'),
  },
  {
    id: '5',
    title: 'Thai Green Curry',
    rating: 4.7,
    reviews: '980',
    image: require('@/assets/images/thai_green_curry_1773798632156.png'),
  },
  {
    id: '6',
    title: 'Classic Carbonara',
    rating: 4.8,
    reviews: '3.4k',
    image: require('@/assets/images/carbonara_1773798653961.png'),
  },
];

export default function HomeScreen() {
  const { colorScheme } = useAppTheme();

  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.appName, { color: theme.text }]}>SmartChef AI</Text>
            <Text style={[styles.headerSubtitle, { color: theme.muted }]}>Ready to cook?</Text>
          </View>
          <View style={styles.headerActions}>

            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: theme.secondary, marginRight: 10 }]}
            >
              <Bell size={20} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: theme.secondary }]}
              onPress={() => router.push('/Main/settings')}
            >
              <Settings size={20} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={[styles.mainTitle, { color: theme.text }]}>What's in your kitchen today?</Text>
        </View>

        {/* Scan Button */}
        <TouchableOpacity 
          style={[styles.scanButton, { backgroundColor: theme.tint }]}
          onPress={() => router.push('/Main/scan')}
        >

          <Camera size={24} color="white" style={styles.scanIcon} />
          <Text style={styles.scanButtonText}>Scan Ingredients</Text>
        </TouchableOpacity>

        {/* Info Cards Row */}
        <View style={styles.infoCardsRow}>
          <TouchableOpacity style={[styles.infoCard, { backgroundColor: '#FFF5E9' }]}>
            <Text style={[styles.infoCardValue, { color: '#FF7A00' }]}>12 Items</Text>
            <Text style={[styles.infoCardLabel, { color: '#A67C52' }]}>in Pantry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.infoCard, { backgroundColor: '#F0F4FF' }]}>
            <Text style={[styles.infoCardValue, { color: '#3A57E8' }]}>Meal History</Text>
            <Text style={[styles.infoCardLabel, { color: '#6A7FC1' }]}>Past Cooked</Text>
          </TouchableOpacity>
        </View>

        {/* Recently Cooked */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recently Cooked</Text>
          <TouchableOpacity>
            <Text style={[styles.viewAll, { color: theme.tint }]}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentList}>
          {RECENTLY_COOKED.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.recentCard, { backgroundColor: theme.card }]}
              onPress={() => router.push(`/recipe/${item.id}`)}
            >
              <Image source={item.image} style={styles.recentImage} />
              <View style={styles.recentInfo}>
                <Text style={[styles.recentTitle, { color: theme.text }]} numberOfLines={1}>{item.title}</Text>
                <Text style={[styles.recentSubtitle, { color: theme.muted }]}>{item.subtitle}</Text>
                <View style={styles.timeTag}>
                  <Clock size={12} color={theme.muted} />
                  <Text style={[styles.timeText, { color: theme.muted }]}>{item.time}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trending Recipes */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Trending Recipes</Text>
        </View>
        <View style={styles.grid}>
          {TRENDING_RECIPES.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.gridItem, { backgroundColor: theme.card }]}
              onPress={() => router.push(`/recipe/${item.id}`)}
            >
              <Image source={item.image} style={styles.gridImage} />
              <TouchableOpacity style={styles.favoriteButton}>
                <Star size={14} color="#FFD700" fill="#FFD700" />
              </TouchableOpacity>
              <View style={styles.gridInfo}>
                <Text style={[styles.gridTitle, { color: theme.text }]} numberOfLines={1}>{item.title}</Text>
                <View style={styles.ratingRow}>
                  <Star size={12} color="#FFD700" fill="#FFD700" />
                  <Text style={[styles.ratingText, { color: theme.text }]}>{item.rating}</Text>
                  <Text style={[styles.reviewsText, { color: theme.muted }]}>({item.reviews})</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Fill space at bottom */}
        <View style={{ height: 100 }} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    marginBottom: 20,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
  },
  iconButton: {
    padding: 10,
    borderRadius: 12,
  },
  titleSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 36,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  scanIcon: {
    marginRight: 10,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  infoCardsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 15,
    marginBottom: 30,
  },
  infoCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  infoCardValue: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  infoCardLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  recentList: {
    paddingLeft: 20,
    paddingRight: 10,
    marginBottom: 30,
  },
  recentCard: {
    width: width * 0.45,
    marginRight: 15,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  recentInfo: {
    padding: 12,
  },
  recentTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  recentSubtitle: {
    fontSize: 12,
    marginBottom: 8,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (width - 45) / 2,
    marginBottom: 15,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gridImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  gridInfo: {
    padding: 12,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
  },
  reviewsText: {
    fontSize: 12,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 6,
    borderRadius: 12,
  },
});
