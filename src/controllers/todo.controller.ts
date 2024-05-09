import { Request, Response } from 'express';
import Todo from '../models/todo.model';
import { User } from '../models/user.model';
import moment from 'moment';

interface ApiResponse {
  success: boolean;
  message: string;
  error?: string; // Optional error message
  status: number;
}

// Controller function to create a new todo
export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title, description, dueDate } = req.body;
    const user = (req as any).user as User; // User extracted from JWT payload

    // Parse the date string to a valid JavaScript Date object using moment.js
    const parsedDueDate = moment.utc(dueDate, 'DD/MM/YYYY').startOf('day').toDate();

    // Create a new Todo instance and save it to the database
    const newTodo = new Todo({ title, description, dueDate: parsedDueDate, user: user._id });
    await newTodo.save();

    // Respond with the newly created todo and status code
    const response = { status: 201, success: true, message: 'Todo created successfully', data: newTodo };
    res.status(response.status).json(response);
  } catch (error: any) {
    // Handle errors and respond with status code
    const response: ApiResponse = { status: 500, success: false, message: 'Failed to create todo', error: error.message };
    res.status(response.status).json(response);
  }
};

// Controller function to get all todos for a user
export const getTodos = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as User; // User extracted from JWT payload

    // Find all todos associated with the user
    const todos = await Todo.find({ user: user._id });

    // Respond with the todos and status code
    const response = { status: 200, success: true, message: 'Todos retrieved successfully', data: todos};
    res.status(response.status).json(response);
  } catch (error: any) {
    // Handle errors and respond with status code
    const response: ApiResponse = {status: 500,  success: false, message: 'Failed to retrieve todos', error: error.message };
    res.status(response.status).json(response);
  }
};

// Controller function to update a todo
export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, completed } = req.body;
    const user = (req as any).user as User; // User extracted from JWT payload

    // Parse the date string to a valid JavaScript Date object using moment.js
    let parsedDueDate;
    if (dueDate) {
      parsedDueDate = moment.utc(dueDate, 'DD/MM/YYYY').startOf('day').toDate();
    }

    // Prepare the fields to be updated
    const updateFields: any = { title, description, completed };
    if (parsedDueDate) {
      updateFields.dueDate = parsedDueDate;
    }

    // Find and update the todo
    const todo = await Todo.findOneAndUpdate(
      { _id: id, user: user._id },
      updateFields,
      { new: true }
    );

    // If todo is not found, return 404 status
    if (!todo) {
      const response: ApiResponse = { status: 404, success: false, message: 'Todo not found' };
      return res.status(response.status).json(response);
    }

    // Respond with the updated todo and status code
    const response = {status: 200, success: true, message: 'Todo updated successfully', data: todo };
    res.status(response.status).json(response);
  } catch (error: any) {
    // Handle errors and respond with status code
    console.log(error);
    const response: ApiResponse = {status: 500, success: false, message: 'Failed to update todo', error: error.message};
    res.status(response.status).json(response);
  }
};

// Controller function to delete a todo
export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if ID is provided
    if (!id) {
      const response: ApiResponse = {status: 400,  success: false, message: 'Todo ID is missing in the URL'};
      return res.status(response.status).json(response);
    }
    const user = (req as any).user as User; // User extracted from JWT payload

    // Find and delete the todo
    const todo = await Todo.findOneAndDelete({ _id: id, user: user._id });

    // If todo is not found, return 404 status
    if (!todo) {
      const response: ApiResponse = {status: 404, success: false, message: 'Todo not found'};
      return res.status(response.status).json(response);
    }

    // Respond with success message and status code
    const response = {status: 200, success: true, message: 'Todo deleted successfully'};
    res.status(response.status).json(response);
  } catch (error: any) {
    // Handle errors and respond with status code
    const response: ApiResponse = {status: 500, success: false, message: 'Failed to delete todo', error: error.message};
    res.status(response.status).json(response);
  }
};