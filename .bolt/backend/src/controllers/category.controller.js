import { Category } from '../models/category.model.js';
import { Vacancy } from '../models/vacancy.model.js';

export const createCategory = async (req, res) => {
  try {
    const { title, icon, subcategories } = req.body;
    
    const category = new Category({
      title,
      icon,
      subcategories: subcategories || []
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { title, icon, subcategories } = req.body;
    
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.title = title || category.title;
    category.icon = icon || category.icon;
    category.subcategories = subcategories || category.subcategories;

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.deleteOne();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategoryStats = async (req, res) => {
  try {
    // Get all parent categories (those without parentId)
    const categories = await Category.find({ parentId: null });
    
    // Get vacancy counts for each category
    const categoryStats = await Promise.all(categories.map(async (category) => {
      // Get all subcategories for this category
      const subcategoryIds = category.subcategories.map(sub => sub._id);
      
      // Count vacancies for both the main category and its subcategories
      const vacancyCount = await Vacancy.countDocuments({
        $or: [
          { category: category._id },
          { subcategory: { $in: subcategoryIds } }
        ]
      });

      return {
        id: category._id,
        title: category.title,
        icon: category.icon,
        jobCount: vacancyCount
      };
    }));

    res.json(categoryStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};