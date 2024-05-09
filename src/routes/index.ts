// src/routes/index.ts
import express from 'express';
import { createUser, loginUser, protect } from '../controllers/auth.controller';
import { createTodo, getTodos, updateTodo, deleteTodo } from '../controllers/todo.controller';
import { body } from 'express-validator';

const router = express.Router();

// Auth routes
// Validate email and password
router.post('/signup', [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  ], createUser);
router.post('/login', loginUser);

// Todo routes
router.post('/todos', protect, createTodo);
router.get('/todos', protect, getTodos);
router.put('/todos/:id', protect, updateTodo);
router.delete('/todos/:id', protect, deleteTodo);

export default router;
