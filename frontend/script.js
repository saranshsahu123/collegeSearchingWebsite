document.addEventListener('DOMContentLoaded', () => {

    // --- SELECTORS ---
    const loader = document.getElementById('page-loader');
    const courseQuickBar = document.getElementById('course-quick-bar-links');
    const reviewForm = document.getElementById('review-form');
    const reviewList = document.getElementById('review-list');
    const reviewMessage = document.getElementById('review-message');
    const coursesContainer = document.getElementById('courses-container');
    const citiesContainer = document.getElementById('cities-container');
    const collegesTableBody = document.getElementById('colleges-table-body');
    const filterCourse = document.getElementById('filter-course');
    const filterCity = document.getElementById('filter-city');
    const filterRank = document.getElementById('filter-rank');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // --- API URLS ---
    const API_URL = 'https://college-finder-api.onrender.com/api/public';
    const BASE_URL = 'https://college-finder-api.onrender.com';

    // --- Page Loader Logic ---
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => { loader.style.display = 'none'; }, 300);

        document.querySelectorAll('a[href]:not([href^="#"])').forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.hostname !== window.location.hostname || link.target === '_blank') {
                    return;
                }
                e.preventDefault();
                const href = link.getAttribute('href');
                loader.style.display = 'flex';
                setTimeout(() => { loader.style.opacity = '1'; }, 10);
                setTimeout(() => { window.location = href; }, 400);
            });
        });
    }

    // --- Hero Slider Logic ---
    let slideIndex = 0;
    const slides = document.querySelectorAll('.slide-item');
    const dots = document.querySelectorAll('.dot');
    
    function showSlide(n) {
        if (slides.length === 0) return;
        slideIndex = (n + slides.length) % slides.length;
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        slides[slideIndex].classList.add('active');
        dots[slideIndex].classList.add('active');
    }

    function autoSlide() {
        showSlide(slideIndex + 1);
    }
    
    if (slides.length > 0) {
        showSlide(0);
        let slideInterval = setInterval(autoSlide, 5000);
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
                clearInterval(slideInterval);
                slideInterval = setInterval(autoSlide, 5000);
            });
        });
    }

    // --- Navbar Toggle Logic ---
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

    // --- Quick Bar Scroller Logic ---
    const scrollContainer = document.getElementById('course-quick-bar-links');
    const scrollLeftBtn = document.getElementById('scroll-left');
    const scrollRightBtn = document.getElementById('scroll-right');
    let autoScrollInterval = null;

    function startAutoScroll() {
        if (!scrollContainer) return; // Failsafe
        if (autoScrollInterval) return; // Already running
        autoScrollInterval = setInterval(() => {
            if (scrollContainer.scrollLeft < (scrollContainer.scrollWidth - scrollContainer.clientWidth)) {
                scrollContainer.scrollLeft += 1; // Scroll 1px
            } else {
                scrollContainer.scrollLeft = 0; // Reset to beginning
            }
        }, 50); // Adjust scroll speed
    }

    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
    }

    function checkScroll() {
        if (!scrollContainer) return; 

        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        
        // Hide/Show Left Arrow
        if (scrollContainer.scrollLeft > 0) {
            scrollLeftBtn.classList.remove('is-hidden');
        } else {
            scrollLeftBtn.classList.add('is-hidden');
        }
        
        // Hide/Show Right Arrow
        if (scrollContainer.scrollLeft < maxScroll - 1) {
            scrollRightBtn.classList.remove('is-hidden');
        } else {
            scrollRightBtn.classList.add('is-hidden');
        }
    }

    if (scrollContainer) {
        scrollLeftBtn.addEventListener('click', () => {
            scrollContainer.scrollLeft -= 200; 
            stopAutoScroll(); 
        });
        
        scrollRightBtn.addEventListener('click', () => {
            scrollContainer.scrollLeft += 200;
            stopAutoScroll(); 
        });

        scrollContainer.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);

        scrollContainer.addEventListener('mouseenter', stopAutoScroll);
        scrollContainer.addEventListener('mouseleave', startAutoScroll);

        const observer = new MutationObserver(() => {
            checkScroll();
            // Disconnect after first run to save performance
            observer.disconnect();
        });
        
        observer.observe(scrollContainer, { childList: true });

        setTimeout(() => {
            checkScroll();
            startAutoScroll(); // Start scrolling on load
        }, 1000); // Wait for content to load
    }
    
    // --- Card Scroller Logic ---
    document.querySelectorAll('.card-scroll-wrapper').forEach(wrapper => {
        const scrollContainer = wrapper.querySelector('.card-container');
        const scrollLeftBtn = wrapper.querySelector('.card-scroll-left');
        const scrollRightBtn = wrapper.querySelector('.card-scroll-right');

        if (!scrollContainer || !scrollLeftBtn || !scrollRightBtn) return;

        function checkCardScroll() {
            const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
            
            if (scrollContainer.scrollLeft > 0) {
                scrollLeftBtn.classList.remove('is-hidden');
            } else {
                scrollLeftBtn.classList.add('is-hidden');
            }
            
            if (scrollContainer.scrollLeft < maxScroll - 1) {
                scrollRightBtn.classList.remove('is-hidden');
            } else {
                scrollRightBtn.classList.add('is-hidden');
            }
        }

        scrollLeftBtn.addEventListener('click', () => {
            scrollContainer.scrollLeft -= 352; 
        });
        
        scrollRightBtn.addEventListener('click', () => {
            scrollContainer.scrollLeft += 352;
        });

        scrollContainer.addEventListener('scroll', checkCardScroll);
        window.addEventListener('resize', checkCardScroll);

        const observer = new MutationObserver(() => {
            checkCardScroll();
        });
        
        observer.observe(scrollContainer, { childList: true });
        setTimeout(checkCardScroll, 1000);
    });

    // ===========================================
    // --- Data Fetching & Main App Logic ---
    // ===========================================

    // Fetch and display all courses
    async function fetchCourses() {
        if (!coursesContainer || !filterCourse || !courseQuickBar) return; 

        try {
            const res = await fetch(`${API_URL}/courses`);
            const courses = await res.json();
            
            coursesContainer.innerHTML = '';
            filterCourse.innerHTML = '<option value="">Filter by Course</option>';
            courseQuickBar.innerHTML = '';
            
            courses.forEach(course => {
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

                const option = document.createElement('option');
                option.value = course._id;
                option.textContent = course.name;
                filterCourse.appendChild(option);

                const quickLink = document.createElement('a');
                quickLink.href = `course.html?id=${course._id}`;
                quickLink.className = 'quick-link';
                quickLink.textContent = course.name;
                courseQuickBar.appendChild(quickLink);
            });

        }  catch (err) {
            console.error('Error fetching courses:', err);
            if(coursesContainer) coursesContainer.innerHTML = '<p>Error loading courses.</p>';
            if(courseQuickBar) courseQuickBar.innerHTML = '<span class="quick-link-loading">Error loading courses.</span>';
        }
    }

    // Fetch and display all cities
    async function fetchCities() {
        if (!citiesContainer || !filterCity) return; 

        try {
            const res = await fetch(`${API_URL}/cities`);
            const cities = await res.json();
            
            citiesContainer.innerHTML = '';
            filterCity.innerHTML = '<option value="">Filter by City</option>';

            cities.forEach(city => {
                const cityCard = document.createElement('div');
                cityCard.className = 'card';
                cityCard.dataset.id = city._id;
                const imageUrl = city.imageUrl ? `${BASE_URL}/${city.imageUrl.replace(/\\/g, '/')}` : 'https://via.placeholder.com/300x200?text=City';
                
                cityCard.innerHTML = `
                    <div class.card-image">
                        <img src="${imageUrl}" alt="${city.name}">
                    </div>
                    <div class.card-content">
                        <h3>${city.name}</h3>
                        <p>${city.collegeCount} Colleges</p>
                        <a href="city.html?id=${city._id}" class="btn">View More</a>
                    </div>
                `;
                citiesContainer.appendChild(cityCard);

                const option = document.createElement('option');
                option.value = city._id;
                option.textContent = city.name;
                filterCity.appendChild(option);
            });
        } catch (err) {
            console.error('Error fetching cities:', err);
            if(citiesContainer) citiesContainer.innerHTML = '<p>Error loading cities.</p>';
        }
    }

    // Fetch and display colleges in the table
    async function fetchColleges(courseId = '', cityId = '', rankSort = '') {
        if (!collegesTableBody) return; 
        
        try {
            let query = new URLSearchParams();
            if (courseId) query.append('course', courseId);
            if (cityId) query.append('city', cityId);
            if (rankSort) query.append('rank', rankSort);

            const res = await fetch(`${API_URL}/colleges?${query.toString()}`);
            const colleges = await res.json();
            
            collegesTableBody.innerHTML = '';
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
            if(collegesTableBody) collegesTableBody.innerHTML = '<tr><td colspan="5">Error loading colleges.</td></tr>';
        }
    }

    // --- New Review Functions ---
    function renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<i class="${i <= rating ? 'fas' : 'far'} fa-star"></i>`;
        }
        return stars;
    }

    async function fetchReviews() {
        if (!reviewList) return; 

        try {
            const res = await fetch(`${API_URL}/reviews`);
            const reviews = await res.json();

            reviewList.innerHTML = '';
            if (reviews.length === 0) {
                reviewList.innerHTML = '<p>Be the first to leave a review!</p>';
                return;
            }

            reviews.forEach(review => {
                const reviewCard = document.createElement('div');
                reviewCard.className = 'review-card';
                reviewCard.innerHTML = `
                    <div class="review-card-header">
                        <h4>${review.name}</h4>
                        <span class="review-card-stars">
                            ${renderStars(review.rating)}
                        </span>
                    </div>
                    <p>"${review.reviewText}"</p>
                `;
                reviewList.appendChild(reviewCard);
            });

        } catch (err) {
            console.error('Error fetching reviews:', err);
            if(reviewList) reviewList.innerHTML = '<p>Could not load reviews.</p>';
        }
    }

    async function handleReviewSubmit(e) {
        e.preventDefault();
        
        const name = document.getElementById('review-name').value;
        const reviewText = document.getElementById('review-text').value;
        const rating = document.querySelector('input[name="rating"]:checked');
        
        if (!rating) {
            reviewMessage.textContent = 'Please select a star rating.';
            reviewMessage.style.color = 'red';
            return;
        }

        const reviewData = {
            name: name,
            reviewText: reviewText,
            rating: parseInt(rating.value, 10)
        };

        try {
            const res = await fetch(`${API_URL}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData)
            });

            const data = await res.json();

            if (res.ok) {
                reviewMessage.textContent = 'Review submitted! Thank you.';
                reviewMessage.style.color = 'green';
                reviewForm.reset();
                fetchReviews(); // Refresh the review list
            } else {
                throw new Error(data.msg || 'Failed to submit review');
            }
        } catch (err) {
            console.error('Error submitting review:', err);
            reviewMessage.textContent = err.message;
            reviewMessage.style.color = 'red';
        }
    }
    
    // --- Event Listeners ---
    if (filterCourse) {
        filterCourse.addEventListener('change', () => fetchColleges(filterCourse.value, filterCity.value, filterRank.value));
    }
    if (filterCity) {
        filterCity.addEventListener('change', () => fetchColleges(filterCourse.value, filterCity.value, filterRank.value));
    }
    if (filterRank) {
        filterRank.addEventListener('change', () => fetchColleges(filterCourse.value, filterCity.value, filterRank.value));
    }
    // **FIX: Added missing review form listener**
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleReviewSubmit);
    }

    // --- Initial Page Load ---
    function init() {
        fetchCourses();
        fetchCities();
        fetchColleges();
        fetchReviews(); // **FIX: Added missing fetchReviews call**
    }

    init(); // Run the app
});