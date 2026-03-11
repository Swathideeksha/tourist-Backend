const FormData = require('form-data');

// Test the form submission
const formData = new FormData();
formData.append('name', 'Test Place from Node');
formData.append('location', 'Test Location');
formData.append('category', 'beach');
formData.append('description', 'Test Description');
formData.append('bestTime', 'Summer');
formData.append('isActive', 'true');

fetch('https://backend-chi-one-70.vercel.app/api/admin/places', {
  method: 'POST',
  body: formData
})
.then(response => response.text())
.then(data => {
  console.log('Response:', data);
})
.catch(error => {
  console.error('Error:', error);
});
