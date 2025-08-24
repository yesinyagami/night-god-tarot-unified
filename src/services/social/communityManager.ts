/**
 * Night God Tarot - Advanced Community & Social Features
 * Building a thriving tarot community with social engagement
 */

import { ref, computed } from 'vue';

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  level: number;
  experience: number;
  title: string;
  badge?: string;
  joinedDate: Date;
  lastActive: Date;
  stats: UserStats;
  preferences: UserPreferences;
  reputation: number;
  following: string[];
  followers: string[];
  blocked: string[];
}

export interface UserStats {
  totalReadings: number;
  readingsShared: number;
  commentsGiven: number;
  helpfulVotes: number;
  achievementsUnlocked: number;
  favoriteSpread: string;
  accuracyRating: number;
  streakDays: number;
}

export interface UserPreferences {
  visibility: 'public' | 'friends' | 'private';
  shareReadings: boolean;
  allowComments: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  language: string;
  timezone: string;
}

export interface SharedReading {
  id: string;
  userId: string;
  user: User;
  title: string;
  description: string;
  spreadName: string;
  cards: string[];
  interpretation: string;
  tags: string[];
  timestamp: Date;
  visibility: 'public' | 'friends' | 'community';
  likes: number;
  comments: Comment[];
  shares: number;
  helpfulVotes: number;
  reported: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  content: string;
  timestamp: Date;
  likes: number;
  replies: Comment[];
  reported: boolean;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  category: 'general' | 'beginner' | 'advanced' | 'love' | 'career' | 'spiritual';
  memberCount: number;
  moderators: string[];
  rules: string[];
  posts: CommunityPost[];
  featured: boolean;
  private: boolean;
  joinRequests?: string[];
}

export interface CommunityPost {
  id: string;
  communityId: string;
  userId: string;
  user: User;
  type: 'discussion' | 'question' | 'reading' | 'guide' | 'poll';
  title: string;
  content: string;
  attachments?: Attachment[];
  timestamp: Date;
  pinned: boolean;
  locked: boolean;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  tags: string[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'audio' | 'document';
  url: string;
  filename: string;
  size: number;
}

export interface TarotCircle {
  id: string;
  name: string;
  description: string;
  type: 'study' | 'practice' | 'mentorship' | 'challenge';
  members: string[];
  maxMembers: number;
  schedule: CircleSchedule;
  currentActivity?: CircleActivity;
  achievements: string[];
  private: boolean;
}

export interface CircleSchedule {
  frequency: 'daily' | 'weekly' | 'monthly';
  dayOfWeek?: number;
  timeOfDay?: string;
  timezone: string;
}

export interface CircleActivity {
  id: string;
  type: 'group_reading' | 'study_session' | 'challenge' | 'meditation';
  title: string;
  description: string;
  startTime: Date;
  duration: number; // minutes
  participants: string[];
  maxParticipants: number;
  status: 'upcoming' | 'active' | 'completed';
}

export interface Mentor {
  id: string;
  user: User;
  specialties: string[];
  experience: number; // years
  rating: number;
  totalMentees: number;
  activeMentees: string[];
  availability: MentorAvailability;
  pricing: MentorPricing;
  verified: boolean;
}

export interface MentorAvailability {
  timezone: string;
  schedule: { [key: string]: { start: string; end: string }[] };
  booked: BookedSession[];
}

export interface BookedSession {
  id: string;
  menteeId: string;
  date: Date;
  duration: number;
  topic: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface MentorPricing {
  currency: string;
  sessionRate: number; // per hour
  packageRates: { sessions: number; price: number }[];
  freeConsultation: boolean;
}

export class CommunityManager {
  private static instance: CommunityManager;
  
  private currentUser = ref<User | null>(null);
  private communities = ref<Community[]>([]);
  private tarotCircles = ref<TarotCircle[]>([]);
  private mentors = ref<Mentor[]>([]);
  private feedPosts = ref<SharedReading[]>([]);
  private notifications = ref<any[]>([]);
  private activeUsers = ref<User[]>([]);

  private constructor() {
    this.initializeUser();
    this.initializeCommunities();
    this.initializeTarotCircles();
    this.initializeMentors();
    this.loadFeedPosts();
    this.startRealTimeUpdates();
  }

