// ============================================
// FREYA TRADES - INTERACTIVE FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initFAQ();
    initScrollReveal();
    initSmoothScroll();
    initModal();
    initChatPreview();
    initSpotlight();
    initHeaderScroll();
    initAnalyticsTracking();
});

// ============================================
// ANALYTICS TRACKING HELPER
// ============================================

/**
 * Universal analytics tracking function
 * Works with both Google Analytics 4 (gtag) and Google Tag Manager (dataLayer)
 */
function trackEvent(eventName, eventParams = {}) {
    // Track with Google Analytics 4 (gtag)
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventParams);
    }
    
    // Track with Google Tag Manager (dataLayer)
    if (typeof window.dataLayer !== 'undefined') {
        window.dataLayer.push({
            'event': eventName,
            ...eventParams
        });
    }
    
    // Console log for debugging (remove in production if desired)
    console.log('📊 Analytics Event:', eventName, eventParams);
}

/**
 * Track button/link clicks with additional context
 */
function trackClick(element, eventName, additionalParams = {}) {
    const params = {
        button_text: element.textContent?.trim() || element.innerText?.trim() || 'Unknown',
        button_location: element.closest('section')?.className || 'Unknown',
        ...additionalParams
    };
    
    trackEvent(eventName, params);
}

// ============================================
// INITIALIZE ANALYTICS TRACKING
// ============================================

function initAnalyticsTracking() {
    // Track Launch Live button clicks
    const launchLiveBtn = document.querySelector('a.btn-demo[href*="live.freyatrades.page"]');
    if (launchLiveBtn) {
        launchLiveBtn.addEventListener('click', function(e) {
            trackClick(this, 'launch_live_click', {
                destination_url: this.href,
                button_type: 'launch_live'
            });
        });
    }
    
    // Track Telegram button clicks in modal
    const telegramBtn = document.querySelector('.platform-btn.telegram-btn');
    if (telegramBtn) {
        telegramBtn.addEventListener('click', function(e) {
            trackClick(this, 'telegram_click', {
                destination_url: this.href,
                button_type: 'telegram',
                source: 'modal'
            });
        });
    }
    
    // Track Whop button clicks in modal
    const whopBtn = document.querySelector('.platform-btn.whop-btn');
    if (whopBtn) {
        whopBtn.addEventListener('click', function(e) {
            trackClick(this, 'whop_click', {
                destination_url: this.href,
                button_type: 'whop',
                source: 'modal'
            });
        });
    }
    
    // Track all "Join Free Trial" button clicks (modal opens)
    const modalTriggers = document.querySelectorAll('.js-open-modal');
    modalTriggers.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            const section = this.closest('section');
            const sectionName = section ? (section.className || section.id || 'unknown') : 'unknown';
            
            trackClick(this, 'modal_open', {
                button_type: 'join_free_trial',
                section: sectionName,
                button_index: index
            });
        });
    });
    
    // Track modal closes
    const modal = document.getElementById('platform-modal');
    if (modal) {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                trackEvent('modal_close', {
                    close_method: 'button'
                });
            });
        }
        
        // Track modal close on outside click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                trackEvent('modal_close', {
                    close_method: 'outside_click'
                });
            }
        });
    }
    
    // Track page view (already handled by GA4, but we can add custom data)
    trackEvent('page_view', {
        page_title: document.title,
        page_location: window.location.href
    });
}

// ============================================
// HEADER SCROLL EFFECT
// ============================================
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    const scrollThreshold = window.innerHeight; // One viewport height
    
    window.addEventListener('scroll', () => {
        if (window.scrollY >= scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Check initial state
    if (window.scrollY >= scrollThreshold) {
        header.classList.add('scrolled');
    }
}

// ============================================
// SPOTLIGHT EFFECT
// ============================================
function initSpotlight() {
    const grid = document.querySelector('.grid-background');
    if (!grid) return;

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        grid.style.setProperty('--mouse-x', `${x}px`);
        grid.style.setProperty('--mouse-y', `${y}px`);
    });
}

// ============================================
// FAQ ACCORDION
// ============================================

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================

function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Elements to animate
    const animatedElements = document.querySelectorAll(
        '.feature-card, .benefits-box, .pricing-card, .faq-item, .telegram-mockup, .join-whop-card'
    );
    
    animatedElements.forEach((el, index) => {
        // Add stagger delay
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// This duplicate header scroll effect has been removed - using initHeaderScroll() instead

// ============================================
// TYPING ANIMATION FOR SIGNALS (optional enhancement)
// ============================================

function typeSignal(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ============================================
// BUTTON RIPPLE EFFECT
// ============================================

document.querySelectorAll('.btn-primary, .btn-demo, .btn-whop').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            width: 100px;
            height: 100px;
            left: ${x - 50}px;
            top: ${y - 50}px;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// PARALLAX EFFECT FOR HERO (subtle)
// ============================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero && scrolled < window.innerHeight) {
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
        }
    }
});

// ============================================
// COUNTER ANIMATION (for statistics if added later)
// ============================================

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// ============================================
// INTERSECTION OBSERVER FOR LAZY LOADING
// ============================================

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

console.log('🚀 Freya Trades loaded successfully!');

// ============================================
// MODAL FUNCTIONALITY
// ============================================

