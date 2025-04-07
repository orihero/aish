import { Company } from '../models/company.model.js';
import { Vacancy } from '../models/vacancy.model.js';

export const createCompany = async (req, res) => {
  try {
    const {
      name,
      logo,
      description,
      industry,
      size,
      founded,
      website,
      location,
      contact,
      social,
      benefits
    } = req.body;

    // Check if user already has a company (for employers)
    if (req.user.role === 'employer') {
      const existingCompany = await Company.findOne({ creator: req.user._id });
      if (existingCompany) {
        return res.status(400).json({ message: 'You already have a registered company' });
      }
    }

    const company = new Company({
      name,
      logo,
      description,
      industry,
      size,
      founded,
      website,
      location,
      contact,
      social,
      benefits,
      creator: req.user._id
    });

    await company.save();
    res.status(201).json(company);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getCompanies = async (req, res) => {
  try {
    const {
      search,
      industry,
      size,
      country,
      status,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (industry) query.industry = industry;
    if (size) query.size = size;
    if (country) query['location.country'] = country;
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const companies = await Company.find(query)
      .populate('creator', 'firstName lastName')
      .skip(skip)
      .select('-__v')
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Company.countDocuments(query);

    res.json({
      companies,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate('creator', 'firstName lastName')
      .select('-__v');

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ creator: req.user._id })
      .populate('creator', 'firstName lastName')
      .select('-__v');

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Get company's vacancies
    const vacancies = await Vacancy.find({ company: company._id })
      .sort({ createdAt: -1 })
      .select('title status createdAt');

    res.json({ company, vacancies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Check authorization
    if (company.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this company' });
    }

    const {
      name,
      logo,
      description,
      industry,
      size,
      founded,
      website,
      location,
      contact,
      social,
      benefits,
      status
    } = req.body;

    Object.assign(company, {
      name: name || company.name,
      logo: logo || company.logo,
      description: description || company.description,
      industry: industry || company.industry,
      size: size || company.size,
      founded: founded || company.founded,
      website: website || company.website,
      location: location || company.location,
      contact: contact || company.contact,
      social: social || company.social,
      benefits: benefits || company.benefits,
      status: status || company.status
    });

    await company.validate();
    await company.save();
    res.json(company);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Check authorization
    if (company.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this company' });
    }

    await company.deleteOne();
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};