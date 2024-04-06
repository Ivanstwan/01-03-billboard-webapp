// multerConfig.js
import multer from 'multer';
import fs from 'fs';

import { extname } from 'path';

// Set storage engine for images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/assets/uploads/'); // Destination folder for image uploads
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// Image upload file filter
const imageFileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    // Remove file if not JPEG or JPG
    console.log(file, '[file]');
    cb(new Error('Only JPEG, JPG, webp files are allowed'));
  }
};

// Set storage engine for documents
const documentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/assets/document/'); // Destination folder for document uploads
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + extname(file.originalname)); // Define file name
  },
});

// Initialize Multer upload instances
const uploadImage = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 600 * 1024, // 600 kB in bytes
  },
});
const uploadDocument = multer({ storage: documentStorage });

export { uploadImage, uploadDocument };
