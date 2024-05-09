import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.model';
import { ValidationError, validationResult } from 'express-validator';

// Define a custom interface for Request with a user property
interface CustomRequest extends Request {
  user?: { _id: string }; // Define the user property
}

// Function to generate JWT token
const generateToken = (userId: string) => {
  return jwt.sign({ userId }, 'your_secret_key', { expiresIn: '1h' });
};

// Interface for ApiResponse
interface ApiResponse {
  success: boolean;
  message: string;
  error?: string | ValidationError[]; // Adjust the type to accept an array of ValidationErrors
  status: number;
  accessToken?: string;
}

// Controller function to create a new user
export const createUser = async (req: CustomRequest, res: Response) => {
  // Extract errors from request validation
  const errors = validationResult(req);
  // Check if there are validation errors
  if (!errors.isEmpty()) {
    // If there are validation errors, respond with 400 status and error messages
    const response: ApiResponse = { status: 400, success: false, message: 'Validation failed', error: errors.array() };
    return res.status(response.status).json(response);
  }

  try {
    const { email, password } = req.body;
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If user already exists, respond with 400 status and appropriate message
      const response: ApiResponse = { status: 400, success: false, message: 'User already exists' };
      return res.status(response.status).json(response);
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    // If user is created successfully, respond with 201 status and appropriate message
    const response: ApiResponse = { status: 201, success: true, message: 'User created successfully' };
    res.status(response.status).json(response);
  } catch (error: any) {
    // Handle server error
    const response: ApiResponse = { status: 500, success: false, message: 'Failed to create user', error: error.message };
    res.status(response.status).json(response);
  }
};

// Controller function to log in a user
export const loginUser = async (req: CustomRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // If user does not exist, respond with 401 status and appropriate message
      const response: ApiResponse = { status: 401, success: false, message: 'Invalid email or password' };
      return res.status(response.status).json(response);
    }
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // If password is invalid, respond with 401 status and appropriate message
      const response: ApiResponse = { status: 401, success: false, message: 'Invalid email or password' };
      return res.status(response.status).json(response);
    }
    // Generate JWT token
    const token = generateToken(user._id);
    // If login is successful, respond with 200 status, token, and appropriate message
    const response: ApiResponse = { status: 200, success: true, message: 'Login successful', accessToken: token };
    res.status(response.status).json(response);
  } catch (error: any) {
    // Handle server error
    const response: ApiResponse = { status: 500, success: false, message: 'Failed to login', error: error.message };
    res.status(response.status).json(response);
  }
};

// Middleware to verify JWT token
export const protect = (req: CustomRequest, res: Response, next: Function) => {
  // Extract token from the request header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    // If token is not provided, respond with unauthorized status
    const response: ApiResponse = { status: 401, success: false, message: 'Unauthorized' };
    return res.status(response.status).json(response);
  }
  try {
    // Verify the token and extract user ID
    const decoded = jwt.verify(token, 'your_secret_key') as { userId: string };
    // Attach user info to request
    req.user = { _id: decoded.userId };
    // Move to the next middleware
    next();
  } catch (error: any) {
    // If token verification fails, respond with unauthorized status
    const response: ApiResponse = { status: 401, success: false, message: 'Unauthorized', error: error.message };
    res.status(response.status).json(response);
  }
};