  static getInstance(): CommunityManager {
    if (!CommunityManager.instance) {
      CommunityManager.instance = new CommunityManager();
    }
    return CommunityManager.instance;
  }

  private initializeUser() {
    // Initialize or load user profile
    const savedUser = localStorage.getItem('nightgod_user_profile');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      this.currentUser.value = {
        ...userData,
        joinedDate: new Date(userData.joinedDate),
        lastActive: new Date(userData.lastActive)
      };
    } else {
      // Create new user profile
      this.currentUser.value = {
        id: `user_${Date.now()}`,
        username: `seeker_${Math.random().toString(36).substr(2, 6)}`,
        displayName: 'New Seeker',
        level: 1,
        experience: 0,
        title: 'Novice Seeker',
        joinedDate: new Date(),
        lastActive: new Date(),
        reputation: 0,
        following: [],
        followers: [],
        blocked: [],
        stats: {
          totalReadings: 0,
          readingsShared: 0,
          commentsGiven: 0,
          helpfulVotes: 0,
          achievementsUnlocked: 0,
          favoriteSpread: 'three_card',
          accuracyRating: 0,
          streakDays: 0
        },
        preferences: {
          visibility: 'public',
          shareReadings: true,
          allowComments: true,
          emailNotifications: true,
          pushNotifications: false,
          language: 'en',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };
      this.saveUserProfile();
    }
  }

  private initializeCommunities() {
    this.communities.value = [
      {
        id: 'general',
        name: 'General Discussion',
        description: 'Open discussions about tarot, spirituality, and life',
        category: 'general',
        memberCount: 15420,
        moderators: ['mod1', 'mod2'],
        rules: [
          'Be respectful to all members',
          'No spam or self-promotion without permission',
          'Share knowledge and learn from others',
          'Keep discussions on-topic'
        ],
        posts: [],
        featured: true,
        private: false
      },
      {
        id: 'beginners',
        name: 'Beginner\'s Circle',
        description: 'Safe space for new tarot readers to learn and ask questions',
        category: 'beginner',
        memberCount: 8934,
        moderators: ['mentor1', 'mentor2'],
        rules: [
          'No question is too basic',
          'Experienced readers, please be patient',
          'Share your learning journey',
          'Support fellow beginners'
        ],
        posts: [],
        featured: true,
        private: false
      },
      {
        id: 'love-relationships',
        name: 'Love & Relationships',
        description: 'Explore matters of the heart through tarot wisdom',
        category: 'love',
        memberCount: 12567,
        moderators: ['love_expert1'],
        rules: [
          'Respect privacy and confidentiality',
          'No judgment of relationship choices',
          'Focus on growth and understanding',
          'Avoid giving direct advice about major decisions'
        ],
        posts: [],
        featured: false,
        private: false
      },
      {
        id: 'career-money',
        name: 'Career & Prosperity',
        description: 'Professional and financial guidance through tarot',
        category: 'career',
        memberCount: 9876,
        moderators: ['career_guide1'],
        rules: [
          'Share experiences and insights',
          'No direct financial advice',
          'Focus on personal empowerment',
          'Respect different career paths'
        ],
        posts: [],
        featured: false,
        private: false
      },
      {
        id: 'advanced-study',
        name: 'Advanced Tarot Study',
        description: 'Deep dive into symbolism, history, and advanced techniques',
        category: 'advanced',
        memberCount: 3421,
        moderators: ['scholar1', 'scholar2'],
        rules: [
          'Share scholarly resources',
          'Cite sources when possible',
          'Encourage academic discussion',
          'Welcome different tarot traditions'
        ],
        posts: [],
        featured: false,
        private: false
      },
      {
        id: 'spiritual-growth',
        name: 'Spiritual Growth & Meditation',
        description: 'Integrating tarot with spiritual practices',
        category: 'spiritual',
        memberCount: 6789,
        moderators: ['spiritual_guide1'],
        rules: [
          'Respect all spiritual paths',
          'Share meditation and ritual practices',
          'Focus on personal growth',
          'No religious debates'
        ],
        posts: [],
        featured: false,
        private: false
      }
    ];
  }

