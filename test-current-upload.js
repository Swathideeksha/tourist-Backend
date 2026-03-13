// Test the current FormData upload system
const FormData = require('form-data');
const fs = require('fs');

// Create a test image file (1x1 pixel PNG)
const testImageData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64');

const formData = new FormData();
formData.append('name', 'Test Current Upload System');
formData.append('location', 'Test Location');
formData.append('category', 'beach');
formData.append('description', 'Testing current upload implementation');
formData.append('bestTime', 'Summer');
formData.append('isActive', 'true');

// Add a test image file
formData.append('image', testImageData, {
  filename: 'test-current.png',
  contentType: 'image/png'
});

console.log('Testing current upload system...');

fetch('https://backend-chi-one-70.vercel.app/api/admin/places', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('=== CURRENT UPLOAD TEST RESULTS ===');
  console.log('Place created:', data.name);
  console.log('Image type:', typeof data.image);
  console.log('Image starts with http:', data.image ? data.image.startsWith('http') : false);
  console.log('Image starts with data:', data.image ? data.image.startsWith('data:') : false);
  console.log('Full image URL:', data.image);
  console.log('Gallery images count:', data.images ? data.images.length : 0);
  
  if (data.images && data.images.length > 0) {
    data.images.forEach((img, i) => {
      console.log(`Gallery ${i + 1}:`, img);
      console.log(`Gallery ${i + 1} starts with http:`, img.startsWith('http'));
      console.log(`Gallery ${i + 1} starts with data:`, img.startsWith('data:'));
    });
  }
  
  // Check if this is a Cloudinary URL
  if (data.image && data.image.includes('cloudinary')) {
    console.log('✅ SUCCESS: Cloudinary upload working!');
  } else if (data.image && data.image.startsWith('data:')) {
    console.log('⚠️  FALLBACK: Using base64 (Cloudinary not working)');
  } else if (data.image && data.image.startsWith('http')) {
    console.log('⚠️  FALLBACK: Using placeholder URLs');
  } else {
    console.log('❌ ISSUE: No valid image URL');
  }
})
.catch(error => {
  console.error('Upload test error:', error);
});
