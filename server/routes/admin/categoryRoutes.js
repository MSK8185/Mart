import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../config/cloudinary.js';
import categoryController from '../../controllers/admin/categoryController.js';

const router = express.Router();
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'categories', 
    allowed_formats: ['jpeg', 'png', 'jpg'],
  },
});

const upload = multer({ storage });

// Add a category with image upload
router.post('/addCategories', upload.single('image'), categoryController.addCategory);

// Get all categories
router.get('/', categoryController.getCategories);

// Delete a category by ID
router.delete('/:id', categoryController.deleteCategory);

// Update a category by ID with image upload
router.put('/:id', upload.single('image'), categoryController.updateCategory);

export default router;