  private initializeTarotCircles() {
    this.tarotCircles.value = [
      {
        id: 'daily_draw',
        name: 'Daily Card Draw Circle',
        description: 'Share and discuss daily card draws with fellow seekers',
        type: 'practice',
        members: ['user1', 'user2', 'user3'],
        maxMembers: 20,
        schedule: {
          frequency: 'daily',
          timeOfDay: '09:00',
          timezone: 'UTC'
        },
        achievements: ['Consistent Drawer', 'Insightful Interpreter'],
        private: false
      },
      {
        id: 'weekend_study',
        name: 'Weekend Study Group',
        description: 'Deep study sessions on tarot theory and practice',
        type: 'study',
        members: ['student1', 'student2'],
        maxMembers: 12,
        schedule: {
          frequency: 'weekly',
          dayOfWeek: 6, // Saturday
          timeOfDay: '14:00',
          timezone: 'UTC'
        },
        achievements: ['Dedicated Student', 'Knowledge Sharer'],
        private: false
      },
      {
        id: 'mentor_circle',
        name: 'Mentorship Circle',
        description: 'Experienced readers guide newcomers',
        type: 'mentorship',
        members: ['mentor1', 'mentee1', 'mentee2'],
        maxMembers: 15,
        schedule: {
          frequency: 'weekly',
          dayOfWeek: 7, // Sunday
          timeOfDay: '19:00',
          timezone: 'UTC'
        },
        achievements: ['Wise Mentor', 'Eager Student'],
        private: false
      },
      {
        id: 'full_moon',
        name: 'Full Moon Reading Circle',
        description: 'Special readings during full moon phases',
        type: 'practice',
        members: ['lunar1', 'lunar2'],
        maxMembers: 30,
        schedule: {
          frequency: 'monthly',
          timeOfDay: '20:00',
          timezone: 'UTC'
        },
        achievements: ['Moon Whisperer', 'Lunar Interpreter'],
        private: false
      }
    ];
  }

  private initializeMentors() {
    this.mentors.value = [
      {
        id: 'mentor1',
        user: {
          id: 'mentor1',
          username: 'WiseTarotMaster',
          displayName: 'Elena Rodriguez',
          avatar: '/avatars/elena.jpg',
          level: 50,
          experience: 15000,
          title: 'Grand Master',
          badge: 'Verified Expert',
          joinedDate: new Date('2020-01-15'),
          lastActive: new Date(),
          reputation: 2850,
          following: [],
          followers: [],
          blocked: [],
          stats: {
            totalReadings: 5000,
            readingsShared: 1200,
            commentsGiven: 3500,
            helpfulVotes: 2800,
            achievementsUnlocked: 89,
            favoriteSpread: 'celtic_cross',
            accuracyRating: 4.9,
            streakDays: 365
          },
          preferences: {
            visibility: 'public',
            shareReadings: true,
            allowComments: true,
            emailNotifications: true,
            pushNotifications: true,
            language: 'en',
            timezone: 'America/New_York'
          }
        },
        specialties: ['Celtic Cross', 'Love Readings', 'Spiritual Guidance', 'Dream Interpretation'],
        experience: 15,
        rating: 4.9,
        totalMentees: 127,
        activeMentees: ['mentee1', 'mentee2', 'mentee3'],
        availability: {
          timezone: 'America/New_York',
          schedule: {
            'monday': [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }],
            'wednesday': [{ start: '09:00', end: '12:00' }, { start: '14:00', end: '17:00' }],
            'friday': [{ start: '09:00', end: '15:00' }],
            'saturday': [{ start: '10:00', end: '14:00' }]
          },
          booked: []
        },
        pricing: {
          currency: 'USD',
          sessionRate: 75,
          packageRates: [
            { sessions: 3, price: 200 },
            { sessions: 5, price: 300 },
            { sessions: 10, price: 550 }
          ],
          freeConsultation: true
        },
        verified: true
      },
      {
        id: 'mentor2',
        user: {
          id: 'mentor2',
          username: 'CrystalMystic',
          displayName: 'Aurora Chen',
          avatar: '/avatars/aurora.jpg',
          level: 45,
          experience: 12500,
          title: 'Cosmic Sage',
          badge: 'Crystal Expert',
          joinedDate: new Date('2020-06-20'),
          lastActive: new Date(),
          reputation: 2150,
          following: [],
          followers: [],
          blocked: [],
          stats: {
            totalReadings: 3800,
            readingsShared: 900,
            commentsGiven: 2100,
            helpfulVotes: 1950,
            achievementsUnlocked: 76,
            favoriteSpread: 'tree_of_life',
            accuracyRating: 4.8,
            streakDays: 180
          },
          preferences: {
            visibility: 'public',
            shareReadings: true,
            allowComments: true,
            emailNotifications: true,
            pushNotifications: true,
            language: 'en',
            timezone: 'America/Los_Angeles'
          }
        },
        specialties: ['Crystal Healing', 'Chakra Balancing', 'Past Life Readings', 'Meditation'],
        experience: 10,
        rating: 4.8,
        totalMentees: 85,
        activeMentees: ['mentee4', 'mentee5'],
        availability: {
          timezone: 'America/Los_Angeles',
          schedule: {
            'tuesday': [{ start: '10:00', end: '13:00' }, { start: '15:00', end: '18:00' }],
            'thursday': [{ start: '10:00', end: '13:00' }, { start: '15:00', end: '18:00' }],
            'saturday': [{ start: '09:00', end: '16:00' }],
            'sunday': [{ start: '12:00', end: '16:00' }]
          },
          booked: []
        },
        pricing: {
          currency: 'USD',
          sessionRate: 65,
          packageRates: [
            { sessions: 3, price: 180 },
            { sessions: 5, price: 275 },
            { sessions: 10, price: 500 }
          ],
          freeConsultation: true
        },
        verified: true
      }
    ];
  }

