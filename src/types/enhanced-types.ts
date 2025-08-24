/**
 * ENHANCED TYPE SYSTEM 2030
 * Advanced runtime validation and type safety
 */

import { z } from 'zod'

// === BRANDED TYPES FOR ULTIMATE TYPE SAFETY ===
declare const __brand: unique symbol
type Brand<T, TBrand> = T & { [__brand]: TBrand }

export type UserId = Brand<string, 'UserId'>
export type ReadingId = Brand<string, 'ReadingId'>
export type SessionId = Brand<string, 'SessionId'>
export type CardId = Brand<string, 'CardId'>
export type AIModelId = Brand<string, 'AIModelId'>
export type PromptId = Brand<string, 'PromptId'>

// === RUNTIME VALIDATION SCHEMAS ===

// Core Tarot Entities
export const TarotCardSchema = z.object({
  id: z.string().transform(val => val as CardId),
  name: z.string().min(1).max(100),
  arcana: z.enum(['major', 'minor', 'hidden']),
  suit: z.enum(['cups', 'wands', 'swords', 'pentacles']).optional(),
  number: z.number().int().min(1).max(21).optional(),
  upright_meaning: z.string().min(10),
  reversed_meaning: z.string().min(10),
  keywords: z.array(z.string()).min(3),
  element: z.enum(['fire', 'water', 'air', 'earth', 'spirit']).optional(),
  zodiac: z.string().optional(),
  planet: z.string().optional(),
  hebrew_letter: z.string().optional(),
  chakra: z.enum(['root', 'sacral', 'solar', 'heart', 'throat', 'third_eye', 'crown']).optional(),
  numerology: z.number().int().min(0).max(9).optional(),
  imagery_description: z.string().min(20),
  spiritual_message: z.string().min(15),
  traditional_meaning: z.string().min(10),
  modern_interpretation: z.string().min(10),
  love_meaning: z.string().min(10),
  career_meaning: z.string().min(10),
  health_meaning: z.string().min(10),
  spiritual_meaning: z.string().min(10),
  shadow_aspect: z.string().min(10),
  light_aspect: z.string().min(10),
  meditation_focus: z.string().min(10),
  affirmation: z.string().min(5),
  journal_prompt: z.string().min(10),
  crystals: z.array(z.string()).optional(),
  colors: z.array(z.string()).optional(),
  symbols: z.array(z.string()).optional(),
  upgrade_levels: z.array(z.object({
    level: z.number().int().min(1),
    title: z.string(),
    description: z.string(),
    unlock_condition: z.string()
  })).optional(),
  rarity: z.enum(['common', 'rare', 'epic', 'legendary', 'mythic']).default('common'),
  unlock_level: z.number().int().min(0).default(0),
  mastery_progress: z.number().min(0).max(100).default(0)
})

export const TarotReadingSchema = z.object({
  id: z.string().transform(val => val as ReadingId),
  user_id: z.string().transform(val => val as UserId),
  session_id: z.string().transform(val => val as SessionId),
  question: z.string().min(1).max(1000),
  cards: z.array(TarotCardSchema).min(1).max(21),
  spread_type: z.enum([
    'single', 'three_card', 'cross', 'celtic_cross', 'relationship', 
    'career', 'spiritual', 'shadow_work', 'moon_cycle', 'chakra', 'custom'
  ]),
  reading_text: z.string().min(50),
  ai_confidence: z.number().min(0).max(1),
  mystical_insights: z.array(z.string()),
  spiritual_guidance: z.array(z.string()),
  practical_advice: z.array(z.string()),
  timestamp: z.number().int().positive(),
  duration_seconds: z.number().int().positive(),
  user_satisfaction: z.number().min(1).max(10).optional(),
  tags: z.array(z.string()).default([]),
  is_favorite: z.boolean().default(false),
  visibility: z.enum(['private', 'shared', 'public']).default('private'),
  enhancement_level: z.enum(['basic', 'enhanced', 'premium', 'quantum']).default('basic'),
  ai_models_used: z.array(z.string().transform(val => val as AIModelId)),
  context_data: z.object({
    moon_phase: z.string(),
    season: z.string(),
    time_of_day: z.string(),
    user_mood: z.string().optional(),
    intention: z.string().optional(),
    environment: z.string().optional()
  }).optional(),
  follow_up_questions: z.array(z.string()).default([]),
  related_readings: z.array(z.string().transform(val => val as ReadingId)).default([])
})

