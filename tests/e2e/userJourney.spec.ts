/**
 * Night God Tarot - End-to-End User Journey Tests
 * Complete user experience testing with Playwright
 */

import { test, expect, type Page } from '@playwright/test';

// Test configuration
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173';
const MOBILE_VIEWPORT = { width: 375, height: 667 };
const TABLET_VIEWPORT = { width: 768, height: 1024 };
const DESKTOP_VIEWPORT = { width: 1280, height: 720 };

test.describe('Night God Tarot - User Journey', () => {
  
  test.beforeEach(async ({ page }) => {
    // Set up common test data and state
    await page.goto(BASE_URL);
    
    // Accept cookies/consent if modal appears
    const consentModal = page.locator('[data-testid="consent-modal"]');
    if (await consentModal.isVisible()) {
      await page.click('[data-testid="accept-consent"]');
    }
  });

  test.describe('Homepage Experience', () => {
    
    test('should load homepage successfully', async ({ page }) => {
      await expect(page).toHaveTitle(/Night God Tarot/);
      
      // Check main elements are present
      await expect(page.locator('[data-testid="main-logo"]')).toBeVisible();
      await expect(page.locator('[data-testid="tagline"]')).toBeVisible();
      await expect(page.locator('[data-testid="start-reading-button"]')).toBeVisible();
    });

    test('should display cosmic background and animations', async ({ page }) => {
      // Check for cosmic background elements
      await expect(page.locator('.cosmic-background')).toBeVisible();
      await expect(page.locator('.particle-system')).toBeVisible();
      
      // Verify animations are running (check for animation classes)
      const animatedElements = page.locator('[class*="animate"]');
      await expect(animatedElements.first()).toBeVisible();
    });

    test('should show level progress for registered users', async ({ page }) => {
      // Mock user authentication
      await page.evaluate(() => {
        localStorage.setItem('nightgod_user_profile', JSON.stringify({
          id: 'test-user',
          level: 5,
          experience: 1250,
          nextLevelExp: 2000
        }));
      });
      
      await page.reload();
      
      await expect(page.locator('[data-testid="level-progress"]')).toBeVisible();
      await expect(page.locator('[data-testid="level-badge"]')).toContainText('Level 5');
    });

  });

  test.describe('Reading Experience Flow', () => {

    test('should complete full tarot reading flow', async ({ page }) => {
      // Start reading
      await page.click('[data-testid="start-reading-button"]');
      
      // Select language
      await expect(page.locator('[data-testid="language-selector"]')).toBeVisible();
      await page.click('[data-testid="language-en"]');
      
      // Choose reading style
      await expect(page.locator('[data-testid="reading-styles"]')).toBeVisible();
      await page.click('[data-testid="style-classic"]');
      
      // Enter question
      await page.fill('[data-testid="question-input"]', 'What should I focus on in my career?');
      
      // Begin reading
      await page.click('[data-testid="begin-reading-button"]');
      
      // Wait for AI processing
      await expect(page.locator('[data-testid="processing-animation"]')).toBeVisible();
      await expect(page.locator('[data-testid="ai-models-status"]')).toBeVisible();
      
      // Wait for cards to appear (with timeout)
      await expect(page.locator('[data-testid="tarot-cards"]')).toBeVisible({ timeout: 30000 });
      
      // Reveal cards by clicking
      const cards = page.locator('[data-testid^="tarot-card-"]');
      const cardCount = await cards.count();
      
      for (let i = 0; i < cardCount; i++) {
        await cards.nth(i).click();
        await page.waitForTimeout(500); // Wait for flip animation
      }
      
      // Check reading results
      await expect(page.locator('[data-testid="reading-results"]')).toBeVisible();
      await expect(page.locator('[data-testid="reading-overview"]')).toBeVisible();
      await expect(page.locator('[data-testid="reading-sections"]')).toBeVisible();
      await expect(page.locator('[data-testid="confidence-score"]')).toBeVisible();
      
      // Verify reading actions are available
      await expect(page.locator('[data-testid="save-reading"]')).toBeVisible();
      await expect(page.locator('[data-testid="share-reading"]')).toBeVisible();
      await expect(page.locator('[data-testid="export-pdf"]')).toBeVisible();
      await expect(page.locator('[data-testid="audio-reading"]')).toBeVisible();
    });

    test('should handle voice input', async ({ page }) => {
      // Mock getUserMedia for voice input
      await page.context().grantPermissions(['microphone']);
      
      await page.click('[data-testid="start-reading-button"]');
      await page.click('[data-testid="voice-input-button"]');
      
      // Should show listening state
      await expect(page.locator('[data-testid="voice-input-button"].listening')).toBeVisible();
      
      // Mock voice input result
      await page.evaluate(() => {
        const input = document.querySelector('[data-testid="question-input"]') as HTMLTextAreaElement;
        if (input) {
          input.value = 'What does my future hold?';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      
      await expect(page.locator('[data-testid="question-input"]')).toHaveValue('What does my future hold?');
    });

    test('should save and share readings', async ({ page }) => {
      // Complete a reading first
      await page.click('[data-testid="start-reading-button"]');
      await page.click('[data-testid="language-en"]');
      await page.click('[data-testid="style-classic"]');
      await page.fill('[data-testid="question-input"]', 'Test question for saving');
      await page.click('[data-testid="begin-reading-button"]');
      
      await expect(page.locator('[data-testid="reading-results"]')).toBeVisible({ timeout: 30000 });
      
      // Save reading
      await page.click('[data-testid="save-reading"]');
      await expect(page.locator('[data-testid="notification"]')).toContainText('Reading saved');
      
      // Test sharing
      await page.click('[data-testid="share-reading"]');
      
      // Should either open native share or copy to clipboard
      const notification = page.locator('[data-testid="notification"]');
      await expect(notification).toBeVisible();
    });

  });

  test.describe('Mobile Responsiveness', () => {

    test('should work correctly on mobile devices', async ({ browser }) => {
      const context = await browser.newContext({
        viewport: MOBILE_VIEWPORT,
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
      });
      
      const page = await context.newPage();
      await page.goto(BASE_URL);
      
      // Check mobile-specific elements
      await expect(page.locator('.mobile-menu')).toBeVisible();
      await expect(page.locator('[data-testid="floating-menu"]')).toBeVisible();
      
      // Test touch interactions
      await page.tap('[data-testid="start-reading-button"]');
      await expect(page.locator('[data-testid="language-selector"]')).toBeVisible();
      
      // Test swipe gestures (simulate)
      await page.touchscreen.tap(200, 400);
      await page.touchscreen.tap(250, 400);
      
      await context.close();
    });

    test('should adapt to tablet viewport', async ({ browser }) => {
      const context = await browser.newContext({ viewport: TABLET_VIEWPORT });
      const page = await context.newPage();
      await page.goto(BASE_URL);
      
      // Check tablet-specific layout
      await expect(page.locator('.tablet-layout')).toBeVisible();
      
      // Verify card grid layout
      const cardGrid = page.locator('[data-testid="cards-grid"]');
      await expect(cardGrid).toHaveCSS('grid-template-columns', /repeat\(2,/);
      
      await context.close();
    });

  });

  test.describe('Accessibility', () => {

    test('should meet accessibility standards', async ({ page }) => {
      // Check for proper heading structure
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
      
      // Check for alt text on images
      const images = page.locator('img');
      const imageCount = await images.count();
      
      for (let i = 0; i < imageCount; i++) {
        await expect(images.nth(i)).toHaveAttribute('alt');
      }
      
      // Check for proper form labels
      const inputs = page.locator('input, textarea, select');
      const inputCount = await inputs.count();
      
      for (let i = 0; i < inputCount; i++) {
        const input = inputs.nth(i);
        const hasLabel = await input.evaluate(el => {
          const id = el.id;
          const ariaLabel = el.getAttribute('aria-label');
          const ariaLabelledBy = el.getAttribute('aria-labelledby');
          const label = document.querySelector(`label[for="${id}"]`);
          
          return !!(ariaLabel || ariaLabelledBy || label);
        });
        
        expect(hasLabel).toBe(true);
      }
      
      // Check for keyboard navigation
      await page.keyboard.press('Tab');
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    });

    test('should support screen readers', async ({ page }) => {
      // Check for proper ARIA labels and roles
      await expect(page.locator('[role="main"]')).toBeVisible();
      await expect(page.locator('[role="navigation"]')).toBeVisible();
      
      // Check for live regions for dynamic content
      await expect(page.locator('[aria-live="polite"]')).toBeVisible();
      
      // Verify skip links
      await page.keyboard.press('Tab');
      const skipLink = page.locator('[data-testid="skip-to-content"]');
      await expect(skipLink).toBeVisible();
    });

  });

  test.describe('Performance', () => {

    test('should load within performance budgets', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto(BASE_URL);
      await expect(page.locator('[data-testid="main-logo"]')).toBeVisible();
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000); // 3 second budget
    });

    test('should have good Core Web Vitals', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Measure performance metrics
      const metrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const metrics = {} as any;
            
            entries.forEach((entry) => {
              if (entry.entryType === 'largest-contentful-paint') {
                metrics.lcp = entry.startTime;
              }
              if (entry.entryType === 'first-input') {
                metrics.fid = (entry as any).processingStart - entry.startTime;
              }
            });
            
            resolve(metrics);
          }).observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
          
          // Timeout fallback
          setTimeout(() => resolve({}), 5000);
        });
      });
      
      // LCP should be under 2.5s
      if ((metrics as any).lcp) {
        expect((metrics as any).lcp).toBeLessThan(2500);
      }
      
      // FID should be under 100ms
      if ((metrics as any).fid) {
        expect((metrics as any).fid).toBeLessThan(100);
      }
    });

  });

  test.describe('Error Handling', () => {

    test('should handle network errors gracefully', async ({ page }) => {
      // Intercept API calls and return errors
      await page.route('**/api/**', (route) => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      });
      
      await page.click('[data-testid="start-reading-button"]');
      await page.click('[data-testid="language-en"]');
      await page.click('[data-testid="style-classic"]');
      await page.fill('[data-testid="question-input"]', 'Test error handling');
      await page.click('[data-testid="begin-reading-button"]');
      
      // Should show error message
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-message"]')).toContainText('Please try again');
    });

    test('should handle offline mode', async ({ page, context }) => {
      // Go offline
      await context.setOffline(true);
      
      await page.reload();
      
      // Should show offline indicator
      await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible();
      
      // Should still allow basic functionality
      await expect(page.locator('[data-testid="main-logo"]')).toBeVisible();
      
      // Go back online
      await context.setOffline(false);
      await page.reload();
      
      await expect(page.locator('[data-testid="offline-indicator"]')).not.toBeVisible();
    });

  });

  test.describe('Gamification Features', () => {

    test('should display achievements', async ({ page }) => {
      // Mock user with achievements
      await page.evaluate(() => {
        localStorage.setItem('nightgod_gamification', JSON.stringify({
          achievements: {
            'first_reading': { unlocked: true, unlockedAt: new Date() }
          }
        }));
      });
      
      await page.reload();
      
      // Open achievements
      await page.click('[data-testid="floating-menu"]');
      await page.click('[data-testid="achievements-button"]');
      
      await expect(page.locator('[data-testid="achievements-modal"]')).toBeVisible();
      await expect(page.locator('[data-testid="achievement-first-reading"]')).toHaveClass(/unlocked/);
    });

    test('should show level progression', async ({ page }) => {
      // Complete reading to gain experience
      await page.click('[data-testid="start-reading-button"]');
      await page.click('[data-testid="language-en"]');
      await page.click('[data-testid="style-classic"]');
      await page.fill('[data-testid="question-input"]', 'Level progression test');
      await page.click('[data-testid="begin-reading-button"]');
      
      await expect(page.locator('[data-testid="reading-results"]')).toBeVisible({ timeout: 30000 });
      
      // Should show experience gain
      await expect(page.locator('[data-testid="experience-gained"]')).toBeVisible();
    });

  });

  test.describe('Social Features', () => {

    test('should allow reading sharing', async ({ page }) => {
      // Mock user authentication
      await page.evaluate(() => {
        localStorage.setItem('nightgod_user_profile', JSON.stringify({
          id: 'test-user',
          username: 'TestUser'
        }));
      });
      
      await page.reload();
      
      // Complete a reading
      await page.click('[data-testid="start-reading-button"]');
      await page.click('[data-testid="language-en"]');
      await page.click('[data-testid="style-classic"]');
      await page.fill('[data-testid="question-input"]', 'Social sharing test');
      await page.click('[data-testid="begin-reading-button"]');
      
      await expect(page.locator('[data-testid="reading-results"]')).toBeVisible({ timeout: 30000 });
      
      // Share reading socially
      await page.click('[data-testid="social-share-button"]');
      await expect(page.locator('[data-testid="social-share-modal"]')).toBeVisible();
      
      await page.fill('[data-testid="share-title"]', 'Amazing reading!');
      await page.fill('[data-testid="share-description"]', 'This reading was so insightful.');
      await page.click('[data-testid="confirm-share"]');
      
      await expect(page.locator('[data-testid="notification"]')).toContainText('Reading shared');
    });

  });

  test.describe('Multi-language Support', () => {

    test('should switch languages correctly', async ({ page }) => {
      // Test Chinese language
      await page.click('[data-testid="start-reading-button"]');
      await page.click('[data-testid="language-zh"]');
      
      // Check UI elements are translated
      await expect(page.locator('[data-testid="reading-styles-title"]')).toContainText('选择占卜方式');
      
      // Test Japanese language
      await page.click('[data-testid="language-ja"]');
      await expect(page.locator('[data-testid="reading-styles-title"]')).toContainText('占い方法を選択');
      
      // Back to English
      await page.click('[data-testid="language-en"]');
      await expect(page.locator('[data-testid="reading-styles-title"]')).toContainText('Choose Your Reading Style');
    });

  });

  test.describe('Payment Flow', () => {

    test('should display pricing tiers', async ({ page }) => {
      await page.click('[data-testid="upgrade-button"]');
      
      await expect(page.locator('[data-testid="pricing-modal"]')).toBeVisible();
      await expect(page.locator('[data-testid="tier-mystic"]')).toBeVisible();
      await expect(page.locator('[data-testid="tier-sage"]')).toBeVisible();
      await expect(page.locator('[data-testid="tier-lifetime"]')).toBeVisible();
    });

    test('should handle subscription upgrade flow', async ({ page }) => {
      // Mock payment provider
      await page.route('**/api/payments/**', (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, redirectUrl: '/payment-success' })
        });
      });
      
      await page.click('[data-testid="upgrade-button"]');
      await page.click('[data-testid="select-mystic-plan"]');
      await page.click('[data-testid="payment-stripe"]');
      
      // Should redirect to success page
      await expect(page).toHaveURL(/payment-success/);
    });

  });

});

// Helper functions for common test patterns
async function completeBasicReading(page: Page, question = 'Test question') {
  await page.click('[data-testid="start-reading-button"]');
  await page.click('[data-testid="language-en"]');
  await page.click('[data-testid="style-classic"]');
  await page.fill('[data-testid="question-input"]', question);
  await page.click('[data-testid="begin-reading-button"]');
  await expect(page.locator('[data-testid="reading-results"]')).toBeVisible({ timeout: 30000 });
}

async function mockUserLogin(page: Page, userData = {}) {
  await page.evaluate((data) => {
    localStorage.setItem('nightgod_user_profile', JSON.stringify({
      id: 'test-user',
      username: 'TestUser',
      level: 5,
      experience: 1250,
      ...data
    }));
  }, userData);
  await page.reload();
}