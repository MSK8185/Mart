import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../config/cloudinary.js';
import subCategoryController from '../../controllers/admin/subCategoryControllers.js'

const router = express.Router();
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'categories', 
      allowed_formats: ['jpeg', 'png', 'jpg'],
    },
  });

  const upload = multer({ storage });

  router.post('/', upload.single('image'), subCategoryController.addSubCategory);

  router.get('/', subCategoryController.getSubCategories);

  router.delete('/:id', subCategoryController.deleteSubCategory);

  router.put('/:id', upload.single('image'), subCategoryController.updateSubCategory);

  router.get('/subcategories', subCategoryController.getSubcategoriesByCategory);
  
  export default router;