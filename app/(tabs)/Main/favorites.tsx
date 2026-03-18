import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Heart, Search, Clock, Users } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const FAVORITE_RECIPES = [
  {
    id: '1',
    title: 'Spicy Miso Ramen',
    time: '25m',
    servings: '2',
    image: require('@/assets/images/miso_ramen_1773798576551.png'),
  },
  {
    id: '2',
    title: 'Truffle Beef Burger',
    time: '30m',
    servings: '4',
    image: require('@/assets/images/truffle_beef_burger_1773798604806.png'),
  },
];

import { useAppTheme } from '@/hooks/use-app-theme';

export default function FavoritesScreen() {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme ?? 'light'];


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Favorites</Text>
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.secondary }]}>
          <Search size={20} color={theme.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={FAVORITE_RECIPES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Heart size={64} color={theme.muted} strokeWidth={1} />
            <Text style={[styles.emptyText, { color: theme.muted }]}>No favorites yet. Start hearting some recipes!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.card, { backgroundColor: theme.card }]}>
            <Image source={item.image} style={styles.cardImage} />
            <TouchableOpacity style={styles.heartButton}>
              <Heart size={18} color="#FF3B30" fill="#FF3B30" />
            </TouchableOpacity>
            <View style={styles.cardInfo}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>{item.title}</Text>
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Clock size={14} color={theme.muted} />
                  <Text style={[styles.statText, { color: theme.muted }]}>{item.time}</Text>
                </View>
                <View style={styles.stat}>
                  <Users size={14} color={theme.muted} />
                  <Text style={[styles.statText, { color: theme.muted }]}>{item.servings} Servings</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
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

  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  iconButton: {
    padding: 10,
    borderRadius: 12,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  cardImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  heartButton: {
    position: 'absolute',
    top: 5,
    left: 70,
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    maxWidth: '80%',
  },
});
