document.addEventListener('DOMContentLoaded', () => {
    
    // --- SELECTORS ---
    const API_URL = 'https://college-finder-api.onrender.com/api/public';
    const BASE_URL = 'https://college-finder-api.onrender.com';

    const loader = document.getElementById('page-loader');
    const courseQuickBar = document.getElementById('course-quick-bar-links');
    const content = document.getElementById('city-detail-content');
    const loadingMessage = document.getElementById('loading-message');

    // --- LOADER LOGIC ---
    // We hide it in the fetch function, but also hide on error
    function hideLoader() {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => { loader.style.display = 'none'; }, 300);
        }
    }

    // Show loader on link clicks
    document.querySelectorAll('a[href]:not([href^="#"])').forEach(link => {
        link.addEventListener('click', (e) => {
            // Check if the link is to an external site or a different target
            if (link.hostname !== window.location.hostname || link.target === '_blank') {
                return; // Don't prevent default for external/new tab links
            }
            e.preventDefault();
            const href = link.getAttribute('href');
            if (loader) {
                loader.style.display = 'flex';
                setTimeout(() => { loader.style.opacity = '1'; }, 10);
            }
            setTimeout(() => { window.location = href; }, 400); // Wait for transition
        });
    });

    // --- QUICK BAR LOGIC ---
    // This function's only job is to fill the quick bar
    async function fetchCourseLinks() {
        if (!courseQuickBar) return;
        try {
            const res = await fetch(`${API_URL}/courses`);
            const courses = await res.json();
            courseQuickBar.innerHTML = ''; // Clear "Loading..."

            courses.forEach(course => {
                const quickLink = document.createElement('a');
                quickLink.href = `course.html?id=${course._id}`;
                quickLink.className = 'quick-link';
                quickLink.textContent = course.name;
                courseQuickBar.appendChild(quickLink);
            });
        } catch (err) {
            console.error('Error fetching course links:', err);
            courseQuickBar.innerHTML = '<span class="quick-link-loading">Error loading courses.</span>';
        }
    }

    // --- PAGE-SPECIFIC LOGIC ---
    // Get the ID from the URL (e.g., city.html?id=123)
    const params = new URLSearchParams(window.location.search);
    const cityId = params.get('id');

    if (!cityId) {
        content.innerHTML = '<h1>Error: No city ID provided.</h1>';
        hideLoader(); // Hide loader on error
        return;
    }

    // Fetch the data for this specific city
    async function fetchCityDetails() {
        try {
            const res = await fetch(`${API_URL}/cities/${cityId}`);
            if (!res.ok) {
                throw new Error('City not found');
            }
            // The API returns an object { city: {...}, colleges: [...] }
            const data = await res.json();
            displayCityDetails(data.city, data.colleges);
        } catch (err) {
            console.error(err);
            content.innerHTML = `<h1>Error: ${err.message}</h1>`;
            hideLoader(); // Hide loader on error
        }
    }

    function displayCityDetails(city, colleges) {
        // Clear loading message
        if (loadingMessage) {
            loadingMessage.remove();
        }

        // --- Handle City Image ---
        const imageUrl = city.imageUrl 
            ? `${BASE_URL}/${city.imageUrl.replace(/\\/g, '/')}` 
            : 'https://via.placeholder.com/800x400?text=City+Image';

        // --- Build Colleges HTML ---
        let collegesHTML = '';
        if (colleges.length === 0) {
            collegesHTML = '<p>No colleges found in this city.</p>';
        } else {
            // We can reuse the card styles from the main page
            collegesHTML = `
                <div class="card-container">
                    ${colleges.map(college => `
                        <div class="card">
                            <div class="card-content">
                                <h3>${college.name}</h3>
                                <p>Rank: #${college.rank}</p>
                                <p>Courses: ${college.courses.map(c => c.name).join(', ')}</p>
                                <a href="college.html?id=${college._id}" class="btn">View College</a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // --- Build Final Page HTML ---
        // **FIXED: Corrected typo "class." to "class="**
        content.innerHTML = `
            <div class="detail-header">
                <img src="${imageUrl}" alt="${city.name}">
                <h1>${city.name}</h1>
            </div>
            <div class="detail-body">
                <div class="detail-info-card">
                    <h3><i class="fas fa-info-circle"></i> About ${city.name}</h3>
                    <p>${city.description || 'No description available.'}</p>
                </div>

                <div class="detail-info-card"> 
                    <h3><i class="fas fa-university"></i> Colleges in ${city.name} (${colleges.length})</h3>
                    ${collegesHTML}
                </div>
            </div>
        `;
        
        hideLoader(); // Hide loader on success
    }

    // --- INITIALIZE ---
    fetchCityDetails();
    fetchCourseLinks();
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