import React from 'react';
import { StyleSheet, View } from 'react-native';
import CameraView from '../components/CameraView';
import { useColors } from '@/shared/hooks/useColors';

const AddScreen: React.FC = () => {
  const colors = useColors();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CameraView />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AddScreen;
