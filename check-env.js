require('dotenv').config();

console.log('Environment Variables Check:');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '***CONFIGURED***' : 'NOT SET');

console.log('\nFallback Values from cloudinary.js:');
console.log('Cloud Name: dpxwvqyqj');
console.log('API Key: 651517387745817');
console.log('API Secret: KedL2-oui4a4n3xBSNq4T-0waJg');
