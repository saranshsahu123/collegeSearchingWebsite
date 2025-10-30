document.addEventListener('DOMContentLoaded', () => {
    // This is your LIVE backend API URL
    const API_URL = 'https://college-finder-api.onrender.com/api/public';

    const content = document.getElementById('course-detail-content');
    const loadingMessage = document.getElementById('loading-message');

    // Get the ID from the URL (e.g., course.html?id=123)
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get('id');

    if (!courseId) {
        content.innerHTML = '<h1>Error: No course ID provided.</h1>';
        return;
    }

    // Fetch the data for this specific course
    async function fetchCourseDetails() {
        try {
            const res = await fetch(`${API_URL}/courses/${courseId}`);
            if (!res.ok) {
                throw new Error('Course not found');
            }
            // The API returns an object { course: {...}, colleges: [...] }
            const data = await res.json();
            displayCourseDetails(data.course, data.colleges);
        } catch (err) {
            console.error(err);
            content.innerHTML = `<h1>Error: ${err.message}</h1>`;
        }
    }

    function displayCourseDetails(course, colleges) {
        // Clear loading message
        loadingMessage.remove();

        // --- Build Colleges HTML ---
        let collegesHTML = '';
        if (colleges.length === 0) {
            collegesHTML = '<p>No colleges found offering this course.</p>';
        } else {
            // We can reuse the card styles from the main page
            collegesHTML = `
                <div class="card-container">
                    ${colleges.map(college => `
                        <div class="card">
                            <div class="card-content">
                                <h3>${college.name}</h3>
                                <p>Rank: #${college.rank}</p>
                                <p>City: ${college.city.name}</p>
                                <a href="college.html?id=${college._id}" class="btn">View College</a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // --- Build Final Page HTML ---
        content.innerHTML = `
            <div class="detail-header">
                <h1>${course.name}</h1>
            </div>
            <div class="detail-body">
                <div class="detail-info-card">
                    <h3><i class="fas fa-info-circle"></i> Course Details</h3>
                    <p>${course.description}</p>
                    <ul>
                        <li><strong><i class="fas fa-dollar-sign"></i> Average Fees:</strong> ${course.avgFees}</li>
                    </ul>
                </div>

                <div class="detail-info-card">
                    <h3><i class="fas fa-university"></i> Available Colleges (${colleges.length})</h3>
                    ${collegesHTML}
                </div>
            </div>
        `;
    }

    fetchCourseDetails();
});

document.addEventListener('DOMContentLoaded', () => {
    
    // --- ADD THIS LOADER LOGIC ---
    const loader = document.getElementById('page-loader');

    // Hide loader on page load
    // We hide it in the fetch function, but also hide on error
    function hideLoader() {
        loader.style.opacity = '0';
        setTimeout(() => { loader.style.display = 'none'; }, 300);
    }

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
    // --- END OF LOADER LOGIC ---

    // This is your existing code
    const API_URL = '...';
    // ...
    
    // --- UPDATE your fetch functions ---
    // Example for college-detail.js
    async function fetchCollegeDetails() {
        try {
            // ...
            displayCollege(college);
        } catch (err) {
            console.error(err);
            content.innerHTML = `<h1>Error: ${err.message}</h1>`;
            hideLoader(); // <-- ADD THIS
        }
    }

    function displayCollege(college) {
        // ...
        content.innerHTML = `...`;
        hideLoader(); // <-- ADD THIS
    }

    fetchCollegeDetails();
});