/**
 * Lumière Beauty Salon – script.js
 * All JavaScript interactions for the beauty salon website.
 * Includes: navbar scroll, hamburger menu, smooth scroll,
 * gallery filter, testimonials slider, form validation,
 * scroll-reveal animations, back-to-top button, newsletter.
 */

/* =========================================================
   1. DOM READY
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initHamburger();
    initSmoothScroll();
    initScrollReveal();
    initBackToTop();
    initGalleryFilter();
    initTestimonialsSlider();
    initBookingForm();
    initNewsletterForm();
    initDateMin();
});


/* =========================================================
   2. NAVBAR – Scroll effect & active link highlight
   ========================================================= */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Toggle "scrolled" class on scroll
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveLink();
    };

    // Highlight the nav link corresponding to the current viewport section
    const updateActiveLink = () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === #${ currentSection }) {
            link.classList.add('active');
        }
    });
};

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll(); // run once on load
}


/* =========================================================
   3. HAMBURGER MENU – Mobile toggle
   ========================================================= */
function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleMenu = () => {
        const isOpen = navMenu.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen.toString());
        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    const closeMenu = () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', toggleMenu);

    // Close menu on nav link click
    navLinks.forEach(link => link.addEventListener('click', closeMenu));

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMenu();
        }
    });

    // Close on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeMenu();
    });
}


/* =========================================================
   4. SMOOTH SCROLL – Anchor links
   ========================================================= */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'));
                const targetY = target.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({ top: targetY, behavior: 'smooth' });
            }
        });
    });
}


/* =========================================================
   5. SCROLL REVEAL – Intersection Observer
   ========================================================= */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation for sibling groups (e.g., service cards)
                const delay = (index % 6) * 80;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}


/* =========================================================
   6. BACK TO TOP BUTTON
   ========================================================= */
function initBackToTop() {
    const btn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


/* =========================================================
   7. GALLERY FILTER – Show/hide items by category
   ========================================================= */
function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden');
                    // Fade-in animation
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    requestAnimationFrame(() => {
                        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    });
                } else {
                    item.classList.add('hidden');
                    item.style.opacity = '';
                    item.style.transform = '';
                    item.style.transition = '';
                }
            });
        });
    });
}


/* =========================================================
   8. TESTIMONIALS SLIDER – Auto-play carousel
   ========================================================= */
function initTestimonialsSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');

    let current = 0;
    let autoPlay = null;

    const goToSlide = (index) => {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (index + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    };

    const startAutoPlay = () => {
        autoPlay = setInterval(() => goToSlide(current + 1), 5000);
    };

    const stopAutoPlay = () => {
        clearInterval(autoPlay);
    };

    const resetAutoPlay = () => {
        stopAutoPlay();
        startAutoPlay();
    };

    prevBtn.addEventListener('click', () => { goToSlide(current - 1); resetAutoPlay(); });
    nextBtn.addEventListener('click', () => { goToSlide(current + 1); resetAutoPlay(); });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.getAttribute('data-index')));
            resetAutoPlay();
        });
    });

    // Touch / swipe support
    let touchStartX = 0;
    const slider = document.getElementById('testimonialsSlider');

    slider.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 40) {
            diff > 0 ? goToSlide(current + 1) : goToSlide(current - 1);
            resetAutoPlay();
        }
    }, { passive: true });

    // Pause on hover
    const wrapper = document.querySelector('.testimonials-wrapper');
    wrapper.addEventListener('mouseenter', stopAutoPlay);
    wrapper.addEventListener('mouseleave', startAutoPlay);

    startAutoPlay();
}


/* =========================================================
   9. BOOKING FORM VALIDATION
   ========================================================= */
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMsg = document.getElementById('formSuccess');

    // ── Helpers ──────────────────────────────────────────────
    const getField = (id) => document.getElementById(id);
    const getError = (id) => document.getElementById(id + 'Error');

    const showError = (fieldId, message) => {
        const field = getField(fieldId);
        const err = getError(fieldId);
        field.classList.add('error');
        if (err) err.textContent = message;
    };

    const clearError = (fieldId) => {
        const field = getField(fieldId);
        const err = getError(fieldId);
        field.classList.remove('error');
        if (err) err.textContent = '';
    };

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidPhone = (phone) => /^[\+\d\s\-\(\)]{7,15}$/.test(phone.trim());

    // ── Clear errors on input ─────────────────────────────────
    ['fullName', 'email', 'phone', 'service', 'appointmentDate'].forEach(id => {
        const field = getField(id);
        if (field) {
            field.addEventListener('input', () => clearError(id));
            field.addEventListener('change', () => clearError(id));
        }
    });

    // ── Form Submission ───────────────────────────────────────
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;

        // Full Name
        const name = getField('fullName').value.trim();
        if (!name) {
            showError('fullName', 'Please enter your full name.');
            isValid = false;
        } else if (name.length < 2) {
            showError('fullName', 'Name must be at least 2 characters.');
            isValid = false;
        } else {
            clearError('fullName');
        }

        // Email
        const email = getField('email').value.trim();
        if (!email) {
            showError('email', 'Please enter your email address.');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email', 'Please enter a valid email address.');
            isValid = false;
        } else {
            clearError('email');
        }

        // Phone
        const phone = getField('phone').value.trim();
        if (!phone) {
            showError('phone', 'Please enter your phone number.');
            isValid = false;
        } else if (!isValidPhone(phone)) {
            showError('phone', 'Please enter a valid phone number.');
            isValid = false;
        } else {
            clearError('phone');
        }

        // Service
        const service = getField('service').value;
        if (!service) {
            showError('service', 'Please select a service.');
            isValid = false;
        } else {
            clearError('service');
        }

        // Date
        const date = getField('appointmentDate').value;
        if (!date) {
            showError('appointmentDate', 'Please pick a preferred date.');
            isValid = false;
        } else {
            const selected = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selected < today) {
                showError('appointmentDate', 'Please choose a future date.');
                isValid = false;
            } else {
                clearError('appointmentDate');
            }
        }

        if (!isValid) return;

        // ── Simulate form submission ──────────────────────────
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

        setTimeout(() => {
            form.querySelectorAll('.form-row, .form-group, .btn-submit').forEach(el => {
                el.style.display = 'none';
            });
            successMsg.classList.add('visible');
        }, 1500);
    });
}


/* =========================================================
   10. DATE MIN – Prevent past date selection
   ========================================================= */
function initDateMin() {
    const dateInput = document.getElementById('appointmentDate');
    if (!dateInput) return;
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
}


/* =========================================================
   11. NEWSLETTER FORM
   ========================================================= */
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    const input = document.getElementById('newsletterEmail');
    const success = document.getElementById('newsletterSuccess');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = input.value.trim();
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!isValid) {
            input.style.borderColor = '#e74c3c';
            input.focus();
            return;
        }

        input.style.borderColor = '';
        input.value = '';
        success.classList.add('visible');

        setTimeout(() => success.classList.remove('visible'), 4000);