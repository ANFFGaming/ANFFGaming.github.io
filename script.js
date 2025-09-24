// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Animate hamburger menu
        const hamburger = document.querySelector('.hamburger');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.querySelector('.hamburger').classList.remove('active');
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animations
    const animatedElements = document.querySelectorAll('.program-card, .feature-item, .resource-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add loading animation to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Only add loading state for actual form submissions or external links
            if (this.href && !this.href.includes('#')) {
                this.style.pointerEvents = 'none';
                this.style.opacity = '0.7';
                
                setTimeout(() => {
                    this.style.pointerEvents = 'auto';
                    this.style.opacity = '1';
                }, 2000);
            }
        });
    });

    // Add hover effects to cards
    const cards = document.querySelectorAll('.hero-card, .program-card, .feature-item, .resource-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-visual');
        const speed = 0.1;
        
        parallaxElements.forEach(element => {
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });

    // Dynamic copyright year
    const currentYear = new Date().getFullYear();
    const copyrightElement = document.querySelector('.footer-bottom p');
    if (copyrightElement) {
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace('2024', currentYear);
    }

    // Add focus management for accessibility
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #2563eb';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });

    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape') {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.querySelector('.hamburger').classList.remove('active');
        }
    });

    // Performance optimization: Debounced scroll handler
    let ticking = false;
    
    function updateScrollElements() {
        const scrolled = window.pageYOffset;
        
        // Update header
        const header = document.querySelector('.header');
        if (scrolled > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollElements);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick);
});

// Add CSS classes for JavaScript interactions
const style = document.createElement('style');
style.textContent = `
    /* Mobile menu styles */
    @media (max-width: 768px) {
        .nav-menu {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: white;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            padding: 1rem 0;
        }
        
        .nav-menu.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .nav-menu {
            flex-direction: column;
            gap: 0;
        }
        
        .nav-item {
            padding: 0.75rem 1.5rem;
        }
        
        .nav-link::after {
            display: none;
        }
        
        /* Hamburger animation */
        .nav-toggle.active .hamburger {
            background-color: transparent;
        }
        
        .nav-toggle.active .hamburger::before {
            transform: translateY(6px) rotate(45deg);
        }
        
        .nav-toggle.active .hamburger::after {
            transform: translateY(-6px) rotate(-45deg);
        }
        
        .hamburger::before,
        .hamburger::after {
            content: '';
            position: absolute;
            width: 25px;
            height: 3px;
            background-color: #475569;
            transition: all 0.3s ease;
        }
        
        .hamburger::before {
            top: -6px;
        }
        
        .hamburger::after {
            bottom: -6px;
        }
    }
    
    /* Header scroll effect */
    .header.scrolled {
        background: rgba(255, 255, 255, 0.98) !important;
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1) !important;
    }
    
    /* Loading button state */
    .btn.loading {
        pointer-events: none;
        opacity: 0.7;
        position: relative;
    }
    
    .btn.loading::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        margin: auto;
        border: 2px solid transparent;
        border-top-color: currentColor;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);