import { Application } from '../models/application.model.js';
import { Vacancy } from '../models/vacancy.model.js';
import { startScreeningChat } from '../services/chat.service.js';
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
      .populate('resume', 'name')
      .populate('chat', 'messages')
      .sort({ appliedAt: -1 });

    // Format applications to match the expected structure
    const formattedApplications = applications.map(app => ({
      _id: app._id,
      status: app.status,
      createdAt: app.appliedAt,
      updatedAt: app.updatedAt,
      chat: {
        _id: app.chat?._id
      },
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
        title: app.resume.name
      }
    }));

    res.json(formattedApplications);
  } catch (error) {
    console.error('Error fetching applications:', error);
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