  private loadFeedPosts() {
    // Load sample feed posts
    this.feedPosts.value = [
      {
        id: 'post1',
        userId: 'user1',
        user: this.createSampleUser('MysticSeeker', 'Sarah Johnson'),
        title: 'Amazing Celtic Cross Reading - Career Breakthrough!',
        description: 'Just did a Celtic Cross spread about my career transition and wow! The cards were so spot on.',
        spreadName: 'Celtic Cross',
        cards: ['The Fool', 'Three of Pentacles', 'Ace of Wands'],
        interpretation: 'The Fool in my present situation shows I\'m at the beginning of a new journey...',
        tags: ['career', 'celtic-cross', 'breakthrough'],
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        visibility: 'public',
        likes: 23,
        comments: [],
        shares: 5,
        helpfulVotes: 18,
        reported: false
      }
    ];
  }

  private createSampleUser(username: string, displayName: string): User {
    return {
      id: `user_${username}`,
      username,
      displayName,
      level: Math.floor(Math.random() * 30) + 1,
      experience: Math.floor(Math.random() * 5000),
      title: 'Mystic Seeker',
      joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      lastActive: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      reputation: Math.floor(Math.random() * 1000),
      following: [],
      followers: [],
      blocked: [],
      stats: {
        totalReadings: Math.floor(Math.random() * 100),
        readingsShared: Math.floor(Math.random() * 20),
        commentsGiven: Math.floor(Math.random() * 50),
        helpfulVotes: Math.floor(Math.random() * 30),
        achievementsUnlocked: Math.floor(Math.random() * 20),
        favoriteSpread: 'three_card',
        accuracyRating: 3.5 + Math.random() * 1.5,
        streakDays: Math.floor(Math.random() * 100)
      },
      preferences: {
        visibility: 'public',
        shareReadings: true,
        allowComments: true,
        emailNotifications: true,
        pushNotifications: false,
        language: 'en',
        timezone: 'America/New_York'
      }
    };
  }

  private startRealTimeUpdates() {
    // Simulate real-time updates
    setInterval(() => {
      this.updateActiveUsers();
      this.checkForNewNotifications();
    }, 30000); // Every 30 seconds
  }

  private updateActiveUsers() {
    // Simulate active users online
    const sampleUsers = [
      this.createSampleUser('CosmicReader', 'Alex Thompson'),
      this.createSampleUser('StarGazer', 'Maria Santos'),
      this.createSampleUser('WiseOwl', 'David Kim'),
      this.createSampleUser('MoonChild', 'Luna Martinez')
    ];
    
    this.activeUsers.value = sampleUsers.slice(0, Math.floor(Math.random() * 4) + 1);
  }

