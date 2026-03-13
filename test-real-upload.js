const FormData = require('form-data');
const fs = require('fs');

// Create a test image file (1x1 pixel PNG)
const testImageData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64');

const formData = new FormData();
formData.append('name', 'Test Place with Real Image');
formData.append('location', 'Test Location');
formData.append('category', 'beach');
formData.append('description', 'Test Description with real uploaded image');
formData.append('bestTime', 'Summer');
formData.append('isActive', 'true');

// Add a test image file
formData.append('image', testImageData, {
  filename: 'test-upload.png',
  contentType: 'image/png'
});

console.log('Testing file upload with real image data...');

fetch('https://backend-chi-one-70.vercel.app/api/admin/places', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('Response:', JSON.stringify(data, null, 2));
  if (data.image && data.image.startsWith('data:')) {
    console.log('✅ SUCCESS: Image uploaded and converted to base64!');
    console.log('Image data URL length:', data.image.length);
  } else {
    console.log('❌ Image not uploaded or not converted properly');
  }
})
.catch(error => {
  console.error('Error:', error);
});
