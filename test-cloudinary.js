require('dotenv').config();
const { cloudinary } = require('./config/cloudinary');

// Test Cloudinary configuration
console.log('Testing Cloudinary configuration...');
console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME || 'dpxwvqyqj');
console.log('API Key:', process.env.CLOUDINARY_API_KEY || '651517387745817');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET || 'KedL2-oui4a4n3xBSNq4T-0waJg');

// Test Cloudinary connection
cloudinary.api.ping((error, result) => {
  if (error) {
    console.error('Cloudinary connection failed:', error);
  } else {
    console.log('Cloudinary connection successful:', result);
  }
});
