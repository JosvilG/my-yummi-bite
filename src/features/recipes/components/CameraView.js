import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Camera } from 'expo-camera';
import { COLORS, FONTS } from '@/constants/theme';

const CameraView = () => {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [facing, setFacing] = useState(Camera.Constants.Type.back);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleFlipCamera = () => {
    setFacing(current => (current === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back));
  };

  const handleCapture = async () => {
    if (!cameraRef.current || isProcessing) return;

    try {
      setIsProcessing(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      console.log('Captured photo:', photo.uri);
    } finally {
      setIsProcessing(false);
    }
  };

  if (hasPermission === null) {
    return <View style={styles.centered} />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>Camera access is required to capture recipes.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera ref={cameraRef} style={StyleSheet.absoluteFill} type={facing}>
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleFlipCamera}>
            <Text style={styles.secondaryText}>Flip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={handleCapture} disabled={isProcessing}>
            <Text style={styles.captureText}>{isProcessing ? 'Saving...' : 'Capture'}</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionText: {
    fontFamily: FONTS.medium,
    color: COLORS.text,
    textAlign: 'center',
    marginHorizontal: 32,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 48,
    alignItems: 'center',
  },
  captureButton: {
    width: 160,
    paddingVertical: 16,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    marginTop: 12,
  },
  captureText: {
    fontFamily: FONTS.bold,
    color: COLORS.background,
    textTransform: 'uppercase',
  },
  secondaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  secondaryText: {
    fontFamily: FONTS.medium,
    color: COLORS.background,
  },
});

export default CameraView;
