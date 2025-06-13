import Product from '../../models/admin/product.js';
import cloudinary from '../../config/cloudinary.js';
import Category from '../../models/admin/categoryModels.js';
import mongoose from 'mongoose';

export const addProduct = async (req, res) => {
  try {
    let {
      name,
      category,
      price,
      stock,
      productDetails,
      originalprice,
      productId,
      quantity,
      subCategory,
      bulkPricing,
      MOQ
    } = req.body;

    // Check if category exists
    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Upload main image
    let image = '';
    if (req.files?.image?.[0]) {
      const result = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: 'products'
      });
      image = result.secure_url;
    }

    // Upload subImages
    let subImages = [];
    if (req.files?.subImages?.length) {
      for (const file of req.files.subImages) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'products/subimages'
        });
        subImages.push(result.secure_url);
      }
    }

    // Parse bulkPricing if needed
    if (typeof bulkPricing === 'string') {
      try {
        bulkPricing = JSON.parse(bulkPricing);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid bulkPricing format' });
      }
    }

    const product = new Product({
      name,
      productId,
      category: categoryDoc._id,
      subCategory: subCategory ? new mongoose.Types.ObjectId(subCategory) : null,
      price,
      stock,
      image,
      subImages,
      productDetails,
      originalprice,
      quantity,
      bulkPricing: bulkPricing || [],
      MOQ: MOQ || 1
    });

    await product.save();
    res.status(201).json({ message: 'B2B Product added successfully', product });
  } catch (error) {
    console.error('Error adding product:', error.message);
    res.status(500).json({ message: 'Failed to add product', error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .populate('subCategory', 'name');

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.image) {
      const publicId = product.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`products/${publicId}`);
    }

    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product', error });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let {
      name,
      category,
      subCategory,
      price,
      stock,
      productDetails,
      originalprice,
      productId,
      quantity,
      bulkPricing,
      MOQ,
      deletedSubImageUrls = "[]", 
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    if (subCategory === "") {
      subCategory = null;
    }

    if (subCategory && !mongoose.Types.ObjectId.isValid(subCategory)) {
      return res.status(400).json({ message: "Invalid subcategory ID" });
    }

    if (typeof bulkPricing === "string") {
      try {
        bulkPricing = JSON.parse(bulkPricing);
      } catch (error) {
        return res.status(400).json({ message: "Invalid bulkPricing format" });
      }
    }

    if (typeof deletedSubImageUrls === "string") {
      deletedSubImageUrls = JSON.parse(deletedSubImageUrls);
    }

    // Upload main image if provided
    let updatedImage;
    if (req.files?.image?.length > 0) {
      const uploadResult = await cloudinary.uploader.upload(req.files.image[0].path, {
        folder: "products",
      });
      updatedImage = uploadResult.secure_url;
    }

    // Upload new subimages if provided
    const newSubImages = [];
    if (req.files?.subImages?.length > 0) {
      for (const file of req.files.subImages) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products/subImages",
        });
        newSubImages.push(result.secure_url);
      }
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Remove deleted subimages from existing array
    let updatedSubImages = product.subImages || [];
    if (deletedSubImageUrls.length > 0) {
      updatedSubImages = updatedSubImages.filter(
        (url) => !deletedSubImageUrls.includes(url)
      );
    }

    // Append newly uploaded subimages
    updatedSubImages.push(...newSubImages);

    const updateData = {
      name,
      productId,
      category,
      subCategory,
      price,
      stock,
      productDetails,
      originalprice,
      quantity,
      bulkPricing: bulkPricing || [],
      MOQ: MOQ || 1,
      ...(updatedImage && { image: updatedImage }),
      subImages: updatedSubImages,
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("category subCategory");

    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// Get Products by Category
export const getProductsByCategory = async (req, res) => {
  const { categoryname } = req.params;
  if (!categoryname) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Category name is required in the URL parameter.',
    });
  }
  try {
    // Find the category by its name
    const categoryDoc = await Category.findOne({ name: categoryname });
    if (!categoryDoc) {
      return res.status(404).json({
        error: 'Category not found',
        message: `No category found with name: ${categoryname}`,
      });
    }
    const products = await Product.find({ category: categoryDoc._id }).populate('category', categoryname);
    if (!products.length) {
      return res.status(200).json({
        message: `No products found in category: ${categoryname}`,
      });
    }
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message,
    });
  }
};

