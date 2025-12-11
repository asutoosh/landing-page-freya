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
});

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

