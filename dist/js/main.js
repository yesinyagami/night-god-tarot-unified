/**
 * Night God Tarot - Optimized JavaScript
 * Performance and Security Focused Implementation
 */

// =================== PERFORMANCE OPTIMIZATIONS ===================
// Use modern ES6+ features with fallbacks
// Debounce utility for performance
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle utility for scroll events
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// =================== SECURITY HELPERS ===================
// XSS Protection
const sanitizeHTML = (str) => {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
};

// Input validation
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validateRequired = (value) => {
    return value && value.trim().length > 0;
};

// =================== MAIN APPLICATION ===================
class NightGodTarot {
    constructor() {
        this.init();
        this.bindEvents();
        this.setupAccessibility();
    }

    init() {
        // Initialize components
        this.navbar = document.querySelector('.navbar');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.navMenu = document.querySelector('.nav-menu');
        this.contactForm = document.querySelector('.contact-form');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        
        // Set up scroll effects
        this.setupScrollEffects();
        
        // Hide loading screen after delay
        this.hideLoadingScreen();
    }

    bindEvents() {
        // Scroll events (throttled for performance)
        window.addEventListener('scroll', throttle(this.handleScroll.bind(this), 16));
        
        // Mobile menu toggle
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', this.toggleMobileMenu.bind(this));
        }
        
        // Smooth scrolling for anchor links
        this.setupSmoothScrolling();
        
        // Form submission
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', this.handleFormSubmit.bind(this));
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyNavigation.bind(this));
        
        // Window resize (debounced)
        window.addEventListener('resize', debounce(this.handleResize.bind(this), 250));
    }

    setupAccessibility() {
        // Focus management
        this.setupFocusManagement();
        
        // ARIA attributes
        this.updateARIA();
        
        // Skip link functionality
        this.setupSkipLink();
    }

    setupScrollEffects() {
        // Navbar scroll effect
        this.handleScroll();
    }

    handleScroll() {
        if (!this.navbar) return;
        
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }

    toggleMobileMenu() {
        if (!this.navMenu || !this.mobileMenuBtn) return;
        
        const isOpen = this.navMenu.classList.contains('open');
        
        if (isOpen) {
            this.navMenu.classList.remove('open');
            this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
        } else {
            this.navMenu.classList.add('open');
            this.mobileMenuBtn.setAttribute('aria-expanded', 'true');
        }
    }

    setupSmoothScrolling() {
        // Handle anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Focus target for accessibility
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                }
            });
        });
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this.contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };
        
        // Validate form
        const errors = this.validateForm(data);
        
        if (Object.keys(errors).length > 0) {
            this.displayErrors(errors);
            return;
        }
        
        // Clear previous errors
        this.clearErrors();
        
        // Submit form (simulate API call)
        this.submitForm(data);
    }

    validateForm(data) {
        const errors = {};
        
        if (!validateRequired(data.name)) {
            errors.name = '請輸入您的姓名';
        }
        
        if (!validateRequired(data.email)) {
            errors.email = '請輸入電子信箱';
        } else if (!validateEmail(data.email)) {
            errors.email = '請輸入有效的電子信箱格式';
        }
        
        return errors;
    }

    displayErrors(errors) {
        Object.keys(errors).forEach(field => {
            const errorElement = document.getElementById(`${field}-error`);
            if (errorElement) {
                errorElement.textContent = errors[field];
                errorElement.classList.add('show');
                
                // Focus first error field
                const fieldElement = document.getElementById(field);
                if (fieldElement && Object.keys(errors)[0] === field) {
                    fieldElement.focus();
                }
            }
        });
    }

    clearErrors() {
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
            error.classList.remove('show');
        });
    }

    async submitForm(data) {
        try {
            // Show loading state
            const submitBtn = this.contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '送出中...';
            submitBtn.disabled = true;
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Success message
            this.showMessage('感謝您的諮詢！我們將盡快與您聯絡。', 'success');
            this.contactForm.reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage('送出失敗，請稍後再試。', 'error');
            
            // Reset button
            const submitBtn = this.contactForm.querySelector('button[type="submit"]');
            submitBtn.textContent = '送出諮詢';
            submitBtn.disabled = false;
        }
    }

    showMessage(message, type = 'info') {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        messageEl.setAttribute('role', 'alert');
        
        // Style the message
        Object.assign(messageEl.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            zIndex: '10000',
            color: 'white',
            fontSize: '16px',
            maxWidth: '400px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        // Set background color based on type
        switch(type) {
            case 'success':
                messageEl.style.backgroundColor = '#27ae60';
                break;
            case 'error':
                messageEl.style.backgroundColor = '#e74c3c';
                break;
            default:
                messageEl.style.backgroundColor = '#3498db';
        }
        
        // Add to page
        document.body.appendChild(messageEl);
        
        // Animate in
        setTimeout(() => {
            messageEl.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 5000);
    }

    handleKeyNavigation(e) {
        // ESC key to close mobile menu
        if (e.key === 'Escape' && this.navMenu && this.navMenu.classList.contains('open')) {
            this.toggleMobileMenu();
        }
    }

    setupFocusManagement() {
        // Focus trap for mobile menu
        const focusableElements = 'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select';
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && this.navMenu && this.navMenu.classList.contains('open')) {
                const focusableContent = this.navMenu.querySelectorAll(focusableElements);
                const firstFocusableElement = focusableContent[0];
                const lastFocusableElement = focusableContent[focusableContent.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    updateARIA() {
        // Update ARIA attributes
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.setAttribute('aria-expanded', 'false');
            this.mobileMenuBtn.setAttribute('aria-controls', 'navigation-menu');
        }
        
        if (this.navMenu) {
            this.navMenu.setAttribute('id', 'navigation-menu');
        }
    }

    setupSkipLink() {
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector('#main-content');
                if (target) {
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                }
            });
        }
    }

    hideLoadingScreen() {
        if (this.loadingOverlay) {
            setTimeout(() => {
                this.loadingOverlay.classList.add('fade-out');
                
                setTimeout(() => {
                    this.loadingOverlay.style.display = 'none';
                }, 500);
            }, 1500);
        }
    }

    handleResize() {
        // Handle responsive behavior
        if (window.innerWidth > 768 && this.navMenu && this.navMenu.classList.contains('open')) {
            this.toggleMobileMenu();
        }
    }
}

