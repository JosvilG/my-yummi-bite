import React from 'react';
import { StyleSheet, View } from 'react-native';
import CameraView from '../components/CameraView';
import { COLORS } from '@/constants/theme';

const AddScreen = () => {
  return (
    <View style={styles.container}>
      <CameraView />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default AddScreen;
