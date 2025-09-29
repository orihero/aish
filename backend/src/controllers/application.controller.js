import { Application } from '../models/application.model.js';
import { Vacancy } from '../models/vacancy.model.js';
import { startScreeningChat, evaluateCandidateImmediately } from '../services/chat.service.js';
import { Resume } from '../models/resume.model.js';

export const createApplication = async (req, res) => {
  try {
    const { resumeId, jobId } = req.params;

    // Check if already applied
    const existingApplication = await Application.findOne({
      user: req.user._id,
      job: jobId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    // Get vacancy and resume data
    const vacancy = await Vacancy.findById(jobId);
    if (!vacancy) {
      return res.status(404).json({ message: 'Vacancy not found' });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Create application
    const application = new Application({
      user: req.user._id,
      resume: resumeId,
      job: jobId
    });

    // Save application first to get the ID
    await application.save();

    // Perform immediate AI evaluation
    try {
      await evaluateCandidateImmediately(application, vacancy, resume);
    } catch (evaluationError) {
      console.error('AI evaluation failed:', evaluationError);
      // Continue with application even if evaluation fails
    }

    // Start screening chat with populated data
    const chat = await startScreeningChat(application, vacancy, resume);
    
    // Set chat ID in application
    application.chat = chat._id;
    await application.save();

    // Add application reference to the vacancy
    await Vacancy.findByIdAndUpdate(jobId, {
      $push: { applications: application._id },
      $inc: { applicationsCount: 1 }
    });

    res.json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate({
        path: 'job',
        select: 'title company description requirements createdAt',
        populate: {
          path: 'company',
          select: 'name logo website description',
          populate: {
            path: 'creator',
            select: 'firstName lastName email'
          }
        }
      })
      .populate('resume', 'name title')
      .populate('chat', 'messages')
      .sort({ appliedAt: -1 });

    // Format applications to match the expected structure
    const formattedApplications = applications.map(app => ({
      _id: app._id,
      status: app.status,
      createdAt: app.appliedAt || app.createdAt,
      updatedAt: app.updatedAt,
      chat: {
        _id: app.chat?._id
      },
      // Include evaluation data
      evaluations: app.evaluations || [],
      evaluationSummary: app.evaluationSummary || '',
      totalEvaluationScore: app.totalEvaluationScore || 0,
      job: {
        _id: app.job._id,
        title: app.job.title,
        description: app.job.description,
        requirements: app.job.requirements,
        createdAt: app.job.createdAt,
        company: {
          _id: app.job.company._id,
          name: app.job.company.name,
          logo: app.job.company.logo,
          website: app.job.company.website,
          description: app.job.company.description,
          contact: {
            name: `${app.job.company.creator.firstName} ${app.job.company.creator.lastName}`,
            email: app.job.company.creator.email
          }
        }
      },
      resume: {
        id: app.resume._id,
        title: app.resume.title || app.resume.name
      }
    }));

    res.json(formattedApplications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    // First, verify the job exists and get the company info
    const vacancy = await Vacancy.findById(jobId)
      .populate('company', 'creator');

    if (!vacancy) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the job creator or admin
    if (vacancy.company.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view applications for this job' });
    }

    // Get all applications for this job with evaluation data
    const applications = await Application.find({ job: jobId })
      .populate({
        path: 'resume',
        select: 'name title email phone',
        populate: {
          path: 'user',
          select: 'firstName lastName email'
        }
      })
      .populate('chat', '_id')
      .sort({ totalEvaluationScore: -1, appliedAt: -1 }); // Sort by evaluation score first

    // Format applications to match the expected structure
    const formattedApplications = applications.map(app => ({
      _id: app._id,
      status: app.status,
      createdAt: app.appliedAt || app.createdAt,
      updatedAt: app.updatedAt,
      chat: {
        _id: app.chat?._id
      },
      // Include evaluation data
      evaluations: app.evaluations || [],
      evaluationSummary: app.evaluationSummary || '',
      totalEvaluationScore: app.totalEvaluationScore || 0,
      job: {
        _id: vacancy._id,
        title: vacancy.title,
        company: {
          name: vacancy.company.name,
          logo: vacancy.company.logo
        },
        location: vacancy.location,
        type: vacancy.employmentType
      },
      resume: {
        _id: app.resume._id,
        name: app.resume.user ? `${app.resume.user.firstName} ${app.resume.user.lastName}` : app.resume.name,
        email: app.resume.user?.email || app.resume.email,
        phone: app.resume.phone
      }
    }));

    res.json(formattedApplications);
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getApplicationEvaluations = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId)
      .populate('job', 'title description requirements responsibilities location workType creator')
      .populate('resume', 'name title parsedData')
      .populate('chat', 'messages status score feedback');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is the job creator, applicant, or admin
    const isJobCreator = application.job.creator.toString() === req.user._id.toString();
    const isApplicant = application.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isJobCreator && !isApplicant && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view application evaluations' });
    }

    res.json({
      _id: application._id,
      status: application.status,
      evaluations: application.evaluations || [],
      evaluationSummary: application.evaluationSummary || '',
      totalEvaluationScore: application.totalEvaluationScore || 0,
      job: {
        _id: application.job._id,
        title: application.job.title,
        description: application.job.description,
        requirements: application.job.requirements,
        responsibilities: application.job.responsibilities,
        location: application.job.location,
        workType: application.job.workType
      },
      resume: {
        _id: application.resume._id,
        name: application.resume.name,
        title: application.resume.title,
        parsedData: application.resume.parsedData
      },
      chat: application.chat ? {
        _id: application.chat._id,
        status: application.chat.status,
        score: application.chat.score,
        feedback: application.chat.feedback,
        messages: application.chat.messages
      } : null,
      appliedAt: application.appliedAt,
      updatedAt: application.updatedAt
    });
  } catch (error) {
    console.error('Error fetching application evaluations:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const application = await Application.findById(applicationId)
      .populate('job', 'creator');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is the job creator or admin
    if (application.job.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update application status' });
    }

    application.status = status;
    application.updatedAt = new Date();
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}; 