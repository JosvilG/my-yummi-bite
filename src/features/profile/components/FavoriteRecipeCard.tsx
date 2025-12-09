import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface Props {
  image: string;
}

const FavoriteRecipeCard: React.FC<Props> = ({ image }: Props) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1 / 3,
    aspectRatio: 1,
    padding: 4,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});

export default FavoriteRecipeCard;
