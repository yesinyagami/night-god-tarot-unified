/**
 * Night God Tarot - Advanced Gamification & Achievement System
 * Engagement-driven features for user retention and enjoyment
 */

import { ref, computed } from 'vue';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'exploration' | 'mastery' | 'social' | 'collection' | 'special';
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  progress?: number;
  maxProgress?: number;
  unlocked: boolean;
  unlockedAt?: Date;
  rewards?: Reward[];
}

export interface Reward {
  type: 'badge' | 'title' | 'card-skin' | 'effect' | 'voice' | 'theme';
  id: string;
  name: string;
  description: string;
}

export interface UserLevel {
  current: number;
  experience: number;
  nextLevelExp: number;
  title: string;
  perks: string[];
}

export interface DailyChallenge {
  id: string;
  name: string;
  description: string;
  objective: string;
  progress: number;
  target: number;
  reward: Reward;
  expiresAt: Date;
}

export interface Leaderboard {
  period: 'daily' | 'weekly' | 'monthly' | 'allTime';
  entries: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  score: number;
  level: number;
  achievementCount: number;
  avatar?: string;
}

export class GamificationSystem {
  private static instance: GamificationSystem;
  
  private achievements = ref<Achievement[]>([]);
  private userLevel = ref<UserLevel>({
    current: 1,
    experience: 0,
    nextLevelExp: 100,
    title: 'Novice Seeker',
    perks: []
  });
  private dailyChallenges = ref<DailyChallenge[]>([]);
  private streakCount = ref(0);
  private totalReadings = ref(0);
  private collectedCards = ref<Set<string>>(new Set());
  private unlockedThemes = ref<Set<string>>(new Set(['default']));
  private specialEvents = ref<any[]>([]);

  private constructor() {
    this.initializeAchievements();
    this.loadUserProgress();
    this.generateDailyChallenges();
    this.startEventSystem();
  }

  static getInstance(): GamificationSystem {
    if (!GamificationSystem.instance) {
      GamificationSystem.instance = new GamificationSystem();
    }
    return GamificationSystem.instance;
  }

  private initializeAchievements() {
    this.achievements.value = [
      // Exploration Achievements
      {
        id: 'first_reading',
        name: 'First Steps',
        description: 'Complete your first tarot reading',
        icon: '🌟',
        category: 'exploration',
        points: 10,
        rarity: 'common',
        unlocked: false
      },
      {
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Perform a reading between midnight and 3 AM',
        icon: '🦉',
        category: 'exploration',
        points: 25,
        rarity: 'rare',
        unlocked: false
      },
      {
        id: 'multi_language',
        name: 'Polyglot Mystic',
        description: 'Complete readings in all 3 languages',
        icon: '🌍',
        category: 'exploration',
        points: 50,
        rarity: 'epic',
        progress: 0,
        maxProgress: 3,
        unlocked: false
      },
      
      // Mastery Achievements
      {
        id: 'reading_master',
        name: 'Master of Divination',
        description: 'Complete 100 tarot readings',
        icon: '🔮',
        category: 'mastery',
        points: 100,
        rarity: 'legendary',
        progress: 0,
        maxProgress: 100,
        unlocked: false
      },
      {
        id: 'perfect_week',
        name: 'Devoted Seeker',
        description: 'Perform readings 7 days in a row',
        icon: '📿',
        category: 'mastery',
        points: 75,
        rarity: 'epic',
        progress: 0,
        maxProgress: 7,
        unlocked: false
      },
      {
        id: 'speed_reader',
        name: 'Lightning Diviner',
        description: 'Complete 5 readings in one hour',
        icon: '⚡',
        category: 'mastery',
        points: 60,
        rarity: 'epic',
        unlocked: false
      },
      
      // Collection Achievements
      {
        id: 'card_collector',
        name: 'Card Collector',
        description: 'Unlock all 94 tarot cards in readings',
        icon: '🎴',
        category: 'collection',
        points: 200,
        rarity: 'mythic',
        progress: 0,
        maxProgress: 94,
        unlocked: false
      },
      {
        id: 'theme_master',
        name: 'Style Maven',
        description: 'Unlock 5 different visual themes',
        icon: '🎨',
        category: 'collection',
        points: 80,
        rarity: 'epic',
        progress: 1,
        maxProgress: 5,
        unlocked: false
      },
      
      // Social Achievements
      {
        id: 'sharing_spirit',
        name: 'Sharing Spirit',
        description: 'Share 10 readings with friends',
        icon: '💫',
        category: 'social',
        points: 40,
        rarity: 'rare',
        progress: 0,
        maxProgress: 10,
        unlocked: false
      },
      {
        id: 'helpful_guide',
        name: 'Helpful Guide',
        description: 'Help 5 friends with their first reading',
        icon: '🤝',
        category: 'social',
        points: 50,
        rarity: 'epic',
        progress: 0,
        maxProgress: 5,
        unlocked: false
      },
      
      // Special Achievements
      {
        id: 'full_moon',
        name: 'Lunar Connection',
        description: 'Perform a reading during a full moon',
        icon: '🌕',
        category: 'special',
        points: 100,
        rarity: 'legendary',
        unlocked: false
      },
      {
        id: 'eclipse_reading',
        name: 'Eclipse Oracle',
        description: 'Complete a reading during a solar or lunar eclipse',
        icon: '🌑',
        category: 'special',
        points: 500,
        rarity: 'mythic',
        unlocked: false
      },
      {
        id: 'anniversary',
        name: 'Anniversary Mystic',
        description: 'Use Night God Tarot for one full year',
        icon: '🎂',
        category: 'special',
        points: 300,
        rarity: 'mythic',
        unlocked: false
      }
    ];
  }

