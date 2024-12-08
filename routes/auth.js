const express = require('express');
const { register, login } = require('../controllers/usersController'); // Import register and login functions
const router = express.Router();

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', login);

module.exports = router;
