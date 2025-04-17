import { Vacancy } from "../models/vacancy.model.js";
import { sendNewJobNotification } from "../config/telegram.js";
import { Company } from "../models/company.model.js";
import { Application } from "../models/application.model.js";

export const createVacancy = async (req, res) => {
  try {
    const {
      title,
      category,
      subcategory,
      description,
      salary,
      employmentType,
      workType,
    } = req.body;

    const vacancy = new Vacancy({
      title,
      creator: req.user._id,
      category,
      subcategory,
      description,
      salary,
      employmentType,
      workType,
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
      my,
      sort = "newest",
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Filter by employer's company if 'my' parameter is true
    if (my === "true" && req.user) {
      const company = await Company.findOne({ creator: req.user._id });
      if (company) {
        query.company = company._id;
      }
    }

    // Featured jobs filter
    if (featured === "true") {
      query.isFeatured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
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
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "mostViewed":
        sortOptions = { views: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    const vacancies = await Vacancy.find(query)
      .populate("creator", "firstName lastName")
      .populate({
        path: "category",
        select: "title subcategories",
        populate: {
          path: "subcategories",
          match: { _id: { $eq: "$subcategory" } },
        },
      })
      .populate({
        path: "company",
        select: "name logo industry size location contact",
      })
      .skip(skip)
      .limit(Number(limit))
      .sort(sortOptions);

    console.log("====================================");
    console.log(req.user);
    console.log("====================================");
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
      .populate("creator", "firstName lastName")
      .populate({
        path: "category",
        select: "title subcategories",
        populate: {
          path: "subcategories",
          match: { _id: { $eq: "$subcategory" } },
        },
      })
      .populate({
        path: "company",
        select:
          "name logo industry size location contact website social benefits",
      });

    if (!vacancy) {
      return res.status(404).json({ message: "Vacancy not found" });
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
      return res.status(404).json({ message: "Vacancy not found" });
    }

    // Check if user is the creator or an admin
    if (
      vacancy.creator.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this vacancy" });
    }

    const {
      title,
      category,
      subcategory,
      description,
      salary,
      employmentType,
      workType,
    } = req.body;

    Object.assign(vacancy, {
      title: title || vacancy.title,
      category: category || vacancy.category,
      subcategory: subcategory || vacancy.subcategory,
      description: description || vacancy.description,
      salary: salary || vacancy.salary,
      employmentType: employmentType || vacancy.employmentType,
      workType: workType || vacancy.workType,
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
      return res.status(404).json({ message: "Vacancy not found" });
    }

    // Check if user is the creator or an admin
    if (
      vacancy.creator.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this vacancy" });
    }

    await vacancy.deleteOne();
    res.json({ message: "Vacancy deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeaturedVacancies = async (req, res) => {
  try {
    const vacancies = await Vacancy.find({ isFeatured: true })
      .populate("creator", "firstName lastName")
      .populate({
        path: "category",
        select: "title subcategories",
        populate: {
          path: "subcategories",
          match: { _id: { $eq: "$subcategory" } },
        },
      })
      .populate({
        path: "company",
        select: "name logo industry size location contact",
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
      .populate("creator", "firstName lastName")
      .populate({
        path: "category",
        select: "title subcategories",
        populate: {
          path: "subcategories",
          match: { _id: { $eq: "$subcategory" } },
        },
      })
      .populate({
        path: "company",
        select: "name logo industry size location contact",
      })
      .sort({ createdAt: -1 })
      .limit(8);

    res.json(vacancies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyVacancies = async (req, res) => {
  try {
    const company = await Company.findOne({ creator: req.user._id });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const { search, status, sort = "newest", page = 1, limit = 10 } = req.query;

    const query = { company: company._id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (status) query.status = status;

    // Determine sort order
    let sortOptions = {};
    switch (sort) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;

    const vacancies = await Vacancy.find(query)
      .populate("creator", "firstName lastName")
      .populate({
        path: "category",
        select: "title subcategories",
        populate: {
          path: "subcategories",
          match: { _id: { $eq: "$subcategory" } },
        },
      })
      .skip(skip)
      .limit(Number(limit))
      .sort(sortOptions);

    // Check if user has applied to each vacancy
    const vacanciesWithAppliedStatus = await Promise.all(
      vacancies.map(async (vacancy) => {
        const application = await Application.findOne({
          user: req.user._id,
          job: vacancy._id,
        });

        return {
          ...vacancy.toObject(),
          isApplied: !!application,
        };
      })
    );

    const total = await Vacancy.countDocuments(query);

    res.json({
      vacancies: vacanciesWithAppliedStatus,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEmployeeVacancies = async (req, res) => {
  try {
    const {
      search,
      employmentType,
      workType,
      company,
      sort = "newest",
      page = 1,
      limit = 10
    } = req.query;
    
    const skip = (page - 1) * limit;

    // Build query
    const query = { status: "active" };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (employmentType) {
      query.employmentType = employmentType;
    }

    if (workType) {
      query.workType = workType;
    }

    if (company) {
      query["company.name"] = { $regex: company, $options: "i" };
    }

    // Use aggregation pipeline with application references
    const vacancies = await Vacancy.aggregate([
      { $match: query },
      // Lookup applications for the current user
      {
        $lookup: {
          from: "applications",
          let: { vacancyId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$job", "$$vacancyId"] },
                    { $eq: ["$user", req.user._id] },
                  ],
                },
              },
            },
          ],
          as: "userApplication",
        },
      },
      // Add application status fields
      {
        $addFields: {
          isApplied: { $gt: [{ $size: "$userApplication" }, 0] },
          applicationStatus: {
            $arrayElemAt: ["$userApplication.status", 0],
          },
        },
      },
      // Lookup company info
      {
        $lookup: {
          from: "companies",
          localField: "company",
          foreignField: "_id",
          as: "company",
          pipeline: [
            {
              $project: { name: 1, logo: 1, industry: 1, size: 1, location: 1 },
            },
          ],
        },
      },
      // Lookup category info
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
          pipeline: [{ $project: { title: 1, subcategories: 1 } }],
        },
      },
      // Clean up arrays
      { $unwind: "$company" },
      { $unwind: "$category" },
      // Remove applications array from response
      { $project: { applications: 0, userApplication: 0 } },
      // Sort
      { $sort: sort === "newest" ? { createdAt: -1 } : { createdAt: 1 } },
      // Get total count before pagination
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $skip: skip },
            { $limit: Number(limit) }
          ]
        }
      }
    ]);

    const [result] = vacancies;
    const total = result.metadata[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);
    const currentPage = Number(page);

    res.json({
      vacancies: result.data,
      total,
      pages: totalPages,
      currentPage,
      hasNextPage: currentPage < totalPages,
      nextPage: currentPage < totalPages ? currentPage + 1 : null
    });
  } catch (error) {
    console.error("Error in getEmployeeVacancies:", error);
    res.status(500).json({ message: error.message });
  }
};
