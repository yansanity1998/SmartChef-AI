import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Colors } from '@/constants/theme';
import { useAppTheme } from '@/hooks/use-app-theme';
import { X, Zap, Image as ImageIcon, RotateCw, Scan, Circle, ArrowRight, ChefHat } from 'lucide-react-native';
import { ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

import { auth, db } from '@/lib/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import axios from 'axios';
import Animated, {
    FadeInUp,
    FadeOutDown,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing
} from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

// Gemini Vision API Configuration
const GEMINI_API_KEY = "AIzaSyCLVAlJX1dkmQq3408Saa3NGUMgfkWiX_w";
// Models available in 2026: Try Flash 3.1, 2.0, and 1.5 versions
const MODELS = ["gemini-3.1-flash-lite", "gemini-2.0-flash", "gemini-1.5-flash-latest"];
const GEMINI_URL = (modelName: string) => `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
const OPEN_FOOD_FACTS_URL = (barcode: string) => `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`;

const INGREDIENT_POOL = [
    'Tomato', 'Onion', 'Garlic', 'Basil', 'Olive Oil',
    'Bell Pepper', 'Cucumber', 'Chicken', 'Beef', 'Pasta',
    'Cheese', 'Lemon', 'Avocado', 'Spinach', 'Mushroom',
    'Broccoli', 'Carrot', 'Potato', 'Egg', 'Milk'
];

export default function ScanScreen() {
    const { colorScheme } = useAppTheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();
    const [permission, requestPermission] = useCameraPermissions();
    const [isScanning, setIsScanning] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [scanMode, setScanMode] = useState<'vision' | 'barcode'>('vision');
    const [detectedIngredients, setDetectedIngredients] = useState<{ 
        name: string, 
        confidence: string, 
        x: number, 
        y: number,
        timestamp?: string,
        barcode?: string 
    }[]>([]);
    const [recommendedDish, setRecommendedDish] = useState<string | null>(null);
    const cameraRef = useRef<any>(null);

    // Scanner animation
    const scanLineY = useSharedValue(0);

    useEffect(() => {
        scanLineY.value = withRepeat(
            withTiming(height * 0.5, { duration: 2500, easing: Easing.linear }),
            -1,
            true
        );
    }, []);

    const animatedLineStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: scanLineY.value }]
    }));

    const identifyIngredient = async () => {
        if (isScanning || isSaved || !cameraRef.current) return;
        setIsScanning(true);
        setDetectedIngredients([]);

        try {
            console.log("--- STARTING VISION SCAN ---");
            const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
            if (!photo) throw new Error("Capture failed");

            const manipulated = await ImageManipulator.manipulateAsync(
                photo.uri,
                [{ resize: { width: 640 } }],
                { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true }
            );

            // Try different models until one works (fixes 404 issues in 2026)
            let aiRawText = "";
            for (const modelName of MODELS) {
                try {
                    console.log(`Trying model: ${modelName}...`);
                    const response = await axios.post(GEMINI_URL(modelName), {
                        contents: [{ parts: [
                            { text: "List ingredients in this food image AND suggest ONE specific dish that could be made with them. Return ONLY a JSON object with this structure: {\"ingredients\": [\"Tomato\", \"Onion\"], \"recommendedDish\": \"Classic Marinara Sauce\"}. If no food is found, return {\"ingredients\": [], \"recommendedDish\": null}." },
                            { inlineData: { mimeType: "image/jpeg", data: manipulated.base64 } }
                        ]}]
                    }, { timeout: 15000 });
                    
                    aiRawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (aiRawText) break; 
                } catch (e: any) {
                    const status = e.response?.status;
                    const errorMsg = e.response?.data?.error?.message || e.message;
                    console.warn(`Model ${modelName} failed (${status}): ${errorMsg}`);
                    continue; 
                }
            }

            if (aiRawText) {
                const jsonMatch = aiRawText.match(/\{.*\}/s);
                const data = JSON.parse((jsonMatch ? jsonMatch[0] : aiRawText).replace(/```json|```/g, "").trim());
                const ingredientNames: string[] = data.ingredients || [];
                const dish: string = data.recommendedDish || "Something Delicious!";

                if (ingredientNames.length > 0) {
                    setDetectedIngredients(ingredientNames.map(name => ({
                        name: name.charAt(0).toUpperCase() + name.slice(1),
                        confidence: "AI Vision (Gemini)",
                        x: (Math.random() * (width - 180)) + 40,
                        y: (Math.random() * (height * 0.2)) + 150,
                        timestamp: new Date().toISOString()
                    })));
                    setRecommendedDish(dish);
                    setIsSaved(false); // allow save after new detection
                }
            }
        } catch (error: any) {
            console.error("Vision Scan Error:", error.message);
            Toast.show({ type: 'error', text1: 'Vision Error', text2: 'Models are unavailable, try Barcode mode' });
        } finally {
            setIsScanning(false);
        }
    };

    const handleBarcodeScanned = async ({ data }: { data: string }) => {
        // Prevent multiple scans of the same item/looping
        if (isScanning || isSaved || scanMode !== 'barcode' || detectedIngredients.length > 0) return;
        setIsScanning(true);
        setDetectedIngredients([]);

        try {
            console.log("--- BARCODE SCANNED ---", data);
            const response = await axios.get(OPEN_FOOD_FACTS_URL(data));
            const product = response.data.product;

            if (product && (product.ingredients_text || product.product_name)) {
                // If there's an ingredients list, parse it, otherwise just use product name
                const baseName = product.product_name || "Unknown Product";
                const ingredients = product.ingredients_text 
                    ? product.ingredients_text.split(/[,;]+/).map((i: string) => i.trim().replace(/[\*\_\(\)\[\]]/g, '')).slice(0, 5)
                    : [baseName];

                setDetectedIngredients(ingredients.map((name: string) => ({
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                    confidence: "99% (Packaged)",
                    x: (Math.random() * (width - 180)) + 40,
                    y: (Math.random() * (height * 0.2)) + 150,
                    timestamp: new Date().toISOString(),
                    barcode: data
                })));
                setIsSaved(false); // Unlock saving for this new detection

                Toast.show({ type: 'success', text1: 'Product Found', text2: baseName });
            } else {
                Toast.show({ type: 'info', text1: 'Scanner', text2: 'Barcode not in our database' });
            }
        } catch (error: any) {
            const msg = error?.response?.data?.message || error.message;
            console.error("Barcode Scan Error:", msg);
            if (msg?.toLowerCase().includes('permission')) {
                Toast.show({ type: 'error', text1: 'Firebase Error', text2: 'Check Firestore Rules in Firebase Console' });
            } else {
                Toast.show({ type: 'error', text1: 'Scan Error', text2: 'Could not save. Check connection.' });
            }
        } finally {
            setIsScanning(false);
        }
    };

  const saveScanSession = async () => {
    const user = auth.currentUser;
    if (!user) {
        Alert.alert('Not Logged In', 'Please login to save your scan.');
        return;
    }
    if (detectedIngredients.length === 0) {
        Alert.alert('Nothing to Save', 'Scan some ingredients first!');
        return;
    }
    if (isSaved) {
        Alert.alert('Already Saved', 'This scan has already been saved. Press the red restart button to scan again.');
        return;
    }

    try {
        console.log("Saving scan session to Firebase...");
        const names = detectedIngredients.map(i => i.name);
        await addDoc(collection(db, 'scans'), {
            userId: user.uid,
            scanType: scanMode, // 'vision' or 'barcode'
            ingredients: names,
            suggestedDish: recommendedDish,
            detections: detectedIngredients.map(i => ({
                name: i.name,
                confidence: i.confidence,
                x: i.x ?? 0,
                y: i.y ?? 0,
                timestamp: i.timestamp || new Date().toISOString(),
                barcode: i.barcode ?? null, 
                imageUrl: (i as any).imageUrl ?? null
            })),
            createdAt: serverTimestamp(),
        });
        
        setIsSaved(true); // Lock - prevent unlimited scans
        console.log("Scan session saved successfully!");

        Alert.alert(
            '✅ Scan Saved!',
            `${names.length} ingredient${names.length > 1 ? 's' : ''} saved:\n\n${names.join(', ')}\n\nWould you like to see recipe suggestions?`,
            [
                {
                    text: 'Scan Again',
                    style: 'cancel',
                    onPress: () => {
                        setDetectedIngredients([]);
                        setIsSaved(false);
                    }
                },
                {
                    text: 'See Recipes →',
                    onPress: () => {
                        router.push({
                            pathname: '/(tabs)/Main/recipes',
                            params: { ingredients: names.join(',') }
                        });
                    }
                }
            ]
        );
    } catch (error: any) {
        console.error("Save Error:", error.code, error.message);
        if (error.code === 'permission-denied' || error.message?.includes('permission')) {
            Alert.alert(
                '🔒 Permission Denied',
                'Your Firestore rules are blocking writes.\n\nGo to Firebase Console → Firestore → Rules and allow authenticated writes.',
                [{ text: 'OK' }]
            );
        } else {
            Alert.alert('Save Failed', error.message || 'Could not connect to database. Check your internet connection.');
        }
    }
  };

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
      <CameraView 
        style={styles.camera} 
        facing="back" 
        ref={cameraRef}
        onBarcodeScanned={scanMode === 'barcode' ? handleBarcodeScanned : undefined}
      >
        <SafeAreaView style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
              <X size={28} color="white" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Ingredient Scanner</Text>
              <Text style={styles.headerSubtitle}>{scanMode === 'vision' ? 'AI VISION ACTIVE' : 'BARCODE SCANNER ACTIVE'}</Text>
            </View>
            <TouchableOpacity onPress={() => setScanMode(scanMode === 'vision' ? 'barcode' : 'vision')} style={styles.iconButton}>
              {scanMode === 'vision' ? <RotateCw size={24} color="white" /> : <Scan size={24} color="white" />}
            </TouchableOpacity>
          </View>

          {/* Scanner Outline */}
          <View style={styles.scannerFrame}>
            <View style={[styles.cornerTopLeft, scanMode === 'barcode' && { borderColor: '#4CAF50' }]} />
            <View style={[styles.cornerTopRight, scanMode === 'barcode' && { borderColor: '#4CAF50' }]} />
            <View style={[styles.cornerBottomLeft, scanMode === 'barcode' && { borderColor: '#4CAF50' }]} />
            <View style={[styles.cornerBottomRight, scanMode === 'barcode' && { borderColor: '#4CAF50' }]} />
            
            {/* Dynamic Scanning Line */}
            <Animated.View style={[styles.scanLine, animatedLineStyle, scanMode === 'barcode' && { backgroundColor: '#4CAF50', shadowColor: '#4CAF50' }]} />

            {/* Detected Labels */}
            {detectedIngredients.map((ing, idx) => (
              <Animated.View 
                entering={FadeInUp.delay(idx * 100)}
                key={`${ing.name}-${idx}`} 
                style={[
                    styles.detectionLabel, 
                    { left: ing.x, top: ing.y, backgroundColor: scanMode === 'barcode' ? '#4CAF50' : theme.tint }
                  ]}
                >
                  <Text style={styles.detectionText}>{ing.name}</Text>
                  <Circle size={10} color="white" fill="white" style={styles.checkIcon} />
                </Animated.View>
              ))}
            </View>

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            <Text style={styles.guideText}>Hold steady to identify ingredients</Text>
                        <View style={styles.detectedRow}>
               {detectedIngredients.length === 0 ? (
                 <Text style={[styles.guideText, { opacity: 0.6 }]}>No items detected yet...</Text>
               ) : (
                 detectedIngredients.map((item, index) => (
                   <Animated.View entering={FadeInUp} key={index} style={styles.detectedPreview}>
                     <View style={[styles.dot, { backgroundColor: theme.tint }]} />
                     <Text style={styles.thumbCount}>{item.name}</Text>
                   </Animated.View>
                 ))
               )}
            </View>

             <View style={styles.actionsRow}>
              <TouchableOpacity 
                style={[
                  styles.sideButton, 
                  detectedIngredients.length > 0 ? { backgroundColor: '#FF3B30' } : (scanMode === 'barcode' && { backgroundColor: '#4CAF50' })
                ]}
                onPress={() => {
                  if (detectedIngredients.length > 0) {
                    setDetectedIngredients([]); // Restart scan
                    setRecommendedDish(null);   // Reset suggestion
                    setIsSaved(false);           // Unlock scanning
                  } else {
                    setScanMode(scanMode === 'vision' ? 'barcode' : 'vision');
                  }
                }}
              >
                {detectedIngredients.length > 0 ? (
                  <RotateCw size={24} color="white" />
                ) : (
                  scanMode === 'vision' ? <Scan size={24} color="white" /> : <Zap size={24} color="white" />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.captureButton} 
                onPress={scanMode === 'vision' ? identifyIngredient : undefined}
                disabled={isScanning || scanMode === 'barcode'}
              >
                <View style={[styles.captureInner, scanMode === 'barcode' && { opacity: 0.3 }]}>
                  {isScanning ? (
                    <ActivityIndicator color={theme.tint} size="large" />
                  ) : (
                    <Scan size={32} color={scanMode === 'barcode' ? '#4CAF50' : theme.tint} />
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.sideButton, detectedIngredients.length > 0 && { backgroundColor: theme.tint }]}
                onPress={saveScanSession}
              >
                <ArrowRight size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            {detectedIngredients.length > 0 && (
                <Animated.View entering={FadeInUp} style={styles.suggestionContainer}>
                    <TouchableOpacity 
                        style={[styles.suggestionButton, { backgroundColor: theme.tint }]}
                        onPress={saveScanSession}
                    >
                        <ChefHat size={20} color="white" />
                        <Text style={styles.suggestionText}>
                            {recommendedDish ? `Cook ${recommendedDish}?` : "What should I cook?"}
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
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
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#FF9500',
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 10,
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
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
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
  suggestionContainer: {
    marginTop: 20,
    width: '100%',
  },
  suggestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderRadius: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  suggestionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
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
