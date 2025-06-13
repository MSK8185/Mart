import Category from '../../models/admin/categoryModels.js';
import cloudinary from '../../config/cloudinary.js';
import Product from '../../models/admin/product.js';

// Adding Category 
export const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const nameLower = name.trim().toLowerCase();

    const existingCategory = await Category.findOne({ name: nameLower });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    let imageUrl = '';
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: 'categories' });
      imageUrl = uploadResult.secure_url;
    }

    const category = new Category({
      name: nameLower,
      description,
      image: imageUrl,
    });

    await category.save();
    res.status(201).json({
      message: 'Category added successfully',
      category,
    });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ message: 'Failed to add category', error });
  }
};

// Getting Categories 
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories', error });
  }
};

// Deleting Category 
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.image) {
      const publicId = category.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`categories/${publicId}`);
    }

    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Failed to delete category', error });
  }
};

// Updating Category 
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    let updatedImage = undefined;
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: 'categories' });
      updatedImage = uploadResult.secure_url;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name,
        description,
        ...(updatedImage && { image: updatedImage }), 
      },
      { new: true } 
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category updated successfully', updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Failed to update category', error });
  }
};

const categoryController = {
  addCategory,
  getCategories,
  deleteCategory,
  updateCategory,
};

export default categoryController;
