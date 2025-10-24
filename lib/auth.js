import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import connectDB from './db';
import User from '../models/User';

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const authenticateUser = async (request) => {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return { error: 'No token provided', status: 401 };
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return { error: 'Invalid token', status: 401 };
    }

    await connectDB();
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return { error: 'User not found or inactive', status: 401 };
    }

    return { user };
  } catch (error) {
    return { error: 'Authentication failed', status: 500 };
  }
};

export const requireAdmin = async (request) => {
  const auth = await authenticateUser(request);
  
  if (auth.error) {
    return auth;
  }

  if (auth.user.role !== 'admin') {
    return { error: 'Admin access required', status: 403 };
  }

  return auth;
};