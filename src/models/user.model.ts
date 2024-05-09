// Import mongoose library along with Schema and Document interfaces
import mongoose, { Schema, Document } from 'mongoose';

// Define the User interface extending Document
export interface User extends Document {
  email: string; // Email of the user
  password: string; // Password of the user
}

// Define the UserSchema using Schema class from mongoose
const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true }, // Email field with validation
  password: { type: String, required: true }, // Password field with validation
});

// Create and export the User model with UserSchema
export default mongoose.model<User>('User', UserSchema);

