document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('admin-token');
    if (!token) {
        // If no token, redirect to login
        window.location.href = 'login.html';
        return;
    }

    const API_URL = 'http://localhost:5000';
    const authHeader = { 'Authorization': `Bearer ${token}` };

    // --- Selectors ---
    const courseForm = document.getElementById('course-form');
    const cityForm = document.getElementById('city-form');
    const collegeForm = document.getElementById('college-form');
    const collegeCitySelect = document.getElementById('college-city');
    const collegeCourseSelect = document.getElementById('college-courses');
    const logoutButton = document.getElementById('logout-button');

    // --- Helper to show messages ---
    function showMessage(elId, text, isError = false) {
        const el = document.getElementById(elId);
        el.textContent = text;
        el.className = isError ? 'error' : 'success';
    }

    // --- Populate Select Dropdowns for College Form ---
    async function populateDropdowns() {
        try {
            // Fetch Courses
            const courseRes = await fetch(`${API_URL}/api/public/courses`);
            const courses = await courseRes.json();
            collegeCourseSelect.innerHTML = '';
            courses.forEach(course => {
                const option = document.createElement('option');
                option.value = course._id;
                option.textContent = course.name;
                collegeCourseSelect.appendChild(option);
            });

            // Fetch Cities
            const cityRes = await fetch(`${API_URL}/api/public/cities`);
            const cities = await cityRes.json();
            collegeCitySelect.innerHTML = '<option value="">Select a City</option>';
            cities.forEach(city => {
                const option = document.createElement('option');
                option.value = city._id;
                option.textContent = city.name;
                collegeCitySelect.appendChild(option);
            });

        } catch (err) {
            console.error('Error populating dropdowns:', err);
        }
    }

    // --- Form Submit Handlers ---

    // Add Course
    courseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const body = JSON.stringify({
            name: document.getElementById('course-name').value,
            description: document.getElementById('course-desc').value,
            avgFees: document.getElementById('course-fees').value
        });
        
        try {
            const res = await fetch(`${API_URL}/api/admin/courses`, {
                method: 'POST',
                headers: { ...authHeader, 'Content-Type': 'application/json' },
                body: body
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Failed');
            
            showMessage('course-message', 'Course added successfully!');
            courseForm.reset();
            populateDropdowns(); // Re-populate
        } catch (err) {
            showMessage('course-message', `Error: ${err.message}`, true);
        }
    });

    // Add City
    cityForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', document.getElementById('city-name').value);
        formData.append('description', document.getElementById('city-desc').value);
        formData.append('cityImage', document.getElementById('city-image').files[0]);

        try {
            const res = await fetch(`${API_URL}/api/admin/cities`, {
                method: 'POST',
                headers: authHeader, // No 'Content-Type', 'multer' handles it
                body: formData
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Failed');
            
            showMessage('city-message', 'City added successfully!');
            cityForm.reset();
            populateDropdowns(); // Re-populate
        } catch (err) {
            showMessage('city-message', `Error: ${err.message}`, true);
        }
    });

    // Add College
    collegeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get multiple selected courses
        const selectedCourses = [...collegeCourseSelect.options]
            .filter(option => option.selected)
            .map(option => option.value);

        const formData = new FormData();
        formData.append('name', document.getElementById('college-name').value);
        formData.append('description', document.getElementById('college-desc').value);
        formData.append('fees', document.getElementById('college-fees').value);
        formData.append('rank', document.getElementById('college-rank').value);
        formData.append('location', document.getElementById('college-location').value);
        formData.append('cityId', document.getElementById('college-city').value);
        formData.append('courseIds', JSON.stringify(selectedCourses));
        formData.append('collegeImage', document.getElementById('college-image').files[0]);
        
        try {
            const res = await fetch(`${API_URL}/api/admin/colleges`, {
                method: 'POST',
                headers: authHeader,
                body: formData
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Failed');
            
            showMessage('college-message', 'College added successfully!');
            collegeForm.reset();
        } catch (err) {
            showMessage('college-message', `Error: ${err.message}`, true);
        }
    });

    // --- Logout ---
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('admin-token');
        window.location.href = 'login.html';
    });

    // --- Initial Load ---
    populateDropdowns();
});