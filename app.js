require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth'); // Import authentication routes
const postRoutes = require('./routes/posts'); // Import post routes

const app = express();

// Middleware to parse JSON
app.use(bodyParser.json());

// Register routes
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT,'0.0.0.0', () => console.log(`Server running on port ${PORT}`));
