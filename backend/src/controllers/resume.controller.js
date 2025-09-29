import fs from 'fs';
import path from 'path';
import textract from 'textract';
// import { sendApplicationStatusNotification } from '../config/telegram.js';
import { Resume } from '../models/resume.model.js';
import { User } from '../models/user.model.js';
import { Vacancy } from '../models/vacancy.model.js';
import { startScreeningChat } from '../services/chat.service.js';
import { generateResumePDF } from '../services/pdf-generator.service.js';
import { analyzeResume } from '../services/resume-analyzer.service.js';

export const createManualResumeWithRegistration = async (req, res) => {
  try {
    const { parsedData, password } = req.body;

    // Validate parsed data structure
    if (!parsedData.basics || !parsedData.basics.email || !parsedData.basics.name) {
      return res.status(400).json({ message: 'Invalid resume data structure' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: parsedData.basics.email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new user
    const [firstName, ...lastNameParts] = parsedData.basics.name.split(' ');
    const user = new User({
      email: parsedData.basics.email,
      password,
      firstName,
      lastName: lastNameParts.join(' ') || firstName,
      role: 'employee'
    });

    await user.save();

    // Ensure skills and languages are in correct format
    const formattedData = {
      ...parsedData,
      skills: parsedData.skills.map(skill => {
        if (typeof skill === 'string') {
          return {
            name: skill,
            level: 'Intermediate',
            keywords: [skill]
          };
        }
        return {
          name: skill.name || '',
          level: skill.level || 'Intermediate',
          keywords: Array.isArray(skill.keywords) ? skill.keywords : [skill.name || '']
        };
      }),
      languages: (parsedData.languages || []).map(lang => {
        if (typeof lang === 'string') {
          return {
            language: lang,
            fluency: 'Conversational'
          };
        }
        return {
          language: lang.language || '',
          fluency: lang.fluency || 'Conversational'
        };
      })
    };

    const resume = new Resume({
      user: user._id,
      name: `${user.firstName}'s Resume`,
      parsedData: formattedData,
      applications: []
    });

    await resume.save();

    // Generate JWT token
    const token = user.generateAuthToken();

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      resume,
      token
    });
  } catch (error) {
    console.error('Manual resume creation error:', error);
    res.status(400).json({ message: error.message });
  }
};

export const analyzeResumeFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    console.log('Reading file:', filePath);

    try {
      console.log('Extracting text from file...');
      const text = await new Promise((resolve, reject) => {
        textract.fromFileWithPath(filePath, {
          preserveLineBreaks: true,
          pdftotextOptions: {
            layout: 'raw'
          }
        }, (error, text) => {
          if (error) {
            console.error('Text extraction error:', error);
            reject(error);
          } else {
            resolve(text);
          }
        });
      });
      
      if (!text || text.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'The uploaded PDF appears to be a scanned document or image. Please upload a PDF with selectable text or use the manual resume form instead.'
        });
      }

      console.log('Analyzing resume with AI...');
      const analysis = await analyzeResume(text);
      
      // Save the file information
      const fileUrl = `/uploads/${req.file.filename}`;
      
      res.json({
        success: true,
        data: analysis,
        fileUrl,
        fileName: req.file.filename
      });
    } catch (error) {
      console.error('Resume analysis error:', error);
      
      // Delete the uploaded file since we couldn't process it
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });

      if (error.message.includes('No text content could be extracted')) {
        return res.status(400).json({
          success: false,
          error: 'The uploaded PDF appears to be a scanned document or image. Please upload a PDF with selectable text or use the manual resume form instead.'
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Failed to analyze resume. Please try again or use the manual resume form.'
      });
    }
  } catch (error) {
    console.error('Error in analyzeResumeFile:', error);
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    });
  }
};

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
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ message: 'CV file is required' });
    }

    const { name } = req.body;
    if (!name) {
      console.error('No resume name provided');
      return res.status(400).json({ message: 'Resume name is required' });
    }

    console.log('Reading file:', req.file.path);
    // Read the uploaded file
    const pdfBuffer = fs.readFileSync(req.file.path);

    // Parse PDF text using pdf-lib
    const fullText = await parsePDF(pdfBuffer);
    console.log('Successfully parsed PDF, text length:', fullText.length);

    // Create file URL
    const cvFile = {
      url: `/uploads/${req.file.filename}`,
      filename: req.file.originalname
    };
    console.log('File URL created:', cvFile.url);

    // Analyze resume using OpenRouter API
    console.log('Analyzing resume text with OpenRouter API...');
    const parsedData = await analyzeResume(fullText);
    console.log('Resume analysis complete');

    const resume = new Resume({
      user: req.user._id,
      name,
      cvFile,
      parsedData,
      applications: []
    });

    await resume.save();
    console.log('Resume saved successfully:', resume._id);
    res.status(201).json(resume);
  } catch (error) {
    console.error('Resume creation error:', error);
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
      // Download and analyze the new PDF using pdf-lib
      const pdfBuffer = fs.readFileSync(path.join('uploads', path.basename(cvFile.url)));
      const data = await parsePDF(pdfBuffer);
      const fullText = data.text;

      parsedData = await analyzeResume(fullText);
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

    // await sendApplicationStatusNotification(application);
    res.json(resume);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .populate({
        path: 'applications.vacancy',
        select: 'title company description requirements createdAt',
        populate: {
          path: 'company',
          select: 'name logo website description',
          populate: {
            path: 'creator',
            select: 'firstName lastName email'
          }
        }
      });

    // Extract and format applications
    const applications = resumes.flatMap(resume => 
      resume.applications.map(app => ({
        _id: app._id,
        status: app.status,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
        job: {
          _id: app.vacancy._id,
          title: app.vacancy.title,
          description: app.vacancy.description,
          requirements: app.vacancy.requirements,
          createdAt: app.vacancy.createdAt,
          company: {
            _id: app.vacancy.company._id,
            name: app.vacancy.company.name,
            logo: app.vacancy.company.logo,
            website: app.vacancy.company.website,
            description: app.vacancy.company.description,
            contact: {
              name: `${app.vacancy.company.creator.firstName} ${app.vacancy.company.creator.lastName}`,
              email: app.vacancy.company.creator.email
            }
          }
        },
        resume: {
          id: resume._id,
          title: resume.name
        }
      }))
    );

    // Sort by appliedAt date (newest first)
    applications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: error.message });
  }
};