  private loadUserProgress() {
    const saved = localStorage.getItem('nightgod_gamification');
    if (saved) {
      const data = JSON.parse(saved);
      this.userLevel.value = data.level || this.userLevel.value;
      this.streakCount.value = data.streak || 0;
      this.totalReadings.value = data.totalReadings || 0;
      this.collectedCards.value = new Set(data.collectedCards || []);
      this.unlockedThemes.value = new Set(data.unlockedThemes || ['default']);
      
      // Restore achievement progress
      if (data.achievements) {
        this.achievements.value.forEach(achievement => {
          const saved = data.achievements[achievement.id];
          if (saved) {
            Object.assign(achievement, saved);
          }
        });
      }
    }
  }

  private saveProgress() {
    const data = {
      level: this.userLevel.value,
      streak: this.streakCount.value,
      totalReadings: this.totalReadings.value,
      collectedCards: Array.from(this.collectedCards.value),
      unlockedThemes: Array.from(this.unlockedThemes.value),
      achievements: this.achievements.value.reduce((acc, achievement) => {
        acc[achievement.id] = {
          unlocked: achievement.unlocked,
          progress: achievement.progress,
          unlockedAt: achievement.unlockedAt
        };
        return acc;
      }, {} as any)
    };
    
    localStorage.setItem('nightgod_gamification', JSON.stringify(data));
  }

  private generateDailyChallenges() {
    const challenges: DailyChallenge[] = [
      {
        id: 'daily_three',
        name: 'Triple Insight',
        description: 'Complete 3 readings today',
        objective: 'Perform 3 tarot readings',
        progress: 0,
        target: 3,
        reward: { type: 'badge', id: 'daily_badge', name: 'Daily Devotee', description: 'Completed daily challenge' },
        expiresAt: this.getEndOfDay()
      },
      {
        id: 'major_arcana',
        name: 'Major Discovery',
        description: 'Draw a Major Arcana card in your reading',
        objective: 'Get a Major Arcana card',
        progress: 0,
        target: 1,
        reward: { type: 'effect', id: 'golden_aura', name: 'Golden Aura', description: 'Special card glow effect' },
        expiresAt: this.getEndOfDay()
      },
      {
        id: 'share_wisdom',
        name: 'Spread the Light',
        description: 'Share a reading with a friend',
        objective: 'Use the share feature',
        progress: 0,
        target: 1,
        reward: { type: 'title', id: 'light_bearer', name: 'Light Bearer', description: 'Title for sharing wisdom' },
        expiresAt: this.getEndOfDay()
      }
    ];
    
    // Randomly select 3 challenges for the day
    this.dailyChallenges.value = this.shuffleArray(challenges).slice(0, 3);
  }

