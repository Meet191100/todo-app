import cron from 'node-cron';
import Todo from '../models/todo.model';

// Define and export the cron job
export const cronJob = cron.schedule('0 0 * * *', async () => {
  try {
    // Get the current date
    const currentDate = new Date();

    // Find and update todos with expired due dates
    const result = await Todo.updateMany(
      // Query for todos with due dates before or equal to the current date and not completed
      { dueDate: { $lte: currentDate }, completed: false },
      // Update completed status to true
      { $set: { completed: true } } // Set completed field to true without modifying dueDate
    );

    // Check if any todos were updated
    if (result.modifiedCount > 0) {
      console.log('CRON job executed successfully');
    } else {
      console.log('No todos updated in this CRON job');
    }
  } catch (error) {
    // Handle errors during cron job execution
    console.error('Error executing CRON job:', error);
  }
});