require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dpxwvqyqj',
  api_key: process.env.CLOUDINARY_API_KEY || '955253823136168',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'KedL2-oui4a4n3xBSNq4T-0waJg'
});

// Test Cloudinary configuration
console.log('Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'USING_FALLBACK',
  api_key: process.env.CLOUDINARY_API_KEY ? 'SET' : 'USING_FALLBACK',
  api_secret: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'USING_FALLBACK',
  configured_cloud_name: cloudinary.config().cloud_name,
  configured_api_key: cloudinary.config().api_key ? 'SET' : 'MISSING'
});

// Configure Cloudinary storage for multer
console.log('Creating CloudinaryStorage...');
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tourist-website',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return file.fieldname + '-' + uniqueSuffix;
    }
  }
});
console.log('CloudinaryStorage created successfully');

module.exports = { cloudinary, storage };
