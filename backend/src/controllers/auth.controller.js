import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/user.model.js';
import { sendResetPasswordEmail } from '../utils/email.js';
import { Resume } from '../models/resume.model.js';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  try {
    const { email, phone, password, firstName, lastName, role, resumeData, resumeFile } = req.body;

    // Check if user already exists with email or phone
    const existingUser = await User.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : [])
      ]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: `A user with the email ${existingUser.email} already exists. Please try logging in instead.`
      });
    }

    // Create new user
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
      await Promise.all([
        user.save(),
        resume.save()
      ]);

      // Update user with resume reference
      user.resume = resume._id;
      await user.save();
    } else {
      await user.save();
    }

    // Generate token
    const token = generateToken(user._id);

    // Return response with populated resume if exists
    const populatedUser = resume 
      ? await User.findById(user._id).populate('resume')
      : user;

    res.status(201).json({
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
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Send reset email
    await sendResetPasswordEmail(user.email, resetToken);

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const registerWithResume = async (req, res) => {
  try {
    const { email, phone, password, firstName, lastName, resumeData, resumeFile } = req.body;

    // Check if user already exists with email or phone
    const existingUser = await User.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : [])
      ]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: `User already exists with this ${existingUser.email ? 'email' : 'phone number'}`
      });
    }

    // Create new user
    let user = new User({
      email,
      phone,
      password,
      firstName,
      lastName,
      role: 'employee'
    });

    user = await user.save();

    // Create resume document first
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
    await resume.save()

    // Update user with resume reference
    user.resume = resume._id;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return response with populated resume
    const populatedUser = await User.findById(user._id).populate('resume');

    res.status(201).json({
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
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: error.message });
  }
};