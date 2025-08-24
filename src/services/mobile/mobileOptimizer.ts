/**
 * Night God Tarot - Mobile Optimization Service
 * Advanced mobile experience and native app features
 */

import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Device, DeviceInfo } from '@capacitor/device';
import { Network, NetworkStatus } from '@capacitor/network';
import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { KeepAwake } from '@capacitor/keep-awake';

export interface MobileContext {
  platform: string;
  isNative: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isWeb: boolean;
  deviceInfo: DeviceInfo | null;
  networkStatus: NetworkStatus | null;
  orientation: 'portrait' | 'landscape';
  safeAreaInsets: SafeAreaInsets;
}

export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface NotificationOptions {
  title: string;
  body: string;
  scheduledAt?: Date;
  repeats?: boolean;
  sound?: boolean;
  vibration?: boolean;
  icon?: string;
}

export class MobileOptimizer {
  private static instance: MobileOptimizer;
  
  private mobileContext = ref<MobileContext>({
    platform: 'web',
    isNative: false,
    isIOS: false,
    isAndroid: false,
    isWeb: true,
    deviceInfo: null,
    networkStatus: null,
    orientation: 'portrait',
    safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 }
  });

  private isOffline = ref(false);
  private batteryLevel = ref(1);
  private isCharging = ref(false);
  private screenBrightness = ref(1);

  private constructor() {
    this.initializeMobileContext();
    this.setupEventListeners();
    this.optimizeForMobile();
  }

  static getInstance(): MobileOptimizer {
    if (!MobileOptimizer.instance) {
      MobileOptimizer.instance = new MobileOptimizer();
    }
    return MobileOptimizer.instance;
  }

  private async initializeMobileContext() {
    // Set platform information
    this.mobileContext.value.platform = Capacitor.getPlatform();
    this.mobileContext.value.isNative = Capacitor.isNativePlatform();
    this.mobileContext.value.isIOS = Capacitor.getPlatform() === 'ios';
    this.mobileContext.value.isAndroid = Capacitor.getPlatform() === 'android';
    this.mobileContext.value.isWeb = Capacitor.getPlatform() === 'web';

    // Get device information
    if (this.mobileContext.value.isNative) {
      try {
        this.mobileContext.value.deviceInfo = await Device.getInfo();
        
        // Get network status
        this.mobileContext.value.networkStatus = await Network.getStatus();
        this.isOffline.value = !this.mobileContext.value.networkStatus.connected;

        // Setup safe area insets for iOS
        if (this.mobileContext.value.isIOS) {
          this.setupSafeAreaInsets();
        }

        // Configure status bar
        await this.configureStatusBar();

        // Hide splash screen
        await SplashScreen.hide();

      } catch (error) {
        console.error('Failed to initialize mobile context:', error);
      }
    }

    // Setup orientation detection
    this.setupOrientationDetection();
  }

  private setupEventListeners() {
    if (this.mobileContext.value.isNative) {
      // Network status changes
      Network.addListener('networkStatusChange', (status) => {
        this.mobileContext.value.networkStatus = status;
        this.isOffline.value = !status.connected;
        this.handleNetworkChange(status);
      });

      // App state changes
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.handleAppBackground();
        } else {
          this.handleAppForeground();
        }
      });

      // Device orientation
      window.addEventListener('orientationchange', () => {
        setTimeout(() => {
          this.updateOrientation();
          this.adjustLayoutForOrientation();
        }, 100);
      });

      // Touch events for haptic feedback
      this.setupHapticFeedback();
    }

    // Web-specific optimizations
    if (this.mobileContext.value.isWeb) {
      this.setupWebMobileOptimizations();
    }
  }

  private async configureStatusBar() {
    if (this.mobileContext.value.isNative) {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setBackgroundColor({ color: '#000033' });
        
        if (this.mobileContext.value.isAndroid) {
          await StatusBar.setOverlaysWebView({ overlay: false });
        }
      } catch (error) {
        console.error('Failed to configure status bar:', error);
      }
    }
  }

  private setupSafeAreaInsets() {
    // Get safe area insets for iOS devices
    const computeInsets = () => {
      const safeAreaTop = getComputedStyle(document.documentElement)
        .getPropertyValue('env(safe-area-inset-top)');
      const safeAreaBottom = getComputedStyle(document.documentElement)
        .getPropertyValue('env(safe-area-inset-bottom)');
      const safeAreaLeft = getComputedStyle(document.documentElement)
        .getPropertyValue('env(safe-area-inset-left)');
      const safeAreaRight = getComputedStyle(document.documentElement)
        .getPropertyValue('env(safe-area-inset-right)');

      this.mobileContext.value.safeAreaInsets = {
        top: parseInt(safeAreaTop) || 0,
        bottom: parseInt(safeAreaBottom) || 0,
        left: parseInt(safeAreaLeft) || 0,
        right: parseInt(safeAreaRight) || 0
      };
    };

    computeInsets();
    window.addEventListener('resize', computeInsets);
  }

  private setupOrientationDetection() {
    this.updateOrientation();
    
    // Listen for orientation changes
    window.addEventListener('resize', () => {
      setTimeout(() => {
        this.updateOrientation();
      }, 100);
    });
  }

  private updateOrientation() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.mobileContext.value.orientation = width > height ? 'landscape' : 'portrait';
  }

  private adjustLayoutForOrientation() {
    const body = document.body;
    
    if (this.mobileContext.value.orientation === 'landscape') {
      body.classList.add('landscape-mode');
      body.classList.remove('portrait-mode');
    } else {
      body.classList.add('portrait-mode');
      body.classList.remove('landscape-mode');
    }

    // Emit orientation change event
    window.dispatchEvent(new CustomEvent('orientationChanged', {
      detail: { orientation: this.mobileContext.value.orientation }
    }));
  }

  private setupHapticFeedback() {
    // Add haptic feedback to interactive elements
    document.addEventListener('touchstart', (event) => {
      const target = event.target as HTMLElement;
      
      if (target.matches('button, .card, .interactive, [data-haptic]')) {
        this.triggerHaptic('light');
      }
    });
  }

  private setupWebMobileOptimizations() {
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);

    // Disable text selection on mobile
    document.addEventListener('selectstart', (event) => {
      if (window.innerWidth <= 768) {
        const target = event.target as HTMLElement;
        if (!target.matches('input, textarea, [contenteditable]')) {
          event.preventDefault();
        }
      }
    });

    // Add mobile viewport meta tag if missing
    if (!document.querySelector('meta[name="viewport"]')) {
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
      document.head.appendChild(viewport);
    }
  }

  private optimizeForMobile() {
    // Add mobile-specific CSS classes
    const root = document.documentElement;
    
    root.classList.add(`platform-${this.mobileContext.value.platform}`);
    
    if (this.mobileContext.value.isNative) {
      root.classList.add('native-app');
    }
    
    if (this.mobileContext.value.isIOS) {
      root.classList.add('ios-device');
    }
    
    if (this.mobileContext.value.isAndroid) {
      root.classList.add('android-device');
    }

    // Set CSS custom properties for safe area
    if (this.mobileContext.value.isIOS) {
      root.style.setProperty('--safe-area-inset-top', `${this.mobileContext.value.safeAreaInsets.top}px`);
      root.style.setProperty('--safe-area-inset-bottom', `${this.mobileContext.value.safeAreaInsets.bottom}px`);
      root.style.setProperty('--safe-area-inset-left', `${this.mobileContext.value.safeAreaInsets.left}px`);
      root.style.setProperty('--safe-area-inset-right', `${this.mobileContext.value.safeAreaInsets.right}px`);
    }

    // Optimize touch targets
    this.optimizeTouchTargets();

    // Setup gesture recognition
    this.setupGestureRecognition();
  }

  private optimizeTouchTargets() {
    const style = document.createElement('style');
    style.textContent = `
      /* Ensure minimum touch target size */
      button, .button, .touch-target {
        min-height: 44px;
        min-width: 44px;
        padding: 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      
      /* Improve tap highlighting */
      button, .button, .interactive, a {
        -webkit-tap-highlight-color: rgba(255, 215, 0, 0.2);
        tap-highlight-color: rgba(255, 215, 0, 0.2);
      }
      
      /* Remove default touch callout */
      * {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
      
      /* Allow selection for text inputs */
      input, textarea, [contenteditable] {
        -webkit-user-select: auto;
        user-select: auto;
      }
      
      /* Safe area insets for iOS */
      .safe-area-top { padding-top: env(safe-area-inset-top); }
      .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
      .safe-area-left { padding-left: env(safe-area-inset-left); }
      .safe-area-right { padding-right: env(safe-area-inset-right); }
      
      /* Orientation-specific styles */
      .landscape-mode .tarot-card { 
        max-width: 120px;
        max-height: 180px;
      }
      
      .portrait-mode .tarot-card {
        max-width: 150px;
        max-height: 225px;
      }
      
      /* Mobile-specific animations */
      @media (max-width: 768px) {
        .card-flip {
          animation-duration: 0.4s;
        }
        
        .particle-system {
          display: none; /* Reduce battery usage */
        }
        
        .cosmic-animation {
          animation-iteration-count: 1;
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  private setupGestureRecognition() {
    let startX = 0;
    let startY = 0;
    let startTime = 0;

    document.addEventListener('touchstart', (event) => {
      const touch = event.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
    });

    document.addEventListener('touchend', (event) => {
      if (event.touches.length > 0) return;

      const touch = event.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;
      const endTime = Date.now();

      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const deltaTime = endTime - startTime;

      // Detect swipe gestures
      if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
        if (deltaTime < 300) {
          let direction = '';
          
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            direction = deltaX > 0 ? 'right' : 'left';
          } else {
            direction = deltaY > 0 ? 'down' : 'up';
          }

          this.handleSwipeGesture(direction, { startX, startY, endX, endY });
        }
      }

      // Detect long press
      if (deltaTime > 500 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
        this.handleLongPress({ x: endX, y: endY });
      }
    });
  }

  private handleSwipeGesture(direction: string, coordinates: any) {
    window.dispatchEvent(new CustomEvent('swipeGesture', {
      detail: { direction, coordinates }
    }));

    // Specific gesture handling
    switch (direction) {
      case 'left':
        // Navigate to next card or section
        this.triggerHaptic('medium');
        break;
      case 'right':
        // Navigate to previous card or section
        this.triggerHaptic('medium');
        break;
      case 'up':
        // Show card details or reading
        this.triggerHaptic('light');
        break;
      case 'down':
        // Minimize or close current view
        this.triggerHaptic('light');
        break;
    }
  }

  private handleLongPress(coordinates: { x: number; y: number }) {
    this.triggerHaptic('heavy');
    
    window.dispatchEvent(new CustomEvent('longPress', {
      detail: { coordinates }
    }));
  }

  private handleNetworkChange(status: NetworkStatus) {
    if (status.connected) {
      this.showToast('Connection restored', 'success');
      // Sync any pending data
      this.syncPendingData();
    } else {
      this.showToast('Connection lost - Working offline', 'warning');
      // Enable offline mode
      this.enableOfflineMode();
    }
  }

  private handleAppBackground() {
    // Save current state
    this.savePersistentState();
    
    // Pause non-essential operations
    this.pauseAnimations();
    
    // Keep awake during readings
    if (this.isReadingInProgress()) {
      KeepAwake.keepAwake();
    }
  }

  private handleAppForeground() {
    // Resume operations
    this.resumeAnimations();
    
    // Allow device to sleep
    KeepAwake.allowSleep();
    
    // Check for updates
    this.checkForUpdates();
  }

  // Public API
  public getMobileContext(): MobileContext {
    return this.mobileContext.value;
  }

  public async triggerHaptic(style: 'light' | 'medium' | 'heavy') {
    if (this.mobileContext.value.isNative) {
      try {
        const impactStyle = style === 'light' ? ImpactStyle.Light :
                           style === 'medium' ? ImpactStyle.Medium :
                           ImpactStyle.Heavy;
        
        await Haptics.impact({ style: impactStyle });
      } catch (error) {
        console.error('Haptic feedback failed:', error);
      }
    } else {
      // Web vibration fallback
      if (navigator.vibrate) {
        const duration = style === 'light' ? 10 :
                        style === 'medium' ? 20 : 50;
        navigator.vibrate(duration);
      }
    }
  }

  public async scheduleNotification(options: NotificationOptions): Promise<void> {
    if (this.mobileContext.value.isNative) {
      try {
        // Request permission first
        const permission = await LocalNotifications.requestPermissions();
        
        if (permission.display === 'granted') {
          const notificationOptions: ScheduleOptions = {
            notifications: [{
              title: options.title,
              body: options.body,
              id: Date.now(),
              schedule: options.scheduledAt ? { at: options.scheduledAt } : undefined,
              sound: options.sound ? 'beep.wav' : undefined,
              attachments: options.icon ? [{ id: 'icon', url: options.icon }] : undefined,
              actionTypeId: 'TAROT_NOTIFICATION',
              extra: {
                type: 'tarot_reading'
              }
            }]
          };

          await LocalNotifications.schedule(notificationOptions);
        }
      } catch (error) {
        console.error('Failed to schedule notification:', error);
      }
    }
  }

  public async shareReading(readingData: {
    title: string;
    content: string;
    image?: string;
  }): Promise<void> {
    if (navigator.share) {
      try {
        await navigator.share({
          title: readingData.title,
          text: readingData.content,
          url: window.location.href
        });
      } catch (error) {
        console.error('Sharing failed:', error);
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(
        `${readingData.title}\n\n${readingData.content}\n\n${window.location.href}`
      );
      this.showToast('Reading copied to clipboard', 'success');
    }
  }

  public optimizeImageLoading() {
    // Implement lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src!;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  public enableBatteryOptimization() {
    // Reduce animations on low battery
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        this.batteryLevel.value = battery.level;
        this.isCharging.value = battery.charging;

        if (battery.level < 0.2 && !battery.charging) {
          document.body.classList.add('low-battery-mode');
          this.showToast('Low battery - Reducing animations', 'info');
        }

        // Listen for battery changes
        battery.addEventListener('levelchange', () => {
          this.batteryLevel.value = battery.level;
        });

        battery.addEventListener('chargingchange', () => {
          this.isCharging.value = battery.charging;
        });
      });
    }
  }

  public setupOfflineStorage() {
    // Implement service worker for offline functionality
    if ('serviceWorker' in navigator && this.mobileContext.value.isWeb) {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('Service Worker registered:', registration);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }

  private showToast(message: string, type: 'success' | 'warning' | 'error' | 'info') {
    // Create and show toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--toast-bg, rgba(0, 0, 0, 0.8));
      color: white;
      padding: 12px 24px;
      border-radius: 24px;
      z-index: 10000;
      font-size: 14px;
      max-width: 80%;
      text-align: center;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  private savePersistentState() {
    // Save current app state to localStorage
    const state = {
      timestamp: Date.now(),
      route: window.location.hash,
      userPreferences: this.getUserPreferences()
    };
    
    localStorage.setItem('nightgod_app_state', JSON.stringify(state));
  }

  private getUserPreferences() {
    return {
      theme: document.body.getAttribute('data-theme'),
      language: localStorage.getItem('nightgod_language'),
      notifications: localStorage.getItem('nightgod_notifications') === 'true'
    };
  }

  private pauseAnimations() {
    document.body.classList.add('animations-paused');
  }

  private resumeAnimations() {
    document.body.classList.remove('animations-paused');
  }

  private isReadingInProgress(): boolean {
    return document.querySelector('.reading-in-progress') !== null;
  }

  private syncPendingData() {
    // Sync any offline data when connection is restored
    const pendingData = localStorage.getItem('nightgod_pending_sync');
    if (pendingData) {
      try {
        const data = JSON.parse(pendingData);
        // Process pending sync data
        console.log('Syncing pending data:', data);
        localStorage.removeItem('nightgod_pending_sync');
      } catch (error) {
        console.error('Failed to sync pending data:', error);
      }
    }
  }

  private enableOfflineMode() {
    document.body.classList.add('offline-mode');
    // Cache current readings and essential data
  }

  private checkForUpdates() {
    // Check for app updates when returning to foreground
    if (this.mobileContext.value.isWeb && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration) {
          registration.update();
        }
      });
    }
  }

  // Computed properties
  public get isPortrait(): boolean {
    return this.mobileContext.value.orientation === 'portrait';
  }

  public get isLandscape(): boolean {
    return this.mobileContext.value.orientation === 'landscape';
  }

  public get isMobile(): boolean {
    return window.innerWidth <= 768;
  }

  public get isTablet(): boolean {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
  }

  public get isDesktop(): boolean {
    return window.innerWidth > 1024;
  }

  public get connectionType(): string {
    return this.mobileContext.value.networkStatus?.connectionType || 'unknown';
  }

  public get isOnline(): boolean {
    return !this.isOffline.value;
  }

  public get deviceModel(): string {
    return this.mobileContext.value.deviceInfo?.model || 'Unknown';
  }

  public get osVersion(): string {
    return this.mobileContext.value.deviceInfo?.osVersion || 'Unknown';
  }
}

export const mobileOptimizer = MobileOptimizer.getInstance();