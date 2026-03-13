require('dotenv').config();
const { cloudinary } = require('./config/cloudinary');

console.log('Testing Cloudinary configuration...');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME || 'dpxwvqyqj');
console.log('API Key:', process.env.CLOUDINARY_API_KEY || '651517387745817');
console.log('API Secret configured:', !!process.env.CLOUDINARY_API_SECRET);

// Test Cloudinary connection
cloudinary.api.ping()
  .then(result => {
    console.log('✅ Cloudinary connection successful!');
    console.log('Response:', result);
  })
  .catch(error => {
    console.error('❌ Cloudinary connection failed:', error.message);
    console.error('Error details:', error);
  });
