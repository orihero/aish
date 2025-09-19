import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/user.model.js';
import { sendResetPasswordEmail } from '../utils/email.js';
import { Resume } from '../models/resume.model.js';
import { Company } from '../models/company.model.js';
import { Logger } from '../utils/logger.js';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    Logger.info('👤 Starting user registration', { 
      email: req.body.email, 
      phone: req.body.phone, 
      firstName: req.body.firstName, 
      lastName: req.body.lastName, 
      role: req.body.role 
    });

    const { email, phone, password, firstName, lastName, role, resumeData, resumeFile } = req.body;

    // Check if user already exists with email or phone
    Logger.debug('🔍 Checking for existing user', { email, phone });
    const existingUser = await User.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : [])
      ]
    });

    if (existingUser) {
      Logger.warning('⚠️ User already exists', { 
        existingEmail: existingUser.email, 
        existingPhone: existingUser.phone 
      });
      return res.status(400).json({ 
        message: `A user with the email ${existingUser.email} already exists. Please try logging in instead.`
      });
    }

    // Create new user
    Logger.info('👤 Creating new user', { email, firstName, lastName, role: role || 'employee' });
    const user = new User({
      email,
      phone,
      password,
      firstName,
      lastName,
      role: role || 'employee'
    });

    // If resume data is provided and user is an employee, create resume
    let resume;
    if (resumeData && (role === 'employee' || !role)) {
      Logger.info('📄 Creating resume for employee', { 
        userId: user._id, 
        hasResumeFile: !!resumeFile,
        resumeDataKeys: Object.keys(resumeData || {})
      });
      
      resume = new Resume({
        userId: user._id,
        name: `${firstName} ${lastName}'s Resume`,
        cvFile: resumeFile ? {
          url: resumeFile.url,
          filename: resumeFile.filename
        } : undefined,
        parsedData: resumeData
      });

      // Save both documents
      Logger.debug('💾 Saving user and resume to database');
      await Promise.all([
        user.save(),
        resume.save()
      ]);

      // Update user with resume reference
      user.resume = resume._id;
      await user.save();
      Logger.success('✅ User and resume created successfully', { userId: user._id, resumeId: resume._id });
    } else {
      Logger.debug('💾 Saving user to database (no resume)');
      await user.save();
      Logger.success('✅ User created successfully', { userId: user._id });
    }

    // Generate token
    Logger.debug('🔑 Generating JWT token', { userId: user._id });
    const token = generateToken(user._id);

    // Return response with populated resume if exists
    const populatedUser = resume 
      ? await User.findById(user._id).populate('resume')
      : user;

    const responseData = {
      user: {
        id: populatedUser._id,
        email: populatedUser.email,
        phone: populatedUser.phone,
        firstName: populatedUser.firstName,
        lastName: populatedUser.lastName,
        role: populatedUser.role,
        resume: populatedUser.resume
      },
      token
    };

    Logger.success('🎉 Registration completed successfully', { 
      userId: populatedUser._id, 
      email: populatedUser.email,
      hasResume: !!populatedUser.resume
    });

    res.status(201).json(responseData);
  } catch (error) {
    Logger.error('❌ Registration error', error);
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    Logger.info('🔐 Starting user login', { email: req.body.email });
    const { email, password } = req.body;

    // Find user
    Logger.debug('🔍 Looking up user by email', { email });
    const user = await User.findOne({ email });
    if (!user) {
      Logger.warning('⚠️ Login failed - user not found', { email });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    Logger.debug('👤 User found, checking password', { userId: user._id, email: user.email });
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      Logger.warning('⚠️ Login failed - invalid password', { userId: user._id, email: user.email });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    Logger.debug('🔑 Generating JWT token for login', { userId: user._id });
    const token = generateToken(user._id);

    const responseData = {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token
    };

    Logger.success('🎉 Login successful', { 
      userId: user._id, 
      email: user.email, 
      role: user.role 
    });

    res.json(responseData);
  } catch (error) {
    Logger.error('❌ Login error', error);
    res.status(400).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    Logger.info('👤 Getting user profile', { userId: req.user._id });
    const user = req.user;
    
    const profileData = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    };

    Logger.success('✅ Profile retrieved successfully', { userId: user._id });
    res.json(profileData);
  } catch (error) {
    Logger.error('❌ Error getting profile', error);
    res.status(400).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    Logger.info('🔐 Starting password reset request', { email: req.body.email });
    const { email } = req.body;

    Logger.debug('🔍 Looking up user for password reset', { email });
    const user = await User.findOne({ email });
    if (!user) {
      Logger.warning('⚠️ Password reset failed - user not found', { email });
      return res.status(404).json({ message: 'User not found' });
    }

    Logger.info('🔑 Generating reset token', { userId: user._id });
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    Logger.debug('💾 Saving reset token to database', { userId: user._id });
    await user.save();

    // Send reset email
    Logger.info('📧 Sending password reset email', { email: user.email });
    await sendResetPasswordEmail(user.email, resetToken);

    Logger.success('✅ Password reset email sent successfully', { userId: user._id, email: user.email });
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    Logger.error('❌ Password reset error', error);
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    Logger.info('🔐 Starting password reset process', { hasToken: !!req.body.token });
    const { token, password } = req.body;

    Logger.debug('🔍 Validating reset token');
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      Logger.warning('⚠️ Password reset failed - invalid or expired token');
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    Logger.info('🔑 Updating user password', { userId: user._id });
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    Logger.debug('💾 Saving updated password to database', { userId: user._id });
    await user.save();

    Logger.success('✅ Password reset successful', { userId: user._id, email: user.email });
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    Logger.error('❌ Password reset error', error);
    res.status(400).json({ message: error.message });
  }
};