  private getEndOfDay(): Date {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return end;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private startEventSystem() {
    // Check for special celestial events
    this.checkCelestialEvents();
    
    // Weekly special events
    this.scheduleWeeklyEvents();
    
    // Seasonal events
    this.checkSeasonalEvents();
  }

  private checkCelestialEvents() {
    // Check moon phases
    const moonPhase = this.getMoonPhase(new Date());
    if (moonPhase === 'full') {
      this.specialEvents.value.push({
        id: 'full_moon_bonus',
        name: 'Full Moon Power',
        description: 'Double XP for all readings tonight',
        multiplier: 2,
        active: true
      });
    }
  }

  private getMoonPhase(date: Date): string {
    // Simplified moon phase calculation
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const c = Math.floor(365.25 * year);
    const e = Math.floor(30.6 * month);
    const jd = c + e + day - 694039.09;
    const phase = jd / 29.53059;
    const phaseValue = phase - Math.floor(phase);
    
    if (phaseValue < 0.03 || phaseValue > 0.97) return 'new';
    if (phaseValue < 0.22) return 'waxing_crescent';
    if (phaseValue < 0.28) return 'first_quarter';
    if (phaseValue < 0.47) return 'waxing_gibbous';
    if (phaseValue < 0.53) return 'full';
    if (phaseValue < 0.72) return 'waning_gibbous';
    if (phaseValue < 0.78) return 'last_quarter';
    return 'waning_crescent';
  }

  private scheduleWeeklyEvents() {
    const day = new Date().getDay();
    
    // Mystical Monday - Bonus for first reading
    if (day === 1) {
      this.specialEvents.value.push({
        id: 'mystical_monday',
        name: 'Mystical Monday',
        description: 'First reading gives 50% more XP',
        active: true
      });
    }
    
    // Fortune Friday - Lucky card draws
    if (day === 5) {
      this.specialEvents.value.push({
        id: 'fortune_friday',
        name: 'Fortune Friday',
        description: 'Higher chance of rare cards',
        active: true
      });
    }
    
    // Sacred Sunday - Meditation bonus
    if (day === 0) {
      this.specialEvents.value.push({
        id: 'sacred_sunday',
        name: 'Sacred Sunday',
        description: 'Unlock special meditation features',
        active: true
      });
    }
  }

  private checkSeasonalEvents() {
    const month = new Date().getMonth();
    
    // Spring Equinox (March)
    if (month === 2) {
      this.specialEvents.value.push({
        id: 'spring_renewal',
        name: 'Spring Renewal',
        description: 'Growth-themed readings have special insights',
        active: true
      });
    }
    
    // Summer Solstice (June)
    if (month === 5) {
      this.specialEvents.value.push({
        id: 'summer_solstice',
        name: 'Summer Solstice',
        description: 'Longest day brings extended reading powers',
        active: true
      });
    }
    
    // Halloween (October)
    if (month === 9) {
      this.specialEvents.value.push({
        id: 'halloween_spirits',
        name: 'Halloween Spirits',
        description: 'Veil is thin - mystical accuracy increased',
        active: true
      });
    }
    
    // Winter Solstice (December)
    if (month === 11) {
      this.specialEvents.value.push({
        id: 'winter_wisdom',
        name: 'Winter Wisdom',
        description: 'Deep introspection readings unlocked',
        active: true
      });
    }
  }

  // Public API
  public completeReading(cards: string[], language: string) {
    this.totalReadings.value++;
    
    // Track cards
    cards.forEach(card => this.collectedCards.value.add(card));
    
    // Update achievements
    this.checkAchievement('first_reading');
    this.updateProgress('reading_master', 1);
    this.updateProgress('card_collector', cards.length);
    
    // Check time-based achievements
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 3) {
      this.checkAchievement('night_owl');
    }
    
    // Update daily challenges
    this.updateDailyChallenge('daily_three', 1);
    
    // Add experience
    this.addExperience(25);
    
    // Update streak
    this.updateStreak();
    
    // Save progress
    this.saveProgress();
  }

