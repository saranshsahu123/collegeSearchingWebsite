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