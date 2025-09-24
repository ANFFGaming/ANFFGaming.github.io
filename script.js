// Modern YouthFund Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Prevent scrolling during loading
    document.body.classList.add('loading', 'no-scroll');
    
    // Transforming Icon Loading Screen
    const loadingScreen = document.querySelector('.loading-screen');
    const icons = document.querySelectorAll('.opportunity-icon .icon');
    const progressDots = document.querySelectorAll('.progress-dot');
    const loadingSubtitle = document.querySelector('.loading-subtitle');
    
    let currentIconIndex = 0;
    let animationInterval;
    
    const iconMessages = [
        "Starting your journey...",
        "Discovering travel opportunities...",
        "Finding funding programs...", 
        "Exploring education paths...",
        "Building community connections...",
        "Ready to explore!"
    ];

    function animateToNextIcon() {
        // Remove active class from current icon
        if (icons[currentIconIndex]) {
            icons[currentIconIndex].classList.remove('active');
            icons[currentIconIndex].classList.add('leaving');
        }
        
        // Remove active class from current progress dot
        if (progressDots[currentIconIndex]) {
            progressDots[currentIconIndex].classList.remove('active');
        }
        
        // Move to next icon
        currentIconIndex++;
        
        setTimeout(() => {
            // Remove leaving class from previous icon
            if (icons[currentIconIndex - 1]) {
                icons[currentIconIndex - 1].classList.remove('leaving');
            }
            
            // Activate next icon if it exists
            if (currentIconIndex < icons.length && icons[currentIconIndex]) {
                icons[currentIconIndex].classList.add('entering');
                
                setTimeout(() => {
                    icons[currentIconIndex].classList.remove('entering');
                    icons[currentIconIndex].classList.add('active');
                }, 200);
                
                // Update progress dot
                if (progressDots[currentIconIndex]) {
                    progressDots[currentIconIndex].classList.add('active');
                }
                
                // Update subtitle message
                if (loadingSubtitle && iconMessages[currentIconIndex]) {
                    loadingSubtitle.textContent = iconMessages[currentIconIndex];
                }
            }
        }, 300);
    }

    // Start icon animation cycle
    function startIconAnimation() {
        // Initial setup
        if (loadingSubtitle) {
            loadingSubtitle.textContent = iconMessages[0];
        }
        
        // Animate through icons
        animationInterval = setInterval(() => {
            if (currentIconIndex < icons.length - 1) {
                animateToNextIcon();
            } else {
                // Animation complete, stop interval
                clearInterval(animationInterval);
                
                // Final message
                setTimeout(() => {
                    if (loadingSubtitle) {
                        loadingSubtitle.textContent = "Welcome to YouthFund!";
                    }
                }, 500);
            }
        }, 1200); // Change icon every 1.2 seconds
    }

    // Start animations after a brief delay
    setTimeout(startIconAnimation, 800);
    
    // Hide loading screen after animations complete
    window.addEventListener('load', function() {
        setTimeout(() => {
            if (animationInterval) {
                clearInterval(animationInterval);
            }
            
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                document.body.classList.remove('loading', 'no-scroll');
            }, 800);
        }, 6500); // Show loading screen for about 6.5 seconds total
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

    console.log('YouthFund website initialized with transforming opportunities! 🚀✨');
});