function initModal() {
    const modal = document.getElementById('platform-modal');
    if (!modal) return;
    
    const triggerButtons = document.querySelectorAll('.js-open-modal');
    const closeBtn = document.querySelector('.modal-close');
    
    // Function to open modal
    const openModal = (e) => {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Track modal open (additional tracking in initAnalyticsTracking handles button clicks)
        trackEvent('modal_opened', {
            trigger: e.target.textContent?.trim() || 'unknown'
        });
    };

    // Function to close modal
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    triggerButtons.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Esc key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Also close if clicking on the actual platform buttons (optional, but good UX if they open in new tab)
    const platformBtns = modal.querySelectorAll('.platform-btn');
    platformBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Small delay to allow visual feedback before closing
            setTimeout(closeModal, 100);
        });
    });
}

// ============================================
// CHAT PREVIEW INTERACTIVITY
// ============================================

function initChatPreview() {
    const channelItems = document.querySelectorAll('.channel-item');
    const chatViews = document.querySelectorAll('.chat-view');

    channelItems.forEach(item => {
        item.addEventListener('click', () => {
            // 1. Remove active class from all items
            channelItems.forEach(i => i.classList.remove('active'));
            
            // 2. Add active class to clicked item
            item.classList.add('active');
            
            // 3. Get target view ID
            const targetId = item.getAttribute('data-target');
            
            // 4. Hide all views
            chatViews.forEach(view => {
                view.classList.remove('active-view');
            });
            
            // 5. Show target view
            const targetView = document.getElementById(targetId);
            if (targetView) {
                targetView.classList.add('active-view');
                
                // Add fade-in animation effect
                targetView.style.opacity = '0';
                targetView.style.transform = 'translateY(10px)';
                
                requestAnimationFrame(() => {
                    targetView.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    targetView.style.opacity = '1';
                    targetView.style.transform = 'translateY(0)';
                });

                // Scroll to bottom logic
                const messagesArea = targetView.querySelector('.chat-messages-area');
                if (messagesArea) {
                     // Use setTimeout to ensure the view is rendered and height is calculated
                    setTimeout(() => {
                        messagesArea.scrollTop = messagesArea.scrollHeight;
                    }, 50);
                }
            }
        });
    });
}

// ============================================
// GALLERY SCROLL FUNCTIONALITY
// ============================================

function initGalleryScroll() {
    const galleryGrid = document.querySelector('.gallery-grid');
    const prevBtn = document.querySelector('.scroll-arrow.prev');
    const nextBtn = document.querySelector('.scroll-arrow.next');

    // These might only exist on mobile or if HTML is present
    if (!galleryGrid || !prevBtn || !nextBtn) return;

    // Scroll amount (card width + gap which is approx 300-350 on mobile)
    const scrollAmount = 320; 

    prevBtn.addEventListener('click', () => {
        galleryGrid.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });

    nextBtn.addEventListener('click', () => {
        galleryGrid.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initGalleryScroll();
    initModal();
    initChatPreview();
    
    // Auto-scroll Results Preview
    const resultsPreview = document.getElementById('resultsLivePreview');
    if (resultsPreview) {
        setTimeout(() => {
            resultsPreview.scrollTop = resultsPreview.scrollHeight;
        }, 100);
    }
    
    // Auto-scroll Gallery on Mobile
    initMobileGalleryAutoScroll();
});

// ============================================
// MOBILE GALLERY AUTO-SCROLL (CAROUSEL)
// ============================================

function initMobileGalleryAutoScroll() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;
    
    // Only run on mobile (screen width <= 768px)
    const isMobile = () => window.innerWidth <= 768;
    
    if (!isMobile()) return;
    
    const panels = galleryGrid.querySelectorAll('.mobile-mockup');
    if (panels.length < 2) return;
    
    let currentPanel = 0;
    let autoScrollTimeout;
    let hasCompletedOneCycle = false;
    let userInteracted = false;
    
    function scrollToPanel(index) {
        if (hasCompletedOneCycle || userInteracted) return;
        
        const panel = panels[index];
        if (panel) {
            const panelLeft = panel.offsetLeft;
            const containerLeft = galleryGrid.offsetLeft;
            const scrollPosition = panelLeft - containerLeft;
            
            galleryGrid.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
        }
    }
    
    function scrollToNextPanel() {
        if (!isMobile() || hasCompletedOneCycle || userInteracted) {
            return;
        }
        
        currentPanel++;
        
        if (currentPanel >= panels.length) {
            // One cycle completed
            hasCompletedOneCycle = true;
            return;
        }
        
        scrollToPanel(currentPanel);
        
        // Schedule next scroll with 2 second delay (brief pause between panels)
        autoScrollTimeout = setTimeout(scrollToNextPanel, 2000);
    }
    
    // Start after a short delay to let the page load
    setTimeout(() => {
        if (isMobile()) {
            // Start scrolling to panel 1 after 2 seconds
            autoScrollTimeout = setTimeout(scrollToNextPanel, 2000);
        }
    }, 1000);
    
    // Stop auto-scroll if user manually scrolls
    galleryGrid.addEventListener('touchstart', () => {
        userInteracted = true;
        if (autoScrollTimeout) {
            clearTimeout(autoScrollTimeout);
        }
    });
}

