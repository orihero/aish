import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { Logger } from '../utils/logger.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      Logger.warning('🚫 Authentication failed - no token provided', { 
        url: req.originalUrl, 
        method: req.method 
      });
      throw new Error();
    }

    Logger.debug('🔍 Verifying JWT token', { hasToken: !!token });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    Logger.debug('👤 Looking up user by token', { userId: decoded.userId });
    const user = await User.findById(decoded.userId);

    if (!user) {
      Logger.warning('🚫 Authentication failed - user not found', { userId: decoded.userId });
      throw new Error();
    }

    Logger.success('✅ Authentication successful', { 
      userId: user._id, 
      email: user.email, 
      role: user.role 
    });

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    Logger.error('❌ Authentication error', error);
    res.status(401).json({ message: 'Please authenticate' });
  }
};