// Test with detailed error information
const FormData = require('form-data');
const fs = require('fs');

// Create a test image file
const testImageData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64');

const formData = new FormData();
formData.append('name', 'Test Detailed Upload');
formData.append('location', 'Test Location');
formData.append('category', 'beach');
formData.append('description', 'Testing with detailed error info');
formData.append('bestTime', 'Summer');
formData.append('isActive', 'true');

formData.append('image', testImageData, {
  filename: 'test-detailed.png',
  contentType: 'image/png'
});

console.log('Testing with detailed error handling...');

fetch('https://backend-chi-one-70.vercel.app/api/admin/places', {
  method: 'POST',
  body: formData
})
.then(response => {
  console.log('Response status:', response.status);
  console.log('Response ok:', response.ok);
  console.log('Response headers:', response.headers);
  
  if (!response.ok) {
    return response.text().then(text => {
      console.log('Error response text:', text);
      throw new Error(`HTTP ${response.status}: ${text}`);
    });
  }
  
  return response.json();
})
.then(data => {
  console.log('Success data:', data);
})
.catch(error => {
  console.error('Detailed error:', error.message);
});
