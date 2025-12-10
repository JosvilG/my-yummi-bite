import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '@/app/providers/AuthProvider';
import { useFavoriteRecipes } from '@/features/recipes/hooks/useFavoriteRecipes';
import ProfileHeader from '../components/ProfileHeader';
import FavoriteRecipeCard from '../components/FavoriteRecipeCard';
import FavoriteGridSkeleton from '@/shared/components/FavoriteGridSkeleton';
import { useUserProfile } from '../hooks/useUserProfile';
import { COLORS } from '@/constants/theme';
import type { MainStackParamList, TabParamList } from '@/types/navigation';
import type { FavoriteRecipeDoc } from '@/features/recipes/services/favoriteService';

type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Profile'>,
  NativeStackScreenProps<MainStackParamList>
>;

const ProfileScreen: React.FC<ProfileScreenProps> = observer(({ navigation }) => {
  const { user } = useAuth();
  const { favorites, loading } = useFavoriteRecipes();
  const { profile } = useUserProfile(user?.uid);

  const handleRecipePress = (recipeId: number) => {
    navigation.navigate('Info', { id: recipeId });
  };

  return (
    <View style={styles.container}>
      <ProfileHeader profile={profile} savedCount={favorites.length} />
      {loading ? (
        <FavoriteGridSkeleton count={9} />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item: FavoriteRecipeDoc) => item.docId}
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
  grid: {
    paddingBottom: 32,
  },
  card: {
    flex: 1 / 3,
  },
});

export default ProfileScreen;
