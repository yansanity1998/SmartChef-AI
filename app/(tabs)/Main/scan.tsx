import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Image, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { X, Zap, Image as ImageIcon, RotateCw, Scan, Circle } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function ScanScreen() {
  const { colorScheme } = useAppTheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const [detectedIngredients, setDetectedIngredients] = useState([
    { name: 'Tomato', confidence: '98%', x: 120, y: 180 },
    { name: 'Onion', confidence: '95%', x: 200, y: 350 },
  ]);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.permissionContainer}>
          <Text style={[styles.permissionText, { color: theme.text }]}>We need your permission to show the camera</Text>
          <TouchableOpacity 
            style={[styles.permissionButton, { backgroundColor: theme.tint }]} 
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back">
        <SafeAreaView style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
              <X size={28} color="white" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Ingredient Scanner</Text>
              <Text style={styles.headerSubtitle}>SMARTCHEF AI ACTIVE</Text>
            </View>
            <TouchableOpacity style={styles.iconButton}>
              <Zap size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Scanner Outline */}
          <View style={styles.scannerFrame}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
            
            {/* Detected Labels */}
            {detectedIngredients.map((ing, idx) => (
              <View 
                key={idx} 
                style={[
                  styles.detectionLabel, 
                  { left: ing.x, top: ing.y, backgroundColor: theme.tint }
                ]}
              >
                <Text style={styles.detectionText}>{ing.name} {ing.confidence}</Text>
                <Circle size={12} color="white" fill="white" style={styles.checkIcon} />
              </View>
            ))}
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            <Text style={styles.guideText}>Hold steady to identify ingredients</Text>
            
            <View style={styles.detectedRow}>
               <View style={styles.detectedPreview}>
                 <Image source={require('@/assets/images/mediterranean_salmon_1773798250272.png')} style={styles.thumbImage} />
                 <Text style={styles.thumbCount}>Tomato</Text>
               </View>
               <View style={styles.detectedPreview}>
                 <Image source={require('@/assets/images/carbonara_1773798653961.png')} style={styles.thumbImage} />
                 <Text style={styles.thumbCount}>Onion</Text>
               </View>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.sideButton}>
                <ImageIcon size={24} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.captureButton} onPress={() => router.push('/Main/recipes')}>
                <View style={styles.captureInner}>
                  <CameraView />
                  <Scan size={32} color={theme.tint} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sideButton}>
                <RotateCw size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    flex: 1,
    marginVertical: 40,
    marginHorizontal: 30,
    position: 'relative',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#FF9500',
    borderTopLeftRadius: 20,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#FF9500',
    borderTopRightRadius: 20,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#FF9500',
    borderBottomLeftRadius: 20,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#FF9500',
    borderBottomRightRadius: 20,
  },
  detectionLabel: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 6,
  },
  detectionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  checkIcon: {
    marginLeft: 4,
  },
  bottomControls: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    alignItems: 'center',
  },
  guideText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 20,
  },
  detectedRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  detectedPreview: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 6,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  thumbImage: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  thumbCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  sideButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: '100%',
    height: '100%',
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
  permissionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});
