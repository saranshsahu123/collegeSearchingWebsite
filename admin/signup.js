document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const secret = document.getElementById('secret').value;
    const messageEl = document.getElementById('message');

    try {
        const res = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, secret })
        });

        const data = await res.json();

        if (res.ok) {
            messageEl.textContent = 'Signup successful! You can now login.';
            messageEl.className = 'success';
            window.location.href = 'login.html';
        } else {
            throw new Error(data.msg || 'Signup failed');
        }
    } catch (err) {
        messageEl.textContent = err.message;
        messageEl.className = 'error';
    }
});