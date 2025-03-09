require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Database connection
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/professors', require('./routes/professors'));
app.use('/api/students', require('./routes/students'));

// Export for testing
module.exports = app;

// Start server only in production
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
}