  private checkForNewNotifications() {
    // Simulate new notifications
    const notificationTypes = ['like', 'comment', 'follow', 'mention', 'circle_invite'];
    const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    
    if (Math.random() < 0.1) { // 10% chance of new notification
      this.addNotification({
        id: `notif_${Date.now()}`,
        type,
        title: this.getNotificationTitle(type),
        message: this.getNotificationMessage(type),
        timestamp: new Date(),
        read: false,
        actionUrl: '#'
      });
    }
  }

  private getNotificationTitle(type: string): string {
    const titles: Record<string, string> = {
      'like': 'New Like',
      'comment': 'New Comment',
      'follow': 'New Follower',
      'mention': 'You were mentioned',
      'circle_invite': 'Circle Invitation'
    };
    return titles[type] || 'New Notification';
  }

  private getNotificationMessage(type: string): string {
    const messages: Record<string, string> = {
      'like': 'Someone liked your shared reading',
      'comment': 'Someone commented on your post',
      'follow': 'You have a new follower',
      'mention': 'You were mentioned in a discussion',
      'circle_invite': 'You were invited to join a tarot circle'
    };
    return messages[type] || 'You have a new notification';
  }

  private saveUserProfile() {
    if (this.currentUser.value) {
      localStorage.setItem('nightgod_user_profile', JSON.stringify(this.currentUser.value));
    }
  }

  // Public API
  public getCurrentUser(): User | null {
    return this.currentUser.value;
  }

  public updateUserProfile(updates: Partial<User>) {
    if (this.currentUser.value) {
      Object.assign(this.currentUser.value, updates);
      this.saveUserProfile();
    }
  }

  public getCommunities(category?: string): Community[] {
    if (category) {
      return this.communities.value.filter(c => c.category === category);
    }
    return this.communities.value;
  }

  public getFeaturedCommunities(): Community[] {
    return this.communities.value.filter(c => c.featured);
  }

  public getTarotCircles(type?: string): TarotCircle[] {
    if (type) {
      return this.tarotCircles.value.filter(c => c.type === type);
    }
    return this.tarotCircles.value;
  }

  public getMentors(specialty?: string): Mentor[] {
    if (specialty) {
      return this.mentors.value.filter(m => 
        m.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
      );
    }
    return this.mentors.value;
  }

  public getFeedPosts(userId?: string): SharedReading[] {
    if (userId) {
      return this.feedPosts.value.filter(p => p.userId === userId);
    }
    return this.feedPosts.value;
  }

  public getActiveUsers(): User[] {
    return this.activeUsers.value;
  }

  public getNotifications(unreadOnly = false): any[] {
    if (unreadOnly) {
      return this.notifications.value.filter(n => !n.read);
    }
    return this.notifications.value;
  }

  public addNotification(notification: any) {
    this.notifications.value.unshift(notification);
    
    // Keep only last 50 notifications
    if (this.notifications.value.length > 50) {
      this.notifications.value = this.notifications.value.slice(0, 50);
    }
  }

