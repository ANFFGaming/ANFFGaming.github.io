// Modern YouthFund Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Prevent scrolling during loading
    document.body.classList.add('loading', 'no-scroll');
    
    // Enhanced Loading Screen with Fund Flow Animation
    const loadingScreen = document.querySelector('.loading-screen');
    const youthFigure = document.querySelector('.youth-figure');
    const opportunityIcons = document.querySelectorAll('.opportunity-icon');
    
    // Add light-up effect when icons reach the youth figure
    if (youthFigure && opportunityIcons.length > 0) {
        opportunityIcons.forEach((icon, index) => {
            setTimeout(() => {
                // Create light-up effect
                const lightUpEffect = () => {
                    youthFigure.style.boxShadow = '0 0 40px rgba(255, 255, 255, 0.9)';
                    youthFigure.style.transform = 'translateY(-50%) scale(1.2)';
                    
                    setTimeout(() => {
                        youthFigure.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.3)';
                        youthFigure.style.transform = 'translateY(-50%) scale(1)';
                    }, 200);
                };
                
                // Trigger light-up effect when each icon "arrives"
                setInterval(() => {
                    setTimeout(lightUpEffect, 3800); // Just before icon reaches destination
                }, 4000); // Match the icon animation duration
                
            }, index * 500); // Stagger the start times
        });
    }
    
    // Dynamic stat counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    const animateStats = () => {
        statNumbers.forEach((stat, index) => {
            const finalValue = stat.textContent;
            let currentValue = 0;
            const increment = finalValue.includes('€') ? 5000000 : finalValue.includes('K') ? 100 : 50;
            const maxValue = finalValue.includes('€') ? 50000000 : finalValue.includes('K') ? 25000 : 1000;
            
            const counter = setInterval(() => {
                currentValue += increment;
                if (currentValue >= maxValue) {
                    currentValue = maxValue;
                    clearInterval(counter);
                }
                
                if (finalValue.includes('€')) {
                    stat.textContent = `€${(currentValue / 1000000).toFixed(0)}M+`;
                } else if (finalValue.includes('K')) {
                    stat.textContent = `${(currentValue / 1000).toFixed(0)}K+`;
                } else {
                    stat.textContent = `${currentValue}+`;
                }
            }, 50);
        });
    };
    
    // Start stat animation after a brief delay
    setTimeout(animateStats, 500);
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                document.body.classList.remove('loading', 'no-scroll');
            }, 800);
        }, 2500); // Show for 2.5 seconds to appreciate the animation
    });

    // Smart header scroll animation
    const header = document.querySelector('.header');
    let lastScrollY = 0;
    let ticking = false;

    function updateHeader() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide header when scrolling down, show when scrolling up
        if (scrollY > 200) { // Only start hiding after scrolling past 200px
            if (scrollY > lastScrollY && scrollY > 300) {
                // Scrolling down - hide header
                header.classList.add('hide');
                header.classList.remove('show');
            } else if (scrollY < lastScrollY) {
                // Scrolling up - show header
                header.classList.remove('hide');
                header.classList.add('show');
            }
        } else {
            // Near top - always show header
            header.classList.remove('hide');
            header.classList.add('show');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    function requestHeaderUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestHeaderUpdate, { passive: true });

    // Scroll animations
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

    // Mobile Navigation
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = navMenu.classList.contains('active');
            
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent scrolling when menu is open
            if (!isActive) {
                document.body.classList.add('menu-open');
            } else {
                document.body.classList.remove('menu-open');
            }
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active') && 
            navToggle && !navToggle.contains(e.target) && 
            !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (navToggle) navToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            if (href && href !== '#') {
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = header ? header.offsetHeight : 75;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    console.log('YouthFund website initialized successfully! 🚀');
});