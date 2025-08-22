/**
 * Night God Tarot - Secure JavaScript Implementation
 * Performance and Security Focused
 */

// =================== UTILITY FUNCTIONS ===================
const utils = {
    // Debounce utility for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle utility for scroll events
    throttle(func, limit) {
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
    },

    // Secure text sanitization
    sanitizeText(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    },

    // Validate email format
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    },

    // Generate secure random ID
    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9);
    },

    // Format currency safely
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
};

// =================== SECURE TAROT APPLICATION ===================
class SecureTarotApp {
    constructor() {
        this.state = {
            currentUser: null,
            cartItems: [],
            isLoading: false,
            errors: []
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupAccessibility();
        this.setupPerformanceOptimizations();
        this.setupErrorHandling();
        this.checkSystemStatus();
    }

    // =================== EVENT LISTENERS ===================
    setupEventListeners() {
        // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', this.handleSmoothScroll.bind(this));
        });

        // Mobile menu functionality
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        if (mobileBtn) {
            mobileBtn.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        // Scroll effects
        window.addEventListener('scroll', utils.throttle(this.handleScroll.bind(this), 16));

        // Form submissions
        this.setupFormHandlers();

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyNavigation.bind(this));

        // Window resize handling
        window.addEventListener('resize', utils.debounce(this.handleResize.bind(this), 250));
    }

    handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        
        if (targetId && targetId !== '#') {
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update focus for accessibility
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        }
    }

    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        
        if (navMenu && mobileBtn) {
            const isOpen = navMenu.classList.contains('open');
            
            if (isOpen) {
                navMenu.classList.remove('open');
                mobileBtn.setAttribute('aria-expanded', 'false');
            } else {
                navMenu.classList.add('open');
                mobileBtn.setAttribute('aria-expanded', 'true');
            }
        }
    }

    handleScroll() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }

    handleKeyNavigation(e) {
        // ESC key handling
        if (e.key === 'Escape') {
            this.closeAllModals();
            this.closeMobileMenu();
        }

        // Tab trap for modals
        if (e.key === 'Tab') {
            this.handleTabTrap(e);
        }
    }

    handleResize() {
        // Close mobile menu on desktop
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
    }

    // =================== ACCESSIBILITY ===================
    setupAccessibility() {
        // Focus management
        this.setupFocusManagement();
        
        // ARIA attributes
        this.updateARIAAttributes();
        
        // Skip link functionality
        this.setupSkipLink();
    }

    setupFocusManagement() {
        const focusableElements = 'a[href], button, textarea, input[type="text"], input[type="email"], input[type="tel"], select';
        
        // Enhanced focus indicators
        document.querySelectorAll(focusableElements).forEach(element => {
            element.addEventListener('focus', (e) => {
                e.target.setAttribute('data-focused', 'true');
            });
            
            element.addEventListener('blur', (e) => {
                e.target.removeAttribute('data-focused');
            });
        });
    }

    updateARIAAttributes() {
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileBtn) {
            mobileBtn.setAttribute('aria-expanded', 'false');
            mobileBtn.setAttribute('aria-controls', 'navigation-menu');
        }
        
        if (navMenu) {
            navMenu.setAttribute('id', 'navigation-menu');
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

    // =================== PERFORMANCE ===================
    setupPerformanceOptimizations() {
        // Intersection Observer for animations
        this.setupScrollAnimations();
        
        // Lazy loading for images
        this.setupLazyLoading();
        
        // Preload critical resources
        this.preloadCriticalResources();
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe sections for scroll animations
        document.querySelectorAll('.section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    }

    setupLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            // Browser supports native lazy loading
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        } else {
            // Fallback for older browsers
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    preloadCriticalResources() {
        // Preload critical fonts
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&display=swap';
        link.as = 'style';
        document.head.appendChild(link);
    }

    // =================== FORM HANDLING ===================
    setupFormHandlers() {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        });
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate form data
        const errors = this.validateFormData(data, form);
        
        if (errors.length > 0) {
            this.displayFormErrors(errors, form);
            return;
        }
        
        // Clear previous errors
        this.clearFormErrors(form);
        
        // Show loading state
        this.setFormLoading(form, true);
        
        try {
            // In production, this would make a secure API call
            await this.submitFormData(data, form);
            this.handleFormSuccess(form);
        } catch (error) {
            this.handleFormError(error, form);
        } finally {
            this.setFormLoading(form, false);
        }
    }

    validateFormData(data, form) {
        const errors = [];
        
        // Email validation
        if (data.email && !utils.validateEmail(data.email)) {
            errors.push({ field: 'email', message: 'Please enter a valid email address' });
        }
        
        // Required field validation
        form.querySelectorAll('[required]').forEach(field => {
            if (!data[field.name] || data[field.name].trim() === '') {
                errors.push({ 
                    field: field.name, 
                    message: `${field.labels[0]?.textContent || field.name} is required` 
                });
            }
        });
        
        return errors;
    }

    displayFormErrors(errors, form) {
        errors.forEach(error => {
            const field = form.querySelector(`[name="${error.field}"]`);
            if (field) {
                field.setAttribute('aria-invalid', 'true');
                field.classList.add('error');
                
                // Create or update error message
                let errorElement = form.querySelector(`#${error.field}-error`);
                if (!errorElement) {
                    errorElement = document.createElement('div');
                    errorElement.id = `${error.field}-error`;
                    errorElement.className = 'error-message';
                    errorElement.setAttribute('role', 'alert');
                    field.parentNode.appendChild(errorElement);
                }
                errorElement.textContent = error.message;
            }
        });
    }

    clearFormErrors(form) {
        form.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
            field.removeAttribute('aria-invalid');
        });
        
        form.querySelectorAll('.error-message').forEach(error => {
            error.remove();
        });
    }

    setFormLoading(form, isLoading) {
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            if (isLoading) {
                submitButton.disabled = true;
                submitButton.textContent = 'Processing...';
            } else {
                submitButton.disabled = false;
                submitButton.textContent = submitButton.dataset.originalText || 'Submit';
            }
        }
    }

    async submitFormData(data, form) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // In production, this would be a real API call
                if (Math.random() > 0.1) {
                    resolve({ success: true, message: 'Form submitted successfully' });
                } else {
                    reject(new Error('Submission failed. Please try again.'));
                }
            }, 1000);
        });
    }

    handleFormSuccess(form) {
        this.showMessage('Thank you! Your submission has been received.', 'success');
        form.reset();
    }

    handleFormError(error, form) {
        this.showMessage(error.message || 'An error occurred. Please try again.', 'error');
    }

    // =================== CARD FUNCTIONALITY ===================
    revealCard() {
        const card = document.getElementById('demoCard');
        if (!card) return;
        
        const front = card.querySelector('.card-front');
        const back = card.querySelector('.card-back');
        
        if (front && back) {
            front.style.display = 'none';
            back.style.display = 'flex';
            back.style.flexDirection = 'column';
            back.style.alignItems = 'center';
            back.style.justifyContent = 'center';
            
            // Add animation
            back.style.animation = 'fadeIn 0.5s ease-out';
            
            // Analytics (privacy-compliant)
            this.trackEvent('card_revealed', { card: 'demo' });
        }
    }

    // =================== BOOKING SYSTEM ===================
    bookReading(type) {
        // Secure booking implementation
        const bookingData = {
            type: utils.sanitizeText(type),
            timestamp: new Date().toISOString(),
            sessionId: utils.generateId()
        };
        
        // In production, this would redirect to a secure payment gateway
        this.showBookingModal(bookingData);
        
        // Analytics
        this.trackEvent('booking_initiated', { type: type });
    }

    showBookingModal(data) {
        // Create secure booking modal
        const modal = this.createModal(`
            <div class="booking-modal">
                <h3>Book Your ${data.type} Reading</h3>
                <p>You will be redirected to our secure payment gateway.</p>
                <div class="modal-actions">
                    <button class="btn-primary" onclick="app.proceedToPayment('${data.type}')">
                        Continue to Payment
                    </button>
                    <button class="btn-secondary" onclick="app.closeModal()">
                        Cancel
                    </button>
                </div>
            </div>
        `);
        
        this.showModal(modal);
    }

    proceedToPayment(type) {
        // In production, redirect to secure payment gateway
        alert(`Redirecting to secure payment for ${type} reading...`);
        this.closeModal();
    }

    // =================== MODAL SYSTEM ===================
    createModal(content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" role="dialog" aria-modal="true">
                <button class="modal-close" aria-label="Close modal">&times;</button>
                ${content}
            </div>
        `;
        
        // Close button functionality
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });
        
        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
        
        return modal;
    }

    showModal(modal) {
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const firstFocusable = modal.querySelector('button, a, input, textarea, select');
        if (firstFocusable) {
            firstFocusable.focus();
        }
    }

    closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    }

    closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.remove();
        });
        document.body.style.overflow = '';
    }

    // =================== MESSAGING SYSTEM ===================
    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        messageEl.setAttribute('role', 'alert');
        
        // Style the message
        Object.assign(messageEl.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            zIndex: '10000',
            color: 'white',
            fontSize: '1rem',
            maxWidth: '400px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        // Set background color based on type
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };
        messageEl.style.backgroundColor = colors[type] || colors.info;
        
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

    // =================== ANALYTICS & TRACKING ===================
    trackEvent(eventName, data = {}) {
        // Privacy-compliant analytics
        const eventData = {
            event: eventName,
            timestamp: Date.now(),
            ...data
        };
        
        // In production, send to analytics service
        console.log('Event tracked:', eventData);
        
        // Store locally for privacy compliance
        const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
        events.push(eventData);
        
        // Keep only last 100 events
        if (events.length > 100) {
            events.splice(0, events.length - 100);
        }
        
        localStorage.setItem('analytics_events', JSON.stringify(events));
    }

    // =================== ERROR HANDLING ===================
    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (e) => {
            this.handleError(e.error);
        });
        
        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            this.handleError(e.reason);
        });
    }

    handleError(error) {
        console.error('Application error:', error);
        
        // In production, send to error monitoring service
        this.trackEvent('error', {
            message: error.message,
            stack: error.stack
        });
        
        // Show user-friendly error message
        this.showMessage('Something went wrong. Please refresh the page and try again.', 'error');
    }

    // =================== SYSTEM STATUS ===================
    checkSystemStatus() {
        // Check if all critical features are available
        const features = {
            localStorage: typeof(Storage) !== 'undefined',
            fetch: typeof(fetch) !== 'undefined',
            intersectionObserver: 'IntersectionObserver' in window,
            css: CSS && CSS.supports && CSS.supports('display', 'grid')
        };
        
        const unsupportedFeatures = Object.entries(features)
            .filter(([name, supported]) => !supported)
            .map(([name]) => name);
        
        if (unsupportedFeatures.length > 0) {
            console.warn('Unsupported features:', unsupportedFeatures);
            this.showMessage('Some features may not work optimally in this browser.', 'warning');
        }
    }

    // =================== UTILITY METHODS ===================
    closeMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        
        if (navMenu && navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            if (mobileBtn) {
                mobileBtn.setAttribute('aria-expanded', 'false');
            }
        }
    }

    handleTabTrap(e) {
        const modal = document.querySelector('.modal-overlay');
        if (!modal) return;
        
        const focusableElements = modal.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="email"], input[type="tel"], select'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
}

// =================== GLOBAL FUNCTIONS ===================
// Export functions that need to be called from HTML
window.revealCard = function() {
    if (window.app) {
        window.app.revealCard();
    }
};

window.bookReading = function(type) {
    if (window.app) {
        window.app.bookReading(type);
    }
};

// =================== INITIALIZATION ===================
// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.app = new SecureTarotApp();
    });
} else {
    window.app = new SecureTarotApp();
}

// Performance monitoring
window.addEventListener('load', () => {
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            const loadTime = Math.round(perfData.loadEventEnd - perfData.fetchStart);
            console.log('Page load time:', loadTime, 'ms');
            
            // Track performance
            if (window.app) {
                window.app.trackEvent('page_load', { loadTime });
            }
        }
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SecureTarotApp, utils };
}