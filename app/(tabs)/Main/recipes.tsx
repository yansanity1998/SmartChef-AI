import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Search, Filter, Clock, Flame, ChefHat } from 'lucide-react-native';
import { useState, useEffect } from 'react';

const { width } = Dimensions.get('window');

import { useAppTheme } from '@/hooks/use-app-theme';
import { useLocalSearchParams, useRouter } from 'expo-router';

const ALL_RECIPES = [
  {
    id: '1',
    title: 'Rustic Tomato Bruschetta',
    ingredients: ['Tomato', 'Garlic', 'Basil', 'Olive Oil', 'Bread'],
    time: '15m',
    difficulty: 'Easy',
    calories: '180 kcal',
    image: require('@/assets/images/mediterranean_salmon_1773798250272.png'),
  },
  {
    id: '2',
    title: 'Roasted Garlic Tomato Soup',
    ingredients: ['Tomato', 'Garlic', 'Onion', 'Basil'],
    time: '40m',
    difficulty: 'Medium',
    calories: '240 kcal',
    image: require('@/assets/images/carbonara_1773798653961.png'),
  },
  {
    id: '3',
    title: 'Classic Pasta Pomodoro',
    ingredients: ['Pasta', 'Tomato', 'Garlic', 'Basils', 'Parmesan'],
    time: '20m',
    difficulty: 'Easy',
    calories: '420 kcal',
    image: require('@/assets/images/thai_green_curry_1773798632156.png'),
  },
  {
    id: '4',
    title: 'Lemon Herb Salmon',
    ingredients: ['Salmon', 'Lemon', 'Garlic', 'Olive Oil'],
    time: '25m',
    difficulty: 'Easy',
    calories: '320 kcal',
    image: require('@/assets/images/mediterranean_salmon_1773798250272.png'),
  },
  {
    id: '5',
    title: 'Ginger Soy Shrimp',
    ingredients: ['Shrimp', 'Ginger', 'Soy Sauce', 'Garlic'],
    time: '15m',
    difficulty: 'Medium',
    calories: '210 kcal',
    image: require('@/assets/images/thai_green_curry_1773798632156.png'),
  }
];

export default function RecipesScreen() {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const params = useLocalSearchParams<{ ingredients?: string }>();
  const [recipes, setRecipes] = useState(ALL_RECIPES);
  const [scanKeywords, setScanKeywords] = useState<string[]>([]);

  useEffect(() => {
    if (params.ingredients) {
      const keywords = params.ingredients.toLowerCase().split(',');
      setScanKeywords(keywords);

      // Filter and sort by match count
      const filtered = ALL_RECIPES.map(recipe => {
        const matches = recipe.ingredients.filter(ing => 
          keywords.some(kw => ing.toLowerCase().includes(kw) || kw.includes(ing.toLowerCase()))
        );
        const matchPercentage = Math.round((matches.length / recipe.ingredients.length) * 100);
        return { ...recipe, matchScore: matchPercentage };
      })
      .filter(r => r.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);

      setRecipes(filtered.length > 0 ? filtered : ALL_RECIPES);
    }
  }, [params.ingredients]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Recipe Library</Text>
        <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.secondary }]}>
          <Filter size={20} color={theme.text} />
        </TouchableOpacity>
      </View>


      <View style={[styles.searchBar, { backgroundColor: theme.secondary }]}>
        <Search size={20} color={theme.muted} />
        <Text style={[styles.placeholder, { color: theme.muted }]}>
            {scanKeywords.length > 0 ? `Matching: ${scanKeywords.join(', ')}` : 'Search recipes...'}
        </Text>
      </View>

      {recipes.length === 0 ? (
          <View style={styles.emptyState}>
              <ChefHat size={60} color={theme.muted} />
              <Text style={[styles.emptyText, { color: theme.text }]}>No matching recipes found</Text>
              <TouchableOpacity onPress={() => setRecipes(ALL_RECIPES)}>
                  <Text style={{ color: theme.tint, fontWeight: '700', marginTop: 10 }}>View all recipes</Text>
              </TouchableOpacity>
          </View>
      ) : (
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }: { item: any }) => (
              <TouchableOpacity 
                style={[styles.card, { backgroundColor: theme.card }]}
                onPress={() => router.push(`/recipe/${item.id}`)}
              >
                <Image source={item.image} style={styles.cardImage} />
    
                <View style={[styles.matchBadge, { backgroundColor: theme.tint }]}>
                  <Text style={styles.matchText}>{item.matchScore || '100'}% Match</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={[styles.cardTitle, { color: theme.text }]}>{item.title}</Text>
                  <View style={styles.statsRow}>
                    <View style={styles.stat}>
                      <Clock size={14} color={theme.muted} />
                      <Text style={[styles.statText, { color: theme.muted }]}>{item.time}</Text>
                    </View>
                    <View style={styles.stat}>
                      <Flame size={14} color={theme.muted} />
                      <Text style={[styles.statText, { color: theme.muted }]}>{item.calories}</Text>
                    </View>
                    <View style={[styles.difficultyBadge, { backgroundColor: theme.secondary }]}>
                      <Text style={[styles.difficultyText, { color: theme.text }]}>{item.difficulty}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
      )}
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 12,
    borderRadius: 14,
    gap: 10,
    marginBottom: 20,
  },
  placeholder: {
    fontSize: 16,
    fontWeight: '500',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  matchBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  matchText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  cardInfo: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    fontWeight: '500',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20,
  },
});
