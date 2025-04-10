import { Vacancy } from '../models/vacancy.model.js';
import { sendNewJobNotification } from '../config/telegram.js';

export const createVacancy = async (req, res) => {
  try {
    const {
      title,
      category,
      subcategory,
      description,
      salary,
      employmentType,
      workType
    } = req.body;

    const vacancy = new Vacancy({
      title,
      creator: req.user._id,
      category,
      subcategory,
      description,
      salary,
      employmentType,
      workType
    });

    await vacancy.save();
    await sendNewJobNotification(vacancy);
    res.status(201).json(vacancy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getVacancies = async (req, res) => {
  try {
    const {
      search,
      category,
      employmentType,
      workType,
      salaryMin,
      salaryMax,
      featured,
      sort = 'newest',
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    // Featured jobs filter
    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) query.category = category;
    if (employmentType) query.employmentType = employmentType;
    if (workType) query.workType = workType;
    if (salaryMin || salaryMax) {
      query.salary = {};
      if (salaryMin) query.salary.$gte = Number(salaryMin);
      if (salaryMax) query.salary.$lte = Number(salaryMax);
    }

    // Determine sort order
    let sortOptions = {};
    switch (sort) {
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'mostViewed':
        sortOptions = { views: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    const vacancies = await Vacancy.find(query)
      .populate('creator', 'firstName lastName')
      .populate({
        path: 'category',
        select: 'title subcategories',
        populate: {
          path: 'subcategories',
          match: { _id: { $eq: '$subcategory' } }
        }
      })
      .populate({
        path: 'company',
        select: 'name logo industry size location contact'
      })
      .skip(skip)
      .limit(Number(limit))
      .sort(sortOptions);

    const total = await Vacancy.countDocuments(query);

    res.json({
      vacancies,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVacancy = async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id)
      // First increment the views
      .findOneAndUpdate(
        { _id: req.params.id },
        { $inc: { views: 1 } },
        { new: true }
      )
      .populate('creator', 'firstName lastName')
      .populate({
        path: 'category',
        select: 'title subcategories',
        populate: {
          path: 'subcategories',
          match: { _id: { $eq: '$subcategory' } }
        }
      })
      .populate({
        path: 'company',
        select: 'name logo industry size location contact website social benefits'
      });

    if (!vacancy) {
      return res.status(404).json({ message: 'Vacancy not found' });
    }

    res.json(vacancy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVacancy = async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id);
    
    if (!vacancy) {
      return res.status(404).json({ message: 'Vacancy not found' });
    }

    // Check if user is the creator or an admin
    if (vacancy.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this vacancy' });
    }

    const {
      title,
      category,
      subcategory,
      description,
      salary,
      employmentType,
      workType
    } = req.body;

    Object.assign(vacancy, {
      title: title || vacancy.title,
      category: category || vacancy.category,
      subcategory: subcategory || vacancy.subcategory,
      description: description || vacancy.description,
      salary: salary || vacancy.salary,
      employmentType: employmentType || vacancy.employmentType,
      workType: workType || vacancy.workType
    });

    await vacancy.save();
    res.json(vacancy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteVacancy = async (req, res) => {
  try {
    const vacancy = await Vacancy.findById(req.params.id);
    
    if (!vacancy) {
      return res.status(404).json({ message: 'Vacancy not found' });
    }

    // Check if user is the creator or an admin
    if (vacancy.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this vacancy' });
    }

    await vacancy.deleteOne();
    res.json({ message: 'Vacancy deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeaturedVacancies = async (req, res) => {
  try {
    const vacancies = await Vacancy.find({ isFeatured: true })
      .populate('creator', 'firstName lastName')
      .populate({
        path: 'category',
        select: 'title subcategories',
        populate: {
          path: 'subcategories',
          match: { _id: { $eq: '$subcategory' } }
        }
      })
      .populate({
        path: 'company',
        select: 'name logo industry size location contact'
      })
      .sort({ createdAt: -1 })
      .limit(6);

    res.json(vacancies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNewestVacancies = async (req, res) => {
  try {
    const vacancies = await Vacancy.find()
      .populate('creator', 'firstName lastName')
      .populate({
        path: 'category',
        select: 'title subcategories',
        populate: {
          path: 'subcategories',
          match: { _id: { $eq: '$subcategory' } }
        }
      })
      .populate({
        path: 'company',
        select: 'name logo industry size location contact'
      })
      .sort({ createdAt: -1 })
      .limit(8);

    res.json(vacancies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};