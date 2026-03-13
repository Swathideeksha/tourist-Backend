const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Create a test image file (1x1 pixel PNG)
const testImageData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64');

const formData = new FormData();
formData.append('name', 'Test Place with File Upload');
formData.append('location', 'Test Location');
formData.append('category', 'beach');
formData.append('description', 'Test Description');
formData.append('bestTime', 'Summer');
formData.append('isActive', 'true');

// Add a test image file
formData.append('image', testImageData, {
  filename: 'test-image.png',
  contentType: 'image/png'
});

fetch('https://backend-chi-one-70.vercel.app/api/admin/places', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('Response:', JSON.stringify(data, null, 2));
})
.catch(error => {
  console.error('Error:', error);
});
