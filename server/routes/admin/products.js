import express from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../../config/cloudinary.js';
import productController from '../../controllers/admin/productController.js';

const router = express.Router();
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'products', allowed_formats: ['jpeg', 'png', 'jpg'] },
});

const upload = multer({ storage });

// Routes
router.post(
  '/add',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'subImages', maxCount: 4 }
  ]),
  productController.addProduct
);
router.get('/get', productController.getProducts);
router.delete('/delete/:id', productController.deleteProduct);
router.put('/update/:id', upload.single('image'), productController.updateProduct);
router.put(
  '/update/:id',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'subImages', maxCount: 4 },
  ]),
  productController.updateProduct
);

router.delete('/subimage/:productId', productController.deleteSubImageFromProduct);
router.get('/products/random', productController.getRandomProducts);
router.get('/subcategory/:subcategoryId', productController.getProductsBySubcategory);
router.get("/category/:categoryname", productController.getProductsByCategory);
router.get("/low-stock", productController.getLowStockProducts);
router.post("/update-stock-after-payment", productController.updateProductStockAfterPayment);

router.post("/similarProducts", productController.similarProducts);

export default router;
