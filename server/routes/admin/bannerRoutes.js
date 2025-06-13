import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../config/cloudinary.js";
import bannerController from "../../controllers/admin/bannerController.js";

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "banners",
    allowed_formats: ["jpeg", "png", "jpg"],
  },
});

const upload = multer({ storage });

// Upload a new banner
router.post("/upload", upload.single("image"), bannerController.uploadBanner);

// Get all banners
router.get("/get", bannerController.getBanners);

// Delete banner by public_id
router.delete("/delete", bannerController.deleteBanner);

export default router;
