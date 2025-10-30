document.addEventListener('DOMContentLoaded', () => {

    const loader = document.getElementById('page-loader');
    const courseQuickBar = document.getElementById('course-quick-bar-links');

    // --- Page Loader Logic ---
    if (loader) {
        // Hide loader on page load
        loader.style.opacity = '0';
        setTimeout(() => { loader.style.display = 'none'; }, 300);

        // Show loader on link clicks
        document.querySelectorAll('a[href]:not([href^="#"])').forEach(link => {
            link.addEventListener('click', (e) => {
                // Check if the link is to an external site or a different target
                if (link.hostname !== window.location.hostname || link.target === '_blank') {
                    return; // Don't prevent default for external links
                }
                e.preventDefault();
                const href = link.getAttribute('href');
                loader.style.display = 'flex';
                setTimeout(() => { loader.style.opacity = '1'; }, 10);
                setTimeout(() => { window.location = href; }, 400); // Wait for transition
            });
        });
    }

    // --- Hero Slider Logic ---
    let slideIndex = 0;
    const slides = document.querySelectorAll('.slide-item');
    const dots = document.querySelectorAll('.dot');
    
    function showSlide(n) {
        if (slides.length === 0) return; // Don't run if no slider
        slideIndex = (n + slides.length) % slides.length; // Loop around
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        slides[slideIndex].classList.add('active');
        dots[slideIndex].classList.add('active');
    }

    function autoSlide() {
        showSlide(slideIndex + 1);
    }
    
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
    
    // ===========================================
    // --- Data Fetching & Main App Logic ---
    // ===========================================

    const API_URL = 'https://college-finder-api.onrender.com/api/public';
    const BASE_URL = 'https://college-finder-api.onrender.com';
    
    // --- Element Selectors ---
    const coursesContainer = document.getElementById('courses-container');
    const citiesContainer = document.getElementById('cities-container');
    const collegesTableBody = document.getElementById('colleges-table-body');
    
    const filterCourse = document.getElementById('filter-course');
    const filterCity = document.getElementById('filter-city');
    const filterRank = document.getElementById('filter-rank');
    
    // --- Data Fetching Functions ---

    // Fetch and display all courses
    async function fetchCourses() {
        // Check if elements exist on this page (prevents errors on detail pages)
        if (!coursesContainer || !filterCourse || !courseQuickBar) return; 

        try {
            const res = await fetch(`${API_URL}/courses`);
            const courses = await res.json();
            
            // --- FIX: Moved all "clear" lines to the top ---
            coursesContainer.innerHTML = ''; // Clear card container
            filterCourse.innerHTML = '<option value="">Filter by Course</option>'; // Reset filter
            courseQuickBar.innerHTML = ''; // Clear "Loading..." from quick bar
            // --- END OF FIX ---
            
            courses.forEach(course => {
                // Add to course section
                const courseCard = document.createElement('div');
                courseCard.className = 'card';
                courseCard.dataset.id = course._id;
                courseCard.innerHTML = `
                    <div class="card-content">
                        <h3>${course.name}</h3>
                        <p>Average Fees: ${course.avgFees}</p>
                        <p>${course.collegeCount} Colleges</p>
                       <a href="course.html?id=${course._id}" class="btn">View More</a>
                    </div>
                `;
                coursesContainer.appendChild(courseCard);

                // Add to filter dropdown
                const option = document.createElement('option');
                option.value = course._id;
                option.textContent = course.name;
                filterCourse.appendChild(option);

                // Add the same course to the quick bar
                const quickLink = document.createElement('a');
                quickLink.href = `course.html?id=${course._id}`;
                quickLink.className = 'quick-link';
                quickLink.textContent = course.name;
                courseQuickBar.appendChild(quickLink);
            });
            
            // --- FIX: Removed the 3 error lines from here ---

        }  catch (err) {
            console.error('Error fetching courses:', err);
            coursesContainer.innerHTML = '<p>Error loading courses.</p>';
            courseQuickBar.innerHTML = '<span class="quick-link-loading">Error loading courses.</span>';
        }
    }

    // Fetch and display all cities
    async function fetchCities() {
        // Check if elements exist on this page
        if (!citiesContainer || !filterCity) return; 

        try {
            const res = await fetch(`${API_URL}/cities`);
            const cities = await res.json();
            
            citiesContainer.innerHTML = ''; // Clear loader
            filterCity.innerHTML = '<option value="">Filter by City</option>'; // Reset filter

            cities.forEach(city => {
                // Add to city section
                const cityCard = document.createElement('div');
                cityCard.className = 'card';
                cityCard.dataset.id = city._id;
                const imageUrl = city.imageUrl ? `${BASE_URL}/${city.imageUrl.replace(/\\/g, '/')}` : 'https://via.placeholder.com/300x200?text=City';
                
                cityCard.innerHTML = `
                    <div class="card-image">
                        <img src="${imageUrl}" alt="${city.name}">
                    </div>
                    <div class="card-content">
                        <h3>${city.name}</h3>
                        <p>${city.collegeCount} Colleges</p>
                        <a href="city.html?id=${city._id}" class="btn">View More</a>
                    </div>
                `;
                citiesContainer.appendChild(cityCard);

                // Add to filter dropdown
                const option = document.createElement('option');
                option.value = city._id;
                option.textContent = city.name;
                filterCity.appendChild(option);
            });
        } catch (err) {
            console.error('Error fetching cities:', err);
            citiesContainer.innerHTML = '<p>Error loading cities.</p>';
        }
    }

    // Fetch and display colleges in the table
    async function fetchColleges(courseId = '', cityId = '', rankSort = '') {
        // Check if element exists on this page
        if (!collegesTableBody) return; 
        
        try {
            let query = new URLSearchParams();
            if (courseId) query.append('course', courseId);
            if (cityId) query.append('city', cityId);
            if (rankSort) query.append('rank', rankSort);

            const res = await fetch(`${API_URL}/colleges?${query.toString()}`);
            const colleges = await res.json();
            
            collegesTableBody.innerHTML = ''; // Clear table
            if (colleges.length === 0) {
                collegesTableBody.innerHTML = '<tr><td colspan="5">No colleges found matching your criteria.</td></tr>';
                return;
            }

            colleges.forEach(college => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${college.rank}</td>
                    <td><a href="college.html?id=${college._id}" class="table-link">${college.name}</a></td>
                    <td>${college.city.name}</td>
                    <td>${college.courses.map(c => c.name).join(', ')}</td>
                    <td>$${college.fees.toLocaleString()}</td>
                `;
                collegesTableBody.appendChild(row);
            });
        } catch (err) {
            console.error('Error fetching colleges:', err);
            collegesTableBody.innerHTML = '<tr><td colspan="5">Error loading colleges.</td></tr>';
        }
    }
    
    // --- Event Listeners ---
    // Added checks to prevent errors on other pages
    if (filterCourse) {
        filterCourse.addEventListener('change', () => fetchColleges(filterCourse.value, filterCity.value, filterRank.value));
    }
    if (filterCity) {
        filterCity.addEventListener('change', () => fetchColleges(filterCourse.value, filterCity.value, filterRank.value));
    }
    if (filterRank) {
        filterRank.addEventListener('change', () => fetchColleges(filterCourse.value, filterCity.value, filterRank.value));
    }

    // --- Initial Page Load ---
    function init() {
        fetchCourses();
        fetchCities();
        fetchColleges(); // Load all colleges initially
    }

    init(); // Run the app
});

// --- ADD THIS ENTIRE BLOCK to the top of all 4 JS files ---

    // --- Quick Bar Scroller Logic ---
    const scrollContainer = document.getElementById('course-quick-bar-links');
    const scrollLeftBtn = document.getElementById('scroll-left');
    const scrollRightBtn = document.getElementById('scroll-right');

    function checkScroll() {
        if (!scrollContainer) return; // Failsafe

        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        
        // Hide/Show Left Arrow
        if (scrollContainer.scrollLeft > 0) {
            scrollLeftBtn.classList.remove('is-hidden');
        } else {
            scrollLeftBtn.classList.add('is-hidden');
        }
        
        // Hide/Show Right Arrow
        // Use a 1px buffer for precision
        if (scrollContainer.scrollLeft < maxScroll - 1) {
            scrollRightBtn.classList.remove('is-hidden');
        } else {
            scrollRightBtn.classList.add('is-hidden');
        }
    }

    if (scrollContainer) {
        // Add click events for arrows
        scrollLeftBtn.addEventListener('click', () => {
            scrollContainer.scrollLeft -= 200; // Scroll left by 200px
        });
        
        scrollRightBtn.addEventListener('click', () => {
            scrollContainer.scrollLeft += 200; // Scroll right by 200px
        });

        // Listen for scrolling to check arrows
        scrollContainer.addEventListener('scroll', checkScroll);
        
        // Listen for window resize to check arrows
        window.addEventListener('resize', checkScroll);

        // Check scroll on initial load (after a delay for content to load)
        setTimeout(checkScroll, 500);

        // Use a MutationObserver to re-check when links are added
        const observer = new MutationObserver(() => {
            checkScroll();
            // We can disconnect after the first time to save performance
            observer.disconnect(); 
        });
        
        // Watch for new child elements (the links) being added
        observer.observe(scrollContainer, { childList: true });
    }

// --- END OF NEW BLOCK ---

// ... (your existing code for that file continues below)
// const loader = document.getElementById('page-loader');
// ...