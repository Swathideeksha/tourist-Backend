// Test with simple FormData to debug the issue
const FormData = require('form-data');

const formData = new FormData();
formData.append('name', 'Simple Test');
formData.append('location', 'Test Location');
formData.append('category', 'beach');
formData.append('description', 'Simple test description');
formData.append('bestTime', 'Summer');
formData.append('isActive', 'true');

console.log('Testing simple FormData without files...');

fetch('https://backend-chi-one-70.vercel.app/api/admin/places', {
  method: 'POST',
  body: formData
})
.then(response => {
  console.log('Response status:', response.status);
  console.log('Response ok:', response.ok);
  
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
  console.log('Place created:', data.name);
  console.log('Image:', data.image);
})
.catch(error => {
  console.error('Error:', error.message);
});