// =================== ANALYTICS (GDPR COMPLIANT) ===================
class Analytics {
    constructor() {
        this.trackingEnabled = false;
        this.checkConsent();
    }

    checkConsent() {
        // Check if user has given consent
        const consent = localStorage.getItem('analytics-consent');
        if (consent === 'granted') {
            this.enableTracking();
        } else if (consent === null) {
            this.showConsentBanner();
        }
    }

    enableTracking() {
        this.trackingEnabled = true;
        console.log('Analytics enabled');
        // Initialize your analytics here
    }

    trackEvent(event, category, label, value) {
        if (!this.trackingEnabled) return;
        
        // Track event (implement your analytics provider)
        console.log('Event tracked:', { event, category, label, value });
    }

    showConsentBanner() {
        // Create consent banner (implement GDPR-compliant consent)
        console.log('Show consent banner');
    }
}

// =================== INITIALIZATION ===================
// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

function initializeApp() {
    // Initialize main application
    const app = new NightGodTarot();
    
    // Initialize analytics
    const analytics = new Analytics();
    
    // Store instances globally for debugging (development only)
    if (process.env.NODE_ENV === 'development') {
        window.app = app;
        window.analytics = analytics;
    }
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
            }, 0);
        });
    }
}

// =================== ERROR HANDLING ===================
// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // Send to error reporting service in production
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // Send to error reporting service in production
});

// =================== SERVICE WORKER REGISTRATION ===================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered:', registration);
        } catch (error) {
            console.log('Service Worker registration failed:', error);
        }
    });
}

// =================== EXPORTS ===================
export { NightGodTarot, Analytics, debounce, throttle, sanitizeHTML };