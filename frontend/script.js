// --- ADD THIS CODE to the top of your script.js ---
document.addEventListener('DOMContentLoaded', () => {

    const loader = document.getElementById('page-loader');

    // --- Page Loader Logic ---
    // Hide loader on page load
    loader.style.opacity = '0';
    setTimeout(() => { loader.style.display = 'none'; }, 300);

    // Show loader on link clicks
    document.querySelectorAll('a[href]:not([href^="#"])').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            loader.style.display = 'flex';
            setTimeout(() => { loader.style.opacity = '1'; }, 10);
            setTimeout(() => { window.location = href; }, 400); // Wait for transition
        });
    });

    // --- Hero Slider Logic ---
    let slideIndex = 0;
    const slides = document.querySelectorAll('.slide-item');
    const dots = document.querySelectorAll('.dot');
    
    function showSlide(n) {
        slideIndex = (n + slides.length) % slides.length; // Loop around
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        slides[slideIndex].classList.add('active');
        dots[slideIndex].classList.add('active');
    }

    function autoSlide() {
        showSlide(slideIndex + 1);
    }
    
    // Check if slider exists on this page
    if (slides.length > 0) {
        showSlide(0); // Show first slide
        let slideInterval = setInterval(autoSlide, 5000); // Change slide every 5 seconds
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                clearInterval(slideInterval); // Reset timer on manual click
                slideInterval = setInterval(autoSlide, 5000);
            });
        });
    }

    // --- Navbar Toggle Logic ---
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('is-active');
        });
    }

    // --- Animate on Scroll Logic ---
    // (This replaces your old 'aboutSection' observer)
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(section => {
        scrollObserver.observe(section);
    });

    // ... (Your existing code: const API_URL, const BASE_URL, fetchCourses, fetchCities, fetchColleges, etc.) ...
    // ...
    // --- Initial Page Load --- (This part is at the very bottom)
    function init() {
        fetchCourses();
        fetchCities();
        fetchColleges(); // Load all colleges initially
    }
    init();
});