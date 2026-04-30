// test-backend.js - Run in browser console
fetch('http://localhost:5000/api/health')
    .then(res => res.json())
    .then(data => console.log('Backend is alive:', data))
    .catch(err => console.error('Backend not reachable:', err));