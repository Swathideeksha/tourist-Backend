fetch('https://backend-chi-one-70.vercel.app/api/admin/places', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Test Place JSON',
    location: 'Test Location',
    category: 'beach',
    description: 'Test Description',
    bestTime: 'Summer',
    isActive: 'true'
  })
})
.then(response => response.text())
.then(data => {
  console.log('Response:', data);
})
.catch(error => {
  console.error('Error:', error);
});
