// Test Backend Connection
// Run this in browser console to test backend connection

console.log('Testing backend connection...');

// Test 1: Health endpoint
fetch('http://localhost:5000/health')
  .then(res => res.json())
  .then(data => {
    console.log('✅ Backend health check passed:', data);
    return fetch('http://localhost:5000/api/auth/linkedin/authorize');
  })
  .then(res => res.json())
  .then(data => {
    console.log('✅ Auth endpoint working:', data);
  })
  .catch(err => {
    console.error('❌ Backend connection failed:', err);
    console.log('🔧 Make sure backend server is running on port 5000');
  });

// Test 2: Environment variables
console.log('Frontend API URL:', import.meta.env.VITE_API_URL);

// Test 3: CORS check
console.log('Testing CORS...');
fetch('http://localhost:5000/health', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  }
})
.then(response => {
  console.log('✅ CORS working, status:', response.status);
})
.catch(error => {
  console.error('❌ CORS error:', error);
});