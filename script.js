// Modern YouthFund Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;

    // Toggle mobile menu
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle active classes
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            console.log('Menu toggled:', navMenu.classList.contains('active'));
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu?.classList.remove('active');
            navToggle?.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu?.classList.contains('active') && 
            !navToggle?.contains(e.target) && 
            !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle?.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle?.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });

    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            // Skip if href is just "#" or empty
            if (!href || href === '#') {
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = header?.offsetHeight || 75;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observe elements for animations
    const animatedElements = document.querySelectorAll('.program-card, .feature-item, .resource-card, .hero-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });

    // Staggered animations for cards
    const cardGroups = {
        '.hero-card': 0.1,
        '.program-card': 0.2,
        '.feature-item': 0.15,
        '.resource-card': 0.1
    };

    Object.entries(cardGroups).forEach(([selector, delay]) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((el, index) => {
            el.style.transitionDelay = `${index * delay}s`;
        });
    });

    // Enhanced button interactions
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Parallax effect for hero section (subtle)
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.05;
            heroVisual.style.transform = `translateY(${rate}px)`;
        });
    }

    // Dynamic year in footer
    const currentYear = new Date().getFullYear();
    const copyrightElement = document.querySelector('.footer-bottom p');
    if (copyrightElement) {
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace('2025', currentYear);
    }

    // Performance optimization for scroll events
    let ticking = false;
    
    function updateOnScroll() {
        const scrolled = window.pageYOffset;
        
        // Update header state
        if (scrolled > 100) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
        
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }

    // Debounced scroll handler
    window.addEventListener('scroll', requestTick, { passive: true });

    // Loading state for external links
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            this.classList.add('loading');
            this.style.pointerEvents = 'none';
            
            setTimeout(() => {
                this.classList.remove('loading');
                this.style.pointerEvents = 'auto';
            }, 3000);
        });
    });

    console.log('YouthFund website initialized successfully! 🚀');
});

// Add custom CSS for JavaScript enhancements
const style = document.createElement('style');
style.textContent = `
    /* Prevent body scroll when menu is open */
    body.menu-open {
        overflow: hidden;
    }

    /* Enhanced header scroll state */
    .header.scrolled {
        background: rgba(255, 255, 255, 0.98) !important;
        box-shadow: 0 4px 30px rgba(99, 102, 241, 0.1) !important;
        backdrop-filter: blur(20px) !important;
    }

    /* Ripple animation for buttons */
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }

    /* Loading state for buttons */
    .btn.loading {
        position: relative;
        color: transparent !important;
    }

    .btn.loading::after {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        top: 50%;
        left: 50%;
        margin-left: -10px;
        margin-top: -10px;
        border: 2px solid currentColor;
        border-radius: 50%;
        border-right-color: transparent;
        animation: spin 1s linear infinite;
    }

    .btn-primary.loading::after {
        border-color: white;
        border-right-color: transparent;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    /* Smooth transitions for all interactive elements */
    .hero-card,
    .program-card,
    .feature-item,
    .resource-card,
    .social-link {
        will-change: transform;
    }

    /* Enhanced focus styles for better accessibility */
    *:focus-visible {
        outline: 2px solid rgba(99, 102, 241, 0.6) !important;
        outline-offset: 2px !important;
        border-radius: 4px;
    }

    /* Remove default focus outline for mouse clicks and remove tap highlights */
    * {
        -webkit-tap-highlight-color: transparent !important;
        -webkit-touch-callout: none;
    }
    
    *:focus:not(:focus-visible) {
        outline: none !important;
    }

    /* Mobile menu overlay */
    @media (max-width: 768px) {
        .nav-menu::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.5);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: -1;
        }

        .nav-menu.active::before {
            opacity: 1;
            visibility: visible;
        }
    }
`;
document.head.appendChild(style);