  public markNotificationRead(notificationId: string) {
    const notification = this.notifications.value.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  public async shareReading(readingData: {
    title: string;
    description: string;
    spreadName: string;
    cards: string[];
    interpretation: string;
    tags: string[];
    visibility: 'public' | 'friends' | 'community';
  }): Promise<SharedReading> {
    if (!this.currentUser.value) {
      throw new Error('User not authenticated');
    }

    const sharedReading: SharedReading = {
      id: `reading_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: this.currentUser.value.id,
      user: this.currentUser.value,
      ...readingData,
      timestamp: new Date(),
      likes: 0,
      comments: [],
      shares: 0,
      helpfulVotes: 0,
      reported: false
    };

    this.feedPosts.value.unshift(sharedReading);

    // Update user stats
    this.currentUser.value.stats.readingsShared++;
    this.saveUserProfile();

    return sharedReading;
  }

  public async likePost(postId: string): Promise<void> {
    const post = this.feedPosts.value.find(p => p.id === postId);
    if (post) {
      post.likes++;
    }
  }

  public async commentOnPost(postId: string, content: string): Promise<Comment> {
    if (!this.currentUser.value) {
      throw new Error('User not authenticated');
    }

    const post = this.feedPosts.value.find(p => p.id === postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const comment: Comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: this.currentUser.value.id,
      user: this.currentUser.value,
      content,
      timestamp: new Date(),
      likes: 0,
      replies: [],
      reported: false
    };

    post.comments.push(comment);

    // Update user stats
    this.currentUser.value.stats.commentsGiven++;
    this.saveUserProfile();

    return comment;
  }

  public async followUser(userId: string): Promise<void> {
    if (!this.currentUser.value) {
      throw new Error('User not authenticated');
    }

    if (!this.currentUser.value.following.includes(userId)) {
      this.currentUser.value.following.push(userId);
      this.saveUserProfile();
    }
  }

  public async unfollowUser(userId: string): Promise<void> {
    if (!this.currentUser.value) {
      throw new Error('User not authenticated');
    }

    const index = this.currentUser.value.following.indexOf(userId);
    if (index > -1) {
      this.currentUser.value.following.splice(index, 1);
      this.saveUserProfile();
    }
  }

  public async joinCommunity(communityId: string): Promise<void> {
    const community = this.communities.value.find(c => c.id === communityId);
    if (community) {
      community.memberCount++;
    }
  }

  public async leaveCommunity(communityId: string): Promise<void> {
    const community = this.communities.value.find(c => c.id === communityId);
    if (community && community.memberCount > 0) {
      community.memberCount--;
    }
  }

  public async joinTarotCircle(circleId: string): Promise<void> {
    if (!this.currentUser.value) {
      throw new Error('User not authenticated');
    }

    const circle = this.tarotCircles.value.find(c => c.id === circleId);
    if (circle && !circle.members.includes(this.currentUser.value.id) && 
        circle.members.length < circle.maxMembers) {
      circle.members.push(this.currentUser.value.id);
    }
  }

  public async leaveTarotCircle(circleId: string): Promise<void> {
    if (!this.currentUser.value) {
      throw new Error('User not authenticated');
    }

    const circle = this.tarotCircles.value.find(c => c.id === circleId);
    if (circle) {
      const index = circle.members.indexOf(this.currentUser.value.id);
      if (index > -1) {
        circle.members.splice(index, 1);
      }
    }
  }

  public async bookMentorSession(
    mentorId: string, 
    date: Date, 
    duration: number, 
    topic: string
  ): Promise<BookedSession> {
    if (!this.currentUser.value) {
      throw new Error('User not authenticated');
    }

    const mentor = this.mentors.value.find(m => m.id === mentorId);
    if (!mentor) {
      throw new Error('Mentor not found');
    }

    const session: BookedSession = {
      id: `session_${Date.now()}`,
      menteeId: this.currentUser.value.id,
      date,
      duration,
      topic,
      status: 'scheduled'
    };

    mentor.availability.booked.push(session);

    return session;
  }

  public searchUsers(query: string): User[] {
    const lowercaseQuery = query.toLowerCase();
    return this.activeUsers.value.filter(user => 
      user.username.toLowerCase().includes(lowercaseQuery) ||
      user.displayName.toLowerCase().includes(lowercaseQuery)
    );
  }

  public searchCommunities(query: string): Community[] {
    const lowercaseQuery = query.toLowerCase();
    return this.communities.value.filter(community =>
      community.name.toLowerCase().includes(lowercaseQuery) ||
      community.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  public getRecommendedUsers(): User[] {
    // Simple recommendation based on similar interests
    return this.activeUsers.value.slice(0, 3);
  }

  public getRecommendedCommunities(): Community[] {
    // Recommend based on user level and interests
    if (!this.currentUser.value) return [];

    if (this.currentUser.value.level < 10) {
      return this.communities.value.filter(c => c.category === 'beginner');
    }

    return this.communities.value.filter(c => c.featured).slice(0, 3);
  }

  // Computed properties
  public get unreadNotificationCount(): number {
    return this.notifications.value.filter(n => !n.read).length;
  }

  public get userReputation(): number {
    return this.currentUser.value?.reputation || 0;
  }

  public get followingCount(): number {
    return this.currentUser.value?.following.length || 0;
  }

  public get followerCount(): number {
    return this.currentUser.value?.followers.length || 0;
  }
}

export const communityManager = CommunityManager.getInstance();