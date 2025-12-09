import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS } from '@/constants/theme';

interface DirectionStep {
  number: number;
  step: string;
}

interface Props {
  steps?: DirectionStep[];
}

const Directions: React.FC<Props> = ({ steps = [] }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Directions</Text>
      <FlatList
        data={steps}
        keyExtractor={(item: DirectionStep) => String(item.number)}
        renderItem={({ item, index }: { item: DirectionStep; index: number }) => (
          <Text style={styles.step}>
            {index + 1}. {item.step}
          </Text>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.background,
    marginBottom: 12,
    textAlign: 'center',
  },
  step: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.background,
    lineHeight: 20,
  },
  separator: {
    height: 10,
  },
});

export default Directions;
