/**
 * Night God Tarot - Professional Tarot Reading Tests
 * Comprehensive testing suite for tarot reading functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { professionalReadingEngine } from '@/services/tarot/professionalReadingEngine';
import type { ReadingSpread, ProfessionalReading } from '@/services/tarot/professionalReadingEngine';

describe('Professional Reading Engine', () => {
  beforeEach(() => {
    // Reset any mocks or state before each test
    vi.clearAllMocks();
  });

  describe('Spread Management', () => {
    it('should return all available spreads', () => {
      const spreads = professionalReadingEngine.getSpreads();
      
      expect(spreads).toBeDefined();
      expect(spreads.length).toBeGreaterThan(0);
      expect(spreads[0]).toHaveProperty('id');
      expect(spreads[0]).toHaveProperty('name');
      expect(spreads[0]).toHaveProperty('positions');
    });

    it('should filter spreads by difficulty', () => {
      const beginnerSpreads = professionalReadingEngine.getSpreads('beginner');
      const advancedSpreads = professionalReadingEngine.getSpreads('advanced');
      
      expect(beginnerSpreads).toBeDefined();
      expect(advancedSpreads).toBeDefined();
      
      beginnerSpreads.forEach(spread => {
        expect(spread.difficulty).toBe('beginner');
      });
      
      advancedSpreads.forEach(spread => {
        expect(spread.difficulty).toBe('advanced');
      });
    });

    it('should filter spreads by category', () => {
      const loveSpreads = professionalReadingEngine.getSpreads(undefined, 'love');
      const careerSpreads = professionalReadingEngine.getSpreads(undefined, 'career');
      
      expect(loveSpreads).toBeDefined();
      expect(careerSpreads).toBeDefined();
      
      loveSpreads.forEach(spread => {
        expect(spread.category).toBe('love');
      });
      
      careerSpreads.forEach(spread => {
        expect(spread.category).toBe('career');
      });
    });

    it('should get specific spread by id', () => {
      const threeCardSpread = professionalReadingEngine.getSpread('three_card');
      const celticCrossSpread = professionalReadingEngine.getSpread('celtic_cross');
      
      expect(threeCardSpread).toBeDefined();
      expect(threeCardSpread?.id).toBe('three_card');
      expect(threeCardSpread?.cardCount).toBe(3);
      
      expect(celticCrossSpread).toBeDefined();
      expect(celticCrossSpread?.id).toBe('celtic_cross');
      expect(celticCrossSpread?.cardCount).toBe(10);
    });

    it('should return null for non-existent spread', () => {
      const nonExistentSpread = professionalReadingEngine.getSpread('non_existent');
      expect(nonExistentSpread).toBeNull();
    });
  });

  describe('Reading Generation', () => {
    it('should perform a basic three-card reading', async () => {
      const reading = await professionalReadingEngine.performReading(
        'three_card',
        'What should I focus on in my career?',
        'en'
      );

      expect(reading).toBeDefined();
      expect(reading.id).toBeDefined();
      expect(reading.spreadId).toBe('three_card');
      expect(reading.question).toBe('What should I focus on in my career?');
      expect(reading.language).toBe('en');
      expect(reading.cards).toHaveLength(3);
      expect(reading.interpretation).toBeDefined();
      expect(reading.insights).toBeDefined();
      expect(reading.metadata).toBeDefined();
      expect(reading.accuracy).toBeDefined();
    });

    it('should perform a Celtic Cross reading', async () => {
      const reading = await professionalReadingEngine.performReading(
        'celtic_cross',
        'What is the overall energy around my life situation?',
        'en'
      );

      expect(reading).toBeDefined();
      expect(reading.cards).toHaveLength(10);
      expect(reading.interpretation.sections).toHaveLength(10);
    });

    it('should handle different languages', async () => {
      const englishReading = await professionalReadingEngine.performReading(
        'single_card',
        'What do I need to know today?',
        'en'
      );

      const chineseReading = await professionalReadingEngine.performReading(
        'single_card',
        '今天我需要知道什么？',
        'zh'
      );

      expect(englishReading.language).toBe('en');
      expect(chineseReading.language).toBe('zh');
    });

    it('should throw error for invalid spread', async () => {
      await expect(
        professionalReadingEngine.performReading(
          'invalid_spread',
          'Test question',
          'en'
        )
      ).rejects.toThrow('Spread invalid_spread not found');
    });

    it('should generate comprehensive interpretation', async () => {
      const reading = await professionalReadingEngine.performReading(
        'three_card',
        'How can I improve my relationships?',
        'en'
      );

      const interpretation = reading.interpretation;

      expect(interpretation.overview).toBeDefined();
      expect(interpretation.overview).toContain('reading reveals');
      expect(interpretation.sections).toHaveLength(3);
      expect(interpretation.synthesis).toBeDefined();
      expect(interpretation.guidance).toBeDefined();

      interpretation.sections.forEach(section => {
        expect(section.title).toBeDefined();
        expect(section.content).toBeDefined();
        expect(section.confidence).toBeGreaterThan(0);
        expect(section.confidence).toBeLessThanOrEqual(1);
        expect(section.cardReferences).toBeDefined();
        expect(section.symbolism).toBeDefined();
      });
    });

    it('should calculate insights correctly', async () => {
      const reading = await professionalReadingEngine.performReading(
        'love_cross',
        'What is the future of my romantic relationship?',
        'en'
      );

      const insights = reading.insights;

      expect(insights.dominantElement).toMatch(/^(fire|water|air|earth)$/);
      expect(insights.dominantSuit).toMatch(/^(wands|cups|swords|pentacles|major)$/);
      expect(insights.numerology).toBeDefined();
      expect(insights.numerology.pathNumber).toBeGreaterThan(0);
      expect(insights.astrology).toBeDefined();
      expect(insights.psychology).toBeDefined();
      expect(insights.spirituality).toBeDefined();
    });

    it('should generate accurate metadata', async () => {
      const startTime = Date.now();
      const reading = await professionalReadingEngine.performReading(
        'single_card',
        'Test question',
        'en'
      );
      const endTime = Date.now();

      const metadata = reading.metadata;

      expect(metadata.timestamp).toBeInstanceOf(Date);
      expect(metadata.duration).toBeGreaterThan(0);
      expect(metadata.aiModelsUsed).toBeDefined();
      expect(metadata.aiModelsUsed.length).toBeGreaterThan(0);
      expect(metadata.confidence).toBeGreaterThan(0);
      expect(metadata.confidence).toBeLessThanOrEqual(1);
      expect(metadata.version).toBeDefined();
    });

    it('should provide accuracy metrics', async () => {
      const reading = await professionalReadingEngine.performReading(
        'career_path',
        'What career path should I pursue?',
        'en'
      );

      const accuracy = reading.accuracy;

      expect(accuracy.overall).toBeGreaterThan(0);
      expect(accuracy.overall).toBeLessThanOrEqual(1);
      expect(accuracy.cardAccuracy).toBeGreaterThan(0);
      expect(accuracy.interpretationDepth).toBeGreaterThan(0);
      expect(accuracy.symbolicRelevance).toBeGreaterThan(0);
      expect(accuracy.linguisticQuality).toBeGreaterThan(0);
      expect(accuracy.culturalSensitivity).toBeGreaterThan(0);
    });
  });

  describe('Card Analysis', () => {
    it('should analyze card energy correctly', async () => {
      const reading = await professionalReadingEngine.performReading(
        'three_card',
        'Test question for energy analysis',
        'en'
      );

      reading.cards.forEach(cardInPosition => {
        expect(cardInPosition.energy).toMatch(/^(strong|moderate|weak)$/);
        expect(cardInPosition.aspects).toBeDefined();
        expect(cardInPosition.aspects.length).toBeGreaterThan(0);
        
        cardInPosition.aspects.forEach(aspect => {
          expect(aspect.type).toMatch(/^(elemental|numerical|archetypal|astrological|kabbalistic)$/);
          expect(aspect.value).toBeDefined();
          expect(aspect.significance).toBeDefined();
          expect(aspect.influence).toBeGreaterThan(0);
          expect(aspect.influence).toBeLessThanOrEqual(1);
        });
      });
    });

    it('should handle reversed cards', async () => {
      // Mock card selection to ensure some reversed cards
      const reading = await professionalReadingEngine.performReading(
        'three_card',
        'Test reversed cards',
        'en'
      );

      // Check that reversed property is properly set
      reading.cards.forEach(cardInPosition => {
        expect(typeof cardInPosition.reversed).toBe('boolean');
      });
    });
  });

  describe('Timeline Generation', () => {
    it('should generate timeline events for temporal spreads', async () => {
      const reading = await professionalReadingEngine.performReading(
        'three_card', // Past, Present, Future
        'What is my timeline for career growth?',
        'en'
      );

      if (reading.interpretation.timeline) {
        expect(reading.interpretation.timeline.length).toBeGreaterThan(0);
        
        reading.interpretation.timeline.forEach(event => {
          expect(event.period).toMatch(/^(past|present|near_future|future)$/);
          expect(event.timeframe).toBeDefined();
          expect(event.event).toBeDefined();
          expect(event.probability).toBeGreaterThan(0);
          expect(event.probability).toBeLessThanOrEqual(1);
        });
      }
    });
  });

  describe('Reading History', () => {
    it('should store reading in history', async () => {
      const initialHistoryLength = professionalReadingEngine.getReadingHistory().length;
      
      await professionalReadingEngine.performReading(
        'single_card',
        'Test history storage',
        'en'
      );

      const newHistoryLength = professionalReadingEngine.getReadingHistory().length;
      expect(newHistoryLength).toBe(initialHistoryLength + 1);
    });

    it('should set current reading', async () => {
      const reading = await professionalReadingEngine.performReading(
        'single_card',
        'Test current reading',
        'en'
      );

      const currentReading = professionalReadingEngine.getCurrentReading();
      expect(currentReading).toBeDefined();
      expect(currentReading?.id).toBe(reading.id);
    });
  });

  describe('Spread Categories', () => {
    it('should return all available categories', () => {
      const categories = professionalReadingEngine.getSpreadCategories();
      
      expect(categories).toBeDefined();
      expect(categories.length).toBeGreaterThan(0);
      expect(categories).toContain('general');
      expect(categories).toContain('love');
      expect(categories).toContain('career');
    });

    it('should filter spreads by difficulty level', () => {
      const beginnerSpreads = professionalReadingEngine.getSpreadsByDifficulty('beginner');
      const masterSpreads = professionalReadingEngine.getSpreadsByDifficulty('master');
      
      expect(beginnerSpreads.length).toBeGreaterThan(0);
      expect(masterSpreads.length).toBeGreaterThan(0);
      
      beginnerSpreads.forEach(spread => {
        expect(spread.difficulty).toBe('beginner');
      });
      
      masterSpreads.forEach(spread => {
        expect(spread.difficulty).toBe('master');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle empty questions gracefully', async () => {
      const reading = await professionalReadingEngine.performReading(
        'single_card',
        '',
        'en'
      );

      expect(reading).toBeDefined();
      expect(reading.question).toBe('');
    });

    it('should handle invalid language codes', async () => {
      const reading = await professionalReadingEngine.performReading(
        'single_card',
        'Test question',
        'invalid_lang'
      );

      expect(reading).toBeDefined();
      expect(reading.language).toBe('invalid_lang');
    });
  });

  describe('Performance', () => {
    it('should complete readings within reasonable time', async () => {
      const startTime = Date.now();
      
      await professionalReadingEngine.performReading(
        'celtic_cross',
        'Performance test question',
        'en'
      );

      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete within 5 seconds (generous for testing)
      expect(duration).toBeLessThan(5000);
    });

    it('should handle multiple concurrent readings', async () => {
      const promises = Array(5).fill(null).map((_, index) =>
        professionalReadingEngine.performReading(
          'single_card',
          `Concurrent test question ${index}`,
          'en'
        )
      );

      const readings = await Promise.all(promises);
      
      expect(readings.length).toBe(5);
      readings.forEach(reading => {
        expect(reading).toBeDefined();
        expect(reading.id).toBeDefined();
      });

      // All readings should have unique IDs
      const ids = readings.map(r => r.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('Data Validation', () => {
    it('should validate spread position data', () => {
      const spreads = professionalReadingEngine.getSpreads();
      
      spreads.forEach(spread => {
        expect(spread.positions.length).toBe(spread.cardCount);
        
        spread.positions.forEach(position => {
          expect(position.id).toBeDefined();
          expect(position.name).toBeDefined();
          expect(position.description).toBeDefined();
          expect(position.significance).toBeDefined();
          expect(position.position.x).toBeDefined();
          expect(position.position.y).toBeDefined();
          expect(position.interpretationWeight).toBeGreaterThan(0);
          expect(position.interpretationWeight).toBeLessThanOrEqual(1);
        });
      });
    });

    it('should validate reading data structure', async () => {
      const reading = await professionalReadingEngine.performReading(
        'three_card',
        'Validation test question',
        'en'
      );

      // Validate top-level structure
      expect(reading.id).toMatch(/^reading_/);
      expect(reading.spreadId).toBeDefined();
      expect(reading.question).toBeDefined();
      expect(reading.language).toBeDefined();
      expect(Array.isArray(reading.cards)).toBe(true);
      expect(reading.interpretation).toBeDefined();
      expect(reading.insights).toBeDefined();
      expect(reading.metadata).toBeDefined();
      expect(reading.accuracy).toBeDefined();

      // Validate cards structure
      reading.cards.forEach(cardInPosition => {
        expect(cardInPosition.card).toBeDefined();
        expect(cardInPosition.position).toBeDefined();
        expect(typeof cardInPosition.reversed).toBe('boolean');
        expect(cardInPosition.energy).toMatch(/^(strong|moderate|weak)$/);
        expect(Array.isArray(cardInPosition.aspects)).toBe(true);
      });
    });
  });
});