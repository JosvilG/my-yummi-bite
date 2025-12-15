import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView as ExpoCameraView, useCameraPermissions, type CameraType } from 'expo-camera';
import { useTranslation } from 'react-i18next';
import { FONTS } from '@/constants/theme';
import { useColors } from '@/shared/hooks/useColors';

type Props = {
  onPhotoCaptured?: (uri: string) => void;
};

const RecipeCameraView: React.FC<Props> = ({ onPhotoCaptured }) => {
  const { t } = useTranslation();
  const colors = useColors();
  const cameraRef = useRef<ExpoCameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    (async () => {
      if (!permission) {
        const result = await requestPermission();
        setHasPermission(result?.granted ?? false);
        return;
      }

      setHasPermission(permission.granted);
    })();
  }, [permission, requestPermission]);

  const handleFlipCamera = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleCapture = async () => {
    if (!cameraRef.current || isProcessing) return;

    try {
      setIsProcessing(true);
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (photo) {
        console.log('Captured photo:', photo.uri);
        onPhotoCaptured?.(photo.uri);
      }
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
        <Text style={[styles.permissionText, { color: colors.text }]}>{t('common.cameraPermission')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ExpoCameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing}>
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleFlipCamera}>
            <Text style={[styles.secondaryText, { color: colors.background }]}>{t('common.flip')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.captureButton, { backgroundColor: colors.primary }]} 
            onPress={handleCapture} 
            disabled={isProcessing}
          >
            <Text style={[styles.captureText, { color: colors.background }]}>
              {isProcessing ? t('common.saving') : t('common.capture')}
            </Text>
          </TouchableOpacity>
        </View>
      </ExpoCameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionText: {
    fontFamily: FONTS.medium,
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
    alignItems: 'center',
    marginTop: 12,
  },
  captureText: {
    fontFamily: FONTS.bold,
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
  },
});

export default RecipeCameraView;
