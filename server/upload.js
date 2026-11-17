const multer = require('multer');
const cloudinary = require('cloudinary').v2;

// Cloudinary account details from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer receives the photo files from the app.
// memoryStorage keeps each photo in memory just long enough to send it to Cloudinary.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024, files: 5 }, // up to 5 photos, 4 MB each (Vercel accepts about 4.5 MB per request)
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith('image/')) {
      callback(null, true);
    } else {
      callback(new Error('Only image files are allowed'));
    }
  },
});

// Sends one photo to Cloudinary and gives back its link
function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'pet-adoption' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(file.buffer);
  });
}

module.exports = { upload, uploadToCloudinary };
