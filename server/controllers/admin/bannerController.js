import Banner from "../../models/admin/Banner.js";
import cloudinary from "../../config/cloudinary.js";

const bannerController = {
  uploadBanner: async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Save banner info to DB
      const banner = new Banner({
        url: file.path,
        public_id: file.filename,
        title: req.body.title || "", 
      });

      await banner.save();

      res.status(201).json({
        message: "Upload successful",
        banner,
      });
    } catch (error) {
      res.status(500).json({ message: "Upload failed", error });
    }
  },

  deleteBanner: async (req, res) => {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ message: "Public ID is required" });
    }

    try {
      // Delete from Cloudinary
      await cloudinary.uploader.destroy(public_id);

      // Delete from DB
      await Banner.findOneAndDelete({ public_id });

      res.status(200).json({ message: "Banner deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete banner", error });
    }
  },

  getBanners: async (req, res) => {
    try {
      const banners = await Banner.find().sort({ createdAt: -1 });
      res.status(200).json(banners);
    } catch (error) {
      res.status(500).json({ message: "Failed to get banners", error });
    }
  },
};

export default bannerController;
