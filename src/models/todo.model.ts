/**
 * Define the Todo interface and TodoSchema for MongoDB.
 * Todo interface represents the structure of a todo item,
 * and TodoSchema defines the schema for the MongoDB collection.
 */

import mongoose, { Schema, Document } from 'mongoose';
import { User } from './user.model';

// Define the structure of a todo item
export interface Todo extends Document {
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  user?: User['_id'];
}

// Define the schema for the MongoDB collection
const TodoSchema: Schema = new Schema({
  title: { type: String, required: true }, // Title of the todo item (required)
  description: { type: String }, // Description of the todo item
  dueDate: { type: Date, required: true }, // Due date of the todo item (required)
  completed: { type: Boolean, default: false }, // Completion status of the todo item (default: false)
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who created the todo item (required)
});

// Export the Todo model using the Todo interface and TodoSchema
export default mongoose.model<Todo>('Todo', TodoSchema);
