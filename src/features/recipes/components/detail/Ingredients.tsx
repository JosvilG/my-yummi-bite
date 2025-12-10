import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { FONTS } from '@/constants/theme';
import { useColors } from '@/shared/hooks/useColors';

interface IngredientItem {
  id: number;
  name: string;
  image?: string;
  amount?: number;
  unit?: string;
  measures?: { metric?: { amount?: number; unitShort?: string } };
}

interface Props {
  extendedIngredients?: IngredientItem[];
}

const IngredientCard: React.FC<{ item: IngredientItem }> = ({ item }) => {
  const colors = useColors();
  const amount = item?.measures?.metric?.amount ?? item?.amount ?? '';
  const unit = item?.measures?.metric?.unitShort ?? item?.unit ?? '';

  return (
    <View style={styles.ingredient}>
      <Image
        style={[styles.image, { backgroundColor: colors.background }]}
        source={{ uri: `https://spoonacular.com/cdn/ingredients_100x100/${item?.image}` }}
      />
      <Text numberOfLines={2} style={[styles.name, { color: colors.background }]}>
        {item?.name}
      </Text>
      <Text style={[styles.amount, { color: colors.background }]}>
        {amount} {unit}
      </Text>
    </View>
  );
};

const Ingredients: React.FC<Props> = ({ extendedIngredients = [] }) => {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.background }]}>Ingredients</Text>
      <FlatList
        data={extendedIngredients}
        keyExtractor={item => String(item.id)}
        numColumns={3}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <IngredientCard item={item} />}
      />
    </View>
  );
};

const IMAGE_SIZE = 70;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    marginBottom: 12,
  },
  list: {
    gap: 16,
  },
  ingredient: {
    width: '30%',
    alignItems: 'center',
    marginHorizontal: '1.5%',
    marginBottom: 16,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    marginBottom: 8,
  },
  name: {
    fontFamily: FONTS.medium,
    textAlign: 'center',
    fontSize: 13,
  },
  amount: {
    fontFamily: FONTS.bold,
    marginTop: 4,
    fontSize: 12,
  },
});

export default Ingredients;
