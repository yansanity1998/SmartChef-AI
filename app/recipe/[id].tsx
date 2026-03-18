import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, Dimensions, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ChevronLeft, Share2, Clock, Flame, Users, MessageCircle, CheckCircle2, Info, X } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const RECIPE_DATA = {
  '1': {
    title: 'Roasted Garlic Herb Chicken',
    prep: '15 min',
    cook: '45 min',
    calories: '450 kcal',
    servings: '4 Servings',
    image: require('@/assets/images/mediterranean_salmon_1773798250272.png'),
    ingredients: [
      '3 lbs Whole chicken, patted dry',
      '8 cloves Garlic, minced',
      '1/4 cup Extra virgin olive oil',
      '2 tbsp Fresh rosemary, chopped',
      '1 Lemon, sliced into rounds',
    ],
    instructions: [
      { step: 1, title: 'Preheat Oven', content: 'Preheat your oven to 425°F (220°C). Line a roasting pan with parchment paper or lightly grease it.' },
      { step: 2, title: 'Prepare Rub', content: 'In a small bowl, mix olive oil, minced garlic, rosemary, salt, and pepper until well combined.' },
      { step: 3, title: 'Season Chicken', content: 'Rub the garlic herb mixture all over the chicken, including under the skin. Place lemon slices inside the cavity.' },
      { step: 4, title: 'Roast', content: 'Roast for 45-50 minutes or until the internal temperature reaches 165°F (74°C).' },
    ],
  },
};

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const recipe = RECIPE_DATA[id as keyof typeof RECIPE_DATA] || RECIPE_DATA['1'];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image source={recipe.image} style={styles.headerImage} />
          
          <SafeAreaView style={styles.headerRow}>
            <TouchableOpacity 
              style={[styles.circleButton, { backgroundColor: 'rgba(255,255,255,0.8)' }]}
              onPress={() => router.back()}
            >
              <ChevronLeft size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.circleButton, { backgroundColor: 'rgba(255,255,255,0.8)' }]}
            >
              <Share2 size={20} color={Colors.light.text} />
            </TouchableOpacity>
          </SafeAreaView>

          <View style={styles.titleOverlay}>
            <View style={[styles.badge, { backgroundColor: theme.tint }]}>
              <Text style={styles.badgeText}>CHEF'S CHOICE</Text>
            </View>
            <Text style={styles.recipeTitle}>{recipe.title}</Text>
          </View>
        </View>

        {/* Info Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statItem, { backgroundColor: '#FFF5E9' }]}>
            <Clock size={20} color={theme.tint} />
            <Text style={[styles.statLabel, { color: theme.muted }]}>Prep</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>{recipe.prep}</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: '#F0F4FF' }]}>
            <ChefIcon size={20} color="#3A57E8" />
            <Text style={[styles.statLabel, { color: theme.muted }]}>Cook</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>{recipe.cook}</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: '#E9F9EF' }]}>
            <Flame size={20} color="#34C759" />
            <Text style={[styles.statLabel, { color: theme.muted }]}>Calories</Text>
            <Text style={[styles.statValue, { color: theme.text }]}>{recipe.calories}</Text>
          </View>
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Ingredients Needed</Text>
            <Text style={[styles.servingsText, { color: theme.tint }]}>{recipe.servings}</Text>
          </View>
          {recipe.ingredients.map((ing, idx) => (
            <View key={idx} style={styles.ingredientRow}>
              <View style={[styles.bullet, { backgroundColor: theme.tint }]} />
              <Text style={[styles.ingredientText, { color: theme.text }]}>{ing}</Text>
            </View>
          ))}
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 20 }]}>Instructions</Text>
          {recipe.instructions.map((step, idx) => (
            <View key={idx} style={styles.instructionRow}>
              <View style={[styles.stepCircle, { backgroundColor: theme.tint }]}>
                <Text style={styles.stepNumber}>{step.step}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={[styles.stepTitle, { color: theme.text }]}>{step.title}</Text>
                <Text style={[styles.stepText, { color: theme.muted }]}>{step.content}</Text>
              </View>
            </View>
          ))}
        </View>
        
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Floating Chat Tooltip & Button */}
      <View style={styles.floatingContainer}>
         <View style={[styles.chatTooltip, { backgroundColor: 'white' }]}>
           <View style={[styles.botSmallAvatar, { backgroundColor: theme.tint }]}>
             <Info size={14} color="white" />
           </View>
           <Text style={styles.tooltipText}>Need a substitution for garlic? I'm here to help!</Text>
           <TouchableOpacity style={styles.closeTooltip}>
             <X size={14} color="#AEAEB2" />
           </TouchableOpacity>
         </View>
         
         <TouchableOpacity 
          style={[styles.chatButton, { backgroundColor: theme.tint }]}
          onPress={() => router.push('/chat')}
         >
           <MessageCircle size={24} color="white" />
           <Text style={styles.chatButtonText}>Ask AI Assistant</Text>
         </TouchableOpacity>
      </View>
    </View>
  );
}

// Simple placeholder for Chef icon if not found
const ChefIcon = ({ size, color }: { size: number, color: string }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
     <Text style={{ color, fontSize: size * 0.8, fontWeight: 'bold' }}>🍳</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: height * 0.45,
    width: '100%',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 10,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '800',
  },
  recipeTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    gap: 12,
  },
  statItem: {
    flex: 1,
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  servingsText: {
    fontSize: 14,
    fontWeight: '700',
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 15,
    fontWeight: '500',
  },
  instructionRow: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stepNumber: {
    color: 'white',
    fontSize: 14,
    fontWeight: '800',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  stepText: {
    fontSize: 14,
    lineHeight: 20,
  },
  floatingContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  chatTooltip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    width: '90%',
  },
  botSmallAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  tooltipText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  closeTooltip: {
    padding: 4,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  chatButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});
