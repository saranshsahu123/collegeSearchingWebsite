document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageEl = document.getElementById('message');

    try {
        const res = await fetch('https://college-finder-api.onrender.com/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
            // Login was successful! Store the token.
            localStorage.setItem('admin-token', data.token);
            
            // Redirect to the dashboard
            window.location.href = 'dashboard.html';
        } else {
            // Login failed, show the error message
            throw new Error(data.msg || 'Login failed');
        }
    } catch (err) {
        messageEl.textContent = err.message;
        messageEl.className = 'error';
    }
});