  private checkAchievement(id: string) {
    const achievement = this.achievements.value.find(a => a.id === id);
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true;
      achievement.unlockedAt = new Date();
      this.showAchievementNotification(achievement);
      this.addExperience(achievement.points);
    }
  }

  private updateProgress(id: string, amount: number) {
    const achievement = this.achievements.value.find(a => a.id === id);
    if (achievement && !achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress) {
      achievement.progress = Math.min(achievement.progress + amount, achievement.maxProgress);
      
      if (achievement.progress >= achievement.maxProgress) {
        this.checkAchievement(id);
      }
    }
  }

  private updateDailyChallenge(id: string, amount: number) {
    const challenge = this.dailyChallenges.value.find(c => c.id === id);
    if (challenge) {
      challenge.progress = Math.min(challenge.progress + amount, challenge.target);
      
      if (challenge.progress >= challenge.target) {
        this.completeDailyChallenge(challenge);
      }
    }
  }

  private completeDailyChallenge(challenge: DailyChallenge) {
    // Award reward
    this.awardReward(challenge.reward);
    
    // Show notification
    this.showChallengeNotification(challenge);
    
    // Add bonus XP
    this.addExperience(50);
  }

  private awardReward(reward: Reward) {
    // Implementation depends on reward type
    console.log('Reward awarded:', reward);
    
    // Store reward in user profile
    const rewards = JSON.parse(localStorage.getItem('nightgod_rewards') || '[]');
    rewards.push(reward);
    localStorage.setItem('nightgod_rewards', JSON.stringify(rewards));
  }

  private addExperience(amount: number) {
    // Apply event multipliers
    const multiplier = this.getActiveMultiplier();
    const finalAmount = Math.floor(amount * multiplier);
    
    this.userLevel.value.experience += finalAmount;
    
    // Check for level up
    while (this.userLevel.value.experience >= this.userLevel.value.nextLevelExp) {
      this.levelUp();
    }
  }

  private getActiveMultiplier(): number {
    return this.specialEvents.value
      .filter(e => e.active && e.multiplier)
      .reduce((total, event) => total * (event.multiplier || 1), 1);
  }

  private levelUp() {
    this.userLevel.value.experience -= this.userLevel.value.nextLevelExp;
    this.userLevel.value.current++;
    this.userLevel.value.nextLevelExp = this.calculateNextLevelExp(this.userLevel.value.current);
    this.userLevel.value.title = this.getLevelTitle(this.userLevel.value.current);
    this.userLevel.value.perks = this.getLevelPerks(this.userLevel.value.current);
    
    this.showLevelUpNotification();
  }

  private calculateNextLevelExp(level: number): number {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  }

  private getLevelTitle(level: number): string {
    const titles = [
      'Novice Seeker', 'Apprentice Reader', 'Adept Diviner', 'Expert Oracle',
      'Master Mystic', 'Grand Sage', 'Arcane Scholar', 'Celestial Guide',
      'Cosmic Seer', 'Divine Prophet', 'Eternal Wisdom Keeper'
    ];
    return titles[Math.min(level - 1, titles.length - 1)];
  }

  private getLevelPerks(level: number): string[] {
    const perks = [];
    
    if (level >= 5) perks.push('Access to rare card interpretations');
    if (level >= 10) perks.push('Custom card backs');
    if (level >= 15) perks.push('Priority AI processing');
    if (level >= 20) perks.push('Exclusive celestial themes');
    if (level >= 25) perks.push('Master reader badge');
    if (level >= 30) perks.push('Legendary status');
    
    return perks;
  }

  private updateStreak() {
    const lastReading = localStorage.getItem('nightgod_last_reading');
    const today = new Date().toDateString();
    
    if (lastReading !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastReading === yesterday.toDateString()) {
        this.streakCount.value++;
      } else {
        this.streakCount.value = 1;
      }
      
      localStorage.setItem('nightgod_last_reading', today);
      
      // Check streak achievements
      if (this.streakCount.value >= 7) {
        this.checkAchievement('perfect_week');
      }
    }
  }

  private showAchievementNotification(achievement: Achievement) {
    // Dispatch custom event for UI to handle
    window.dispatchEvent(new CustomEvent('achievement-unlocked', {
      detail: achievement
    }));
  }

  private showChallengeNotification(challenge: DailyChallenge) {
    window.dispatchEvent(new CustomEvent('challenge-completed', {
      detail: challenge
    }));
  }

  private showLevelUpNotification() {
    window.dispatchEvent(new CustomEvent('level-up', {
      detail: this.userLevel.value
    }));
  }

  // Public getters
  public getAchievements() {
    return this.achievements.value;
  }

  public getUserLevel() {
    return this.userLevel.value;
  }

  public getDailyChallenges() {
    return this.dailyChallenges.value;
  }

  public getStreakCount() {
    return this.streakCount.value;
  }

  public getCollectedCards() {
    return Array.from(this.collectedCards.value);
  }

  public getSpecialEvents() {
    return this.specialEvents.value;
  }

  public async getLeaderboard(period: 'daily' | 'weekly' | 'monthly' | 'allTime'): Promise<Leaderboard> {
    // In production, this would fetch from backend
    // For now, return mock data
    return {
      period,
      entries: [
        {
          rank: 1,
          userId: 'user123',
          username: 'MysticMaster',
          score: 9500,
          level: 28,
          achievementCount: 45
        },
        {
          rank: 2,
          userId: 'user456',
          username: 'TarotSage',
          score: 8200,
          level: 25,
          achievementCount: 38
        }
      ]
    };
  }
}

export const gamificationSystem = GamificationSystem.getInstance();