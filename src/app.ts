// app.ts

import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import { config } from './config/config'; // Import config variables
import routes from './routes';
import { cronJob } from './cron/cron'; // Import the cron job from cron.ts

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api', routes);

// MongoDB connection using config variable
mongoose.connect(config.mongoDBUrl)
  .then(() => {
    console.log('MongoDB connected');
    // Start the Express server using config variable
    app.listen(config.serverPort, () => {
      console.log(`Server is running on port ${config.serverPort}`);
    });
    // Start the CRON job
    cronJob.start();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

export default app;