// User Profile
export const UserProfileSchema = z.object({
  id: z.string().transform(val => val as UserId),
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().optional(),
  spiritual_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert', 'master']).default('beginner'),
  preferred_deck_style: z.enum(['traditional', 'modern', 'artistic', 'minimalist']).default('traditional'),
  language_preference: z.string().min(2).max(5).default('en'),
  timezone: z.string().default('UTC'),
  birth_date: z.string().datetime().optional(),
  astrology_sign: z.string().optional(),
  life_path_number: z.number().int().min(1).max(9).optional(),
  interests: z.array(z.enum([
    'love', 'career', 'spirituality', 'health', 'family', 'money', 
    'travel', 'creativity', 'personal_growth', 'relationships'
  ])).default([]),
  experience_level: z.number().int().min(0).max(100).default(0),
  total_readings: z.number().int().min(0).default(0),
  favorite_cards: z.array(z.string().transform(val => val as CardId)).default([]),
  reading_history: z.array(z.string().transform(val => val as ReadingId)).default([]),
  subscription_tier: z.enum(['free', 'premium', 'unlimited']).default('free'),
  preferences: z.object({
    reading_style: z.enum(['mystical', 'practical', 'psychological', 'spiritual']).default('mystical'),
    card_animation: z.boolean().default(true),
    sound_effects: z.boolean().default(true),
    daily_notifications: z.boolean().default(false),
    email_newsletters: z.boolean().default(false),
    privacy_level: z.enum(['public', 'friends', 'private']).default('private')
  }).default({}),
  achievements: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    unlocked_at: z.number().int().positive(),
    rarity: z.enum(['bronze', 'silver', 'gold', 'platinum', 'diamond'])
  })).default([]),
  stats: z.object({
    readings_this_week: z.number().int().min(0).default(0),
    readings_this_month: z.number().int().min(0).default(0),
    favorite_question_type: z.string().optional(),
    most_drawn_card: z.string().transform(val => val as CardId).optional(),
    accuracy_feedback: z.number().min(0).max(10).optional(),
    spiritual_growth_score: z.number().min(0).max(100).default(0)
  }).default({})
})

// AI Configuration
export const AIModelConfigSchema = z.object({
  id: z.string().transform(val => val as AIModelId),
  name: z.string().min(1),
  provider: z.enum(['openai', 'anthropic', 'google', 'cohere', 'huggingface', 'local']),
  model_version: z.string(),
  capabilities: z.array(z.enum([
    'text_generation', 'conversation', 'analysis', 'creative_writing',
    'reasoning', 'code_generation', 'translation', 'summarization'
  ])),
  max_tokens: z.number().int().positive(),
  temperature: z.number().min(0).max(2).default(0.8),
  top_p: z.number().min(0).max(1).default(0.9),
  frequency_penalty: z.number().min(-2).max(2).default(0),
  presence_penalty: z.number().min(-2).max(2).default(0),
  rate_limits: z.object({
    requests_per_minute: z.number().int().positive(),
    tokens_per_day: z.number().int().positive().optional()
  }),
  cost_per_token: z.number().min(0).optional(),
  quality_score: z.number().min(0).max(10).default(5),
  latency_ms: z.number().int().positive().default(1000),
  reliability_score: z.number().min(0).max(1).default(0.9),
  specializations: z.array(z.enum([
    'tarot', 'astrology', 'numerology', 'spirituality', 'psychology',
    'creative_writing', 'analysis', 'counseling'
  ])).default([]),
  is_available: z.boolean().default(true),
  fallback_models: z.array(z.string().transform(val => val as AIModelId)).default([])
})

// API Response Types
export const APIResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional()
  }).optional(),
  metadata: z.object({
    request_id: z.string(),
    timestamp: z.number().int().positive(),
    processing_time_ms: z.number().int().positive(),
    api_version: z.string(),
    rate_limit_remaining: z.number().int().min(0).optional()
  }).optional()
})

// Enhanced Session Management
export const SessionSchema = z.object({
  id: z.string().transform(val => val as SessionId),
  user_id: z.string().transform(val => val as UserId),
  started_at: z.number().int().positive(),
  last_active: z.number().int().positive(),
  expires_at: z.number().int().positive(),
  ip_address: z.string().ip(),
  user_agent: z.string(),
  device_info: z.object({
    type: z.enum(['mobile', 'tablet', 'desktop']),
    os: z.string(),
    browser: z.string(),
    screen_resolution: z.string().optional()
  }),
  location: z.object({
    country: z.string().optional(),
    city: z.string().optional(),
    timezone: z.string().optional()
  }).optional(),
  security_flags: z.array(z.enum([
    'vpn_detected', 'tor_detected', 'suspicious_activity', 
    'multiple_failed_attempts', 'unusual_location'
  ])).default([]),
  permissions: z.array(z.enum([
    'read_profile', 'write_profile', 'create_readings', 'share_readings',
    'access_premium_features', 'modify_settings'
  ])).default(['read_profile', 'create_readings']),
  activity_log: z.array(z.object({
    action: z.string(),
    timestamp: z.number().int().positive(),
    metadata: z.unknown().optional()
  })).default([])
})