export const registerWithResume = async (req, res) => {
  try {
    Logger.info('👤 Starting user registration with resume', { 
      email: req.body.email, 
      phone: req.body.phone, 
      firstName: req.body.firstName, 
      lastName: req.body.lastName,
      hasResumeData: !!req.body.resumeData,
      hasResumeFile: !!req.body.resumeFile
    });

    const { email, phone, password, firstName, lastName, resumeData, resumeFile } = req.body;

    // Check if user already exists with email or phone
    Logger.debug('🔍 Checking for existing user', { email, phone });
    const existingUser = await User.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : [])
      ]
    });

    if (existingUser) {
      Logger.warning('⚠️ User already exists', { 
        existingEmail: existingUser.email, 
        existingPhone: existingUser.phone 
      });
      return res.status(400).json({ 
        message: `User already exists with this ${existingUser.email ? 'email' : 'phone number'}`
      });
    }

    // Create new user
    Logger.info('👤 Creating new employee user', { email, firstName, lastName });
    let user = new User({
      email,
      phone,
      password,
      firstName,
      lastName,
      role: 'employee'
    });

    Logger.debug('💾 Saving user to database');
    user = await user.save();

    // Create resume document first
    Logger.info('📄 Creating resume document', { 
      userId: user._id, 
      hasResumeFile: !!resumeFile,
      resumeDataKeys: Object.keys(resumeData || {})
    });
    
    const resume = new Resume({
      user: user,
      name: `${firstName} ${lastName}'s Resume`,
      cvFile: resumeFile ? {
        url: resumeFile.url,
        filename: resumeFile.filename
      } : undefined,
      parsedData: resumeData
    });

    // Save both documents
    Logger.debug('💾 Saving resume to database');
    await resume.save()

    // Update user with resume reference
    Logger.debug('🔗 Linking resume to user');
    user.resume = resume._id;
    await user.save();

    // Generate token
    Logger.debug('🔑 Generating JWT token', { userId: user._id });
    const token = generateToken(user._id);

    // Return response with populated resume
    Logger.debug('🔍 Populating user with resume data');
    const populatedUser = await User.findById(user._id).populate('resume');

    const responseData = {
      user: {
        id: populatedUser._id,
        email: populatedUser.email,
        phone: populatedUser.phone,
        firstName: populatedUser.firstName,
        lastName: populatedUser.lastName,
        role: populatedUser.role,
        resume: populatedUser.resume
      },
      token
    };

    Logger.success('🎉 Registration with resume completed successfully', { 
      userId: populatedUser._id, 
      email: populatedUser.email,
      resumeId: resume._id
    });

    res.status(201).json(responseData);
  } catch (error) {
    Logger.error('❌ Registration with resume error', error);
    res.status(400).json({ message: error.message });
  }
};

export const registerBusiness = async (req, res) => {
  try {
    Logger.info('🏢 Starting business registration', { 
      email: req.body.email, 
      phone: req.body.phone, 
      firstName: req.body.firstName, 
      lastName: req.body.lastName,
      companyName: req.body.company?.name
    });

    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      phone, 
      company 
    } = req.body;

    // Check if user already exists with email or phone
    Logger.debug('🔍 Checking for existing user', { email, phone });
    const existingUser = await User.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : [])
      ]
    });

    if (existingUser) {
      Logger.warning('⚠️ User already exists', { 
        existingEmail: existingUser.email, 
        existingPhone: existingUser.phone 
      });
      return res.status(400).json({ 
        message: `A user with the email ${existingUser.email} already exists. Please try logging in instead.`
      });
    }

    // Create new employer user
    Logger.info('👤 Creating new employer user', { email, firstName, lastName });
    const user = new User({
      email,
      phone,
      password,
      firstName,
      lastName,
      role: 'employer'
    });

    Logger.debug('💾 Saving user to database');
    await user.save();

    // Create company
    Logger.info('🏢 Creating company', { 
      userId: user._id, 
      companyName: company.name,
      industry: company.industry
    });
    
    const companyData = new Company({
      name: company.name,
      description: company.description || '',
      industry: company.industry,
      size: company.size || '1-50',
      founded: company.founded,
      website: company.website,
      location: {
        country: company.location?.country || '',
        city: company.location?.city || '',
        address: company.location?.address
      },
      contact: {
        email: company.contact?.email || user.email,
        phone: company.contact?.phone
      },
      social: company.social ? {
        linkedin: company.social.linkedin,
        twitter: company.social.twitter,
        facebook: company.social.facebook,
        instagram: company.social.instagram
      } : undefined,
      benefits: company.benefits || [],
      creator: user._id,
      status: 'pending' // New companies start as pending
    });

    Logger.debug('💾 Saving company to database');
    await companyData.save();

    // Generate token
    Logger.debug('🔑 Generating JWT token', { userId: user._id });
    const token = generateToken(user._id);

    const responseData = {
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      company: {
        id: companyData._id,
        name: companyData.name,
        status: companyData.status
      },
      token
    };

    Logger.success('🎉 Business registration completed successfully', { 
      userId: user._id, 
      email: user.email,
      companyId: companyData._id,
      companyName: companyData.name
    });

    res.status(201).json(responseData);
  } catch (error) {
    Logger.error('❌ Business registration error', error);
    res.status(400).json({ message: error.message });
  }
};