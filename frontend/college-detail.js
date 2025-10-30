document.addEventListener('DOMContentLoaded', () => {
    // This is your LIVE backend API URL
    const API_URL = 'https://college-finder-api.onrender.com/api/public';
    const BASE_URL = 'https://college-finder-api.onrender.com';
    
    const content = document.getElementById('college-detail-content');
    const loadingMessage = document.getElementById('loading-message');

    // Get the ID from the URL (e.g., college.html?id=123)
    const params = new URLSearchParams(window.location.search);
    const collegeId = params.get('id');

    if (!collegeId) {
        content.innerHTML = '<h1>Error: No college ID provided.</h1>';
        return;
    }

    // Fetch the data for this specific college
    async function fetchCollegeDetails() {
        try {
            const res = await fetch(`${API_URL}/colleges/${collegeId}`);
            if (!res.ok) {
                throw new Error('College not found');
            }
            const college = await res.json();
            displayCollege(college);
        } catch (err) {
            console.error(err);
            content.innerHTML = `<h1>Error: ${err.message}</h1>`;
        }
    }

    function displayCollege(college) {
        // Clear loading message
        loadingMessage.remove();

        // Get image URL
        const imageUrl = college.imageUrl 
            ? `${BASE_URL}/${college.imageUrl.replace(/\\/g, '/')}` 
            : 'https://via.placeholder.com/800x400?text=College+Image';

        // Build the HTML
        content.innerHTML = `
            <div class="detail-header">
                <img src="${imageUrl}" alt="${college.name}">
                <h1>${college.name}</h1>
            </div>
            <div class="detail-body">
                <div class="detail-info-card">
                    <h3><i class="fas fa-info-circle"></i> Description</h3>
                    <p>${college.description}</p>
                </div>

                <div class="detail-info-card">
                    <h3><i class="fas fa-university"></i> College Info</h3>
                    <ul>
                        <li><strong><i class="fas fa-map-marker-alt"></i> Location:</strong> ${college.location}</li>
                        <li><strong><i class="fas fa-city"></i> City:</strong> ${college.city.name}</li>
                        <li><strong><i class="fas fa-dollar-sign"></i> Fees:</strong> $${college.fees.toLocaleString()} / year</li>
                        <li><strong><i class="fas fa-trophy"></i> Rank:</strong> #${college.rank}</li>
                    </ul>
                </div>

                <div class="detail-info-card">
                    <h3><i class="fas fa-book-open"></i> Courses Offered</h3>
                    <ul class="course-list">
                        ${college.courses.map(course => `<li>${course.name}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    fetchCollegeDetails();
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