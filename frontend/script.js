document.addEventListener('DOMContentLoaded', () => {

    // --- Element Selectors ---
    
    // FIXED: Corrected the URLs (it was 'httpss://')
    const API_URL = 'https://college-finder-api.onrender.com/api/public';
    const BASE_URL = 'https://college-finder-api.onrender.com';
    
    const coursesContainer = document.getElementById('courses-container');
    const citiesContainer = document.getElementById('cities-container');
    const collegesTableBody = document.getElementById('colleges-table-body');
    
    const filterCourse = document.getElementById('filter-course');
    const filterCity = document.getElementById('filter-city');
    const filterRank = document.getElementById('filter-rank');
    
    // REMOVED: All old modal variables
    // const modal = document.getElementById('details-modal');
    // const modalTitle = document.getElementById('modal-title');
    // const modalBody = document.getElementById('modal-body');
    // const closeModal = document.querySelector('.close-button');

    // --- Data Fetching Functions ---

    // Fetch and display all courses
    async function fetchCourses() {
        try {
            const res = await fetch(`${API_URL}/courses`);
            const courses = await res.json();
            
            coursesContainer.innerHTML = ''; // Clear loader
            filterCourse.innerHTML = '<option value="">Filter by Course</option>'; // Reset filter
            
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
            });
        } catch (err) {
            console.error('Error fetching courses:', err);
            coursesContainer.innerHTML = '<p>Error loading courses.</p>';
        }
    }

    // Fetch and display all cities
    async function fetchCities() {
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
    
    // --- Modal Logic ---
    // REMOVED: All old modal functions (showModal, hideModal)
    // REMOVED: All old modal event listeners (closeModal.onclick, window.onclick)
    
    // --- Event Listeners ---

    // Filter change listeners
    filterCourse.addEventListener('change', () => fetchColleges(filterCourse.value, filterCity.value, filterRank.value));
    filterCity.addEventListener('change', () => fetchColleges(filterCourse.value, filterCity.value, filterRank.value));
    filterRank.addEventListener('change', () => fetchColleges(filterCourse.value, filterCity.value, filterRank.value));

    // REMOVED: Old "View More" button event listener
    
    // About section scroll effect
    const aboutSection = document.getElementById('about');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    observer.observe(aboutSection);

    // --- Initial Page Load ---
    function init() {
        fetchCourses();
        fetchCities();
        fetchColleges(); // Load all colleges initially
    }

    init();
});