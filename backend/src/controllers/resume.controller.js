import pdf from 'pdf-parse';
import { Resume } from '../models/resume.model.js';
import { Vacancy } from '../models/vacancy.model.js';
import { startScreeningChat, continueChat } from '../services/chat.service.js';
import { analyzeResume } from '../services/resume-analyzer.service.js';
import { generateResumePDF } from '../services/pdf-generator.service.js';
import { sendApplicationStatusNotification } from '../config/telegram.js';

export const updateParsedData = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Update parsed data
    resume.parsedData = req.body;
    await resume.save();

    res.json(resume);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const downloadResumePDF = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Generate PDF from parsed data
    const pdfBuffer = await generateResumePDF(resume.parsedData);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resume.name}.pdf"`);

    // Send PDF
    res.send(pdfBuffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const createResume = async (req, res) => {
  try {
    const { name, cvFile } = req.body;
    
    // Download the PDF file
    const pdfResponse = await fetch(cvFile.url);
    const pdfBuffer = await pdfResponse.arrayBuffer();
    
    // Extract text from PDF
    const pdfData = await pdf(Buffer.from(pdfBuffer));
    
    // Analyze resume using OpenRouter API
    const parsedData = await analyzeResume(pdfData.text);

    const resume = new Resume({
      user: req.user._id,
      name,
      cvFile,
      parsedData,
      applications: []
    });

    await resume.save();
    res.status(201).json(resume);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .populate('applications.vacancy', 'title company');

    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('applications.vacancy', 'title company');

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const { name, cvFile } = req.body;

    // If a new CV file is uploaded, analyze it
    let parsedData = resume.parsedData;
    if (cvFile && cvFile.url !== resume.cvFile.url) {
      // Download and analyze the new PDF
      const pdfResponse = await fetch(cvFile.url);
      const pdfBuffer = await pdfResponse.arrayBuffer();
      const pdfData = await pdf(Buffer.from(pdfBuffer));
      parsedData = await analyzeResume(pdfData.text);
    }

    Object.assign(resume, {
      name: name || resume.name,
      cvFile: cvFile || resume.cvFile,
      parsedData: parsedData
    });

    await resume.save();
    res.json(resume);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    await resume.deleteOne();
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const applyToVacancy = async (req, res) => {
  try {
    const { resumeId, vacancyId } = req.params;

    // Check if vacancy exists
    const vacancy = await Vacancy.findById(vacancyId);
    if (!vacancy) {
      return res.status(404).json({ message: 'Vacancy not found' });
    }

    // Check if resume exists and belongs to user
    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user._id
    });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check if already applied
    const alreadyApplied = resume.applications.some(
      app => app.vacancy.toString() === vacancyId
    );
    if (alreadyApplied) {
      return res.status(400).json({ message: 'Already applied to this vacancy' });
    }

    // Add application
    const application = {
      vacancy: vacancyId,
      appliedAt: new Date(),
      status: 'pending'
    };
    resume.applications.push(application);
    await resume.save();

    // Start screening chat
    const chat = await startScreeningChat(application, vacancy, resume);
    
    res.json({
      resume,
      chat
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { resumeId, applicationId } = req.params;
    const { status } = req.body;

    const resume = await Resume.findById(resumeId).populate('applications.vacancy');
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    const application = resume.applications.id(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user is the vacancy creator or admin
    const vacancy = await Vacancy.findById(application.vacancy);
    if (vacancy.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update application status' });
    }

    application.status = status;
    await resume.save();

    await sendApplicationStatusNotification(application);
    res.json(resume);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};