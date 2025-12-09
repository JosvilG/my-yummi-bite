import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS } from '@/constants/theme';
import InfoTag from '../InfoTag';

interface Props {
  cuisines?: string[];
  dishTypes?: string[];
}

const InfoTags: React.FC<Props> = ({ cuisines = [], dishTypes = [] }) => {
  const tags = [...cuisines, ...dishTypes];

  if (tags.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tags</Text>
      <View style={styles.tags}>
        {tags.map(tag => (
          <React.Fragment key={tag}>
            <InfoTag>{tag}</InfoTag>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.background,
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});

export default InfoTags;