export const getProductsBySubcategory = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    // console.log("Received subcategoryId:", subcategoryId); 
    if (!mongoose.Types.ObjectId.isValid(subcategoryId)) {
      return res.status(400).json({ message: 'Invalid subcategory ID' });
    }
    const products = await Product.find({ subCategory: subcategoryId })
      .populate('category', 'name')
      .populate('subCategory', 'name');
      //  console.log("Fetched products:", products);
    if (!products.length) {
      return res.status(404).json({ message: 'No products found for this subcategory' });
    }
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products by subcategory:', error.message);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

// Fetch Random Products
export const getRandomProducts = async (req, res) => {
  try {
    const productCount = 8; 
    // Fetch random products using MongoDB's $sample aggregation
    const randomProducts = await Product.aggregate([
      { $sample: { size: productCount } } 
    ]);
    // If no products are found
    if (!randomProducts.length) {
      return res.status(404).json({ message: 'No products found' });
    }
    res.status(200).json({ products: randomProducts });
  } catch (error) {
    console.error('Error fetching random products:', error.message);
    res.status(500).json({ message: 'Failed to fetch random products', error: error.message });
  }
};


export const updateProductStockAfterPayment = async (req, res) => {
  try {
    const { purchasedItems } = req.body;

    if (!Array.isArray(purchasedItems) || purchasedItems.length === 0) {
      return res.status(400).json({ message: "No purchased items provided." });
    }

    for (const item of purchasedItems) {
      const product = await Product.findOne({ productId: item.productId });

      if (!product) {
        return res.status(404).json({ message: `Product with ID ${item.productId} not found.` });
      }

      if (product.stock < item.quantityPurchased) {
        return res.status(400).json({
          message: `Not enough stock for product ${item.productId}. Available: ${product.stock}, Purchased: ${item.quantityPurchased}`,
        });
      }

      product.quantity = product.quantity || "1"; 
      product.stock -= item.quantityPurchased;
      await product.save();
    }

    res.status(200).json({ success: true, message: "Stock updated successfully." });
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ success: false, message: "Failed to update stock." });
  }
};


const getLowStockProducts = async (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold, 10) || 5;
    const lowStockProducts = await Product.find({ stock: { $lt: threshold } });
    res.status(200).json({ lowStockProducts });
  } catch (error) {
    console.error("Error fetching low-stock products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const similarProducts = async (req, res) => {
  const { subCategory } = req.body;

  try {
    // Fetch all products with the same subCategory
    const products = await Product.find({ subCategory });

    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching similar products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const deleteSubImageFromProduct = async (req, res) => {
  const { productId } = req.params;
  const { imageUrlOrId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Remove from Cloudinary
    let publicId;
    if (imageUrlOrId.includes('/')) {
      // If it's a full URL, extract publicId
      const parts = imageUrlOrId.split('/');
      const fileName = parts[parts.length - 1];
      publicId = fileName.split('.')[0]; // without .jpg/.png
    } else {
      publicId = imageUrlOrId; // already publicId
    }

    await cloudinary.uploader.destroy(publicId);

    // Remove from subImages array in product
    product.subImages = product.subImages.filter(img => img !== imageUrlOrId);
    await product.save();

    res.status(200).json({ message: 'Sub image deleted successfully' });
  } catch (error) {
    console.error('Delete subImage error:', error);
    res.status(500).json({ message: 'Failed to delete sub image', error: error.message });
  }
};


export default { addProduct, getProducts, deleteProduct,
   updateProduct, getProductsByCategory, getProductsBySubcategory,
    getRandomProducts, updateProductStockAfterPayment, getLowStockProducts,similarProducts,
  deleteSubImageFromProduct};