import { z } from 'zod';

/**
 * Scanner Data Schema for Firebase
 * This defines how scanned ingredient data is structured in Firestore
 */

// Schema for a single detected ingredient
export const DetectedIngredientSchema = z.object({
  name: z.string().min(1),
  confidence: z.string().or(z.number()), // Support both "AI Vision" and 0.95
  timestamp: z.any(), // Flexible for Firestore serverTimestamp or string
  x: z.number().optional(),
  y: z.number().optional(),
  imageUrl: z.string().optional(),
  barcode: z.string().optional(), // Added for barcode scanning traceability
});

// Schema for a scan session (multiple ingredients found at once)
export const ScanSessionSchema = z.object({
  userId: z.string(),
  scanType: z.enum(['vision', 'barcode']),
  ingredients: z.array(z.string()), 
  detections: z.array(DetectedIngredientSchema),
  suggestedDish: z.string().optional(), // AI-powered suggestion for the session
  createdAt: z.any(),
});

export type DetectedIngredient = z.infer<typeof DetectedIngredientSchema>;
export type ScanSession = z.infer<typeof ScanSessionSchema>;
