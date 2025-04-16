import { Application } from '../models/application.model.js';
import { startScreeningChat } from '../services/chat.service.js';

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

    // Create application
    const application = new Application({
      user: req.user._id,
      resume: resumeId,
      job: jobId
    });

    // Start screening chat
    const chat = await startScreeningChat(application, jobId, resumeId);
    application.chat = chat._id;

    await application.save();

    res.json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate('job', 'title company description requirements')
      .populate('resume', 'name')
      .populate('chat', 'messages')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
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