// === TYPE INFERENCE HELPERS ===
export type TarotCard = z.infer<typeof TarotCardSchema>
export type TarotReading = z.infer<typeof TarotReadingSchema>
export type UserProfile = z.infer<typeof UserProfileSchema>
export type AIModelConfig = z.infer<typeof AIModelConfigSchema>
export type APIResponse<T = unknown> = z.infer<typeof APIResponseSchema> & { data?: T }
export type Session = z.infer<typeof SessionSchema>

// === VALIDATION UTILITIES ===
export class TypeValidator {
  static validateTarotCard(data: unknown): TarotCard {
    return TarotCardSchema.parse(data)
  }

  static validateTarotReading(data: unknown): TarotReading {
    return TarotReadingSchema.parse(data)
  }

  static validateUserProfile(data: unknown): UserProfile {
    return UserProfileSchema.parse(data)
  }

  static validateAIModelConfig(data: unknown): AIModelConfig {
    return AIModelConfigSchema.parse(data)
  }

  static validateSession(data: unknown): Session {
    return SessionSchema.parse(data)
  }

  static safeValidate<T>(schema: z.ZodSchema<T>, data: unknown): { 
    success: true; data: T 
  } | { 
    success: false; errors: z.ZodError 
  } {
    const result = schema.safeParse(data)
    return result.success 
      ? { success: true, data: result.data }
      : { success: false, errors: result.error }
  }

  static createTypedResponse<T>(
    data: T, 
    schema: z.ZodSchema<T>,
    metadata?: { request_id: string; processing_time_ms: number }
  ): APIResponse<T> {
    const validatedData = schema.parse(data)
    return {
      success: true,
      data: validatedData,
      metadata: {
        request_id: metadata?.request_id || crypto.randomUUID(),
        timestamp: Date.now(),
        processing_time_ms: metadata?.processing_time_ms || 0,
        api_version: '2.0'
      }
    }
  }

  static createErrorResponse(
    code: string, 
    message: string, 
    details?: unknown
  ): APIResponse {
    return {
      success: false,
      error: { code, message, details },
      metadata: {
        request_id: crypto.randomUUID(),
        timestamp: Date.now(),
        processing_time_ms: 0,
        api_version: '2.0'
      }
    }
  }
}

// === ADVANCED TYPE UTILITIES ===
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type TypeGuard<T> = (value: unknown) => value is T

// === RUNTIME TYPE GUARDS ===
export const isUserId = (value: unknown): value is UserId => 
  typeof value === 'string' && value.length > 0

export const isReadingId = (value: unknown): value is ReadingId => 
  typeof value === 'string' && value.length > 0

export const isValidEmail = (value: unknown): value is string => 
  typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export const isValidUrl = (value: unknown): value is string => 
  typeof value === 'string' && /^https?:\/\/.+/.test(value)

// === BRAND TYPE CONSTRUCTORS ===
export const createUserId = (id: string): UserId => {
  if (!id || typeof id !== 'string') throw new Error('Invalid user ID')
  return id as UserId
}

export const createReadingId = (id: string): ReadingId => {
  if (!id || typeof id !== 'string') throw new Error('Invalid reading ID')
  return id as ReadingId
}

export const createSessionId = (id: string): SessionId => {
  if (!id || typeof id !== 'string') throw new Error('Invalid session ID')
  return id as SessionId
}

export const createCardId = (id: string): CardId => {
  if (!id || typeof id !== 'string') throw new Error('Invalid card ID')
  return id as CardId
}

export const createAIModelId = (id: string): AIModelId => {
  if (!id || typeof id !== 'string') throw new Error('Invalid AI model ID')
  return id as AIModelId
}

// === ERROR TYPES ===
export class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field: string,
    public readonly value: unknown,
    public readonly constraint: string
  ) {
    super(`${field}: ${message}`)
    this.name = 'ValidationError'
  }
}

export class TypeSafetyError extends Error {
  constructor(message: string, public readonly expectedType: string, public readonly actualType: string) {
    super(`Type safety violation: expected ${expectedType}, got ${actualType}. ${message}`)
    this.name = 'TypeSafetyError'
  }
}

// Export enhanced types for backward compatibility
export * from './tarot'