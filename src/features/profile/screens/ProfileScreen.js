import React from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { useAuth } from '@/app/providers/AuthProvider';
import { useFavoriteRecipes } from '@/features/recipes/hooks/useFavoriteRecipes';
import ProfileHeader from '../components/ProfileHeader';
import FavoriteRecipeCard from '../components/FavoriteRecipeCard';
import { useUserProfile } from '../hooks/useUserProfile';
import { COLORS } from '@/constants/theme';

const ProfileScreen = observer(({ navigation }) => {
  const { user } = useAuth();
  const { favorites, loading } = useFavoriteRecipes();
  const { profile } = useUserProfile(user?.uid);

  const handleRecipePress = recipeId => {
    navigation.navigate('Info', { id: recipeId });
  };

  return (
    <View style={styles.container}>
      <ProfileHeader profile={profile} savedCount={favorites.length} />
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.docId}
          numColumns={3}
          renderItem={({ item }) => (
            <Pressable onPress={() => handleRecipePress(item.id)} style={styles.card}>
              <FavoriteRecipeCard image={item.url} />
            </Pressable>
          )}
          contentContainerStyle={styles.grid}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    paddingBottom: 32,
  },
  card: {
    flex: 1 / 3,
  },
});

export default ProfileScreen;
