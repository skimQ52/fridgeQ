const express = require('express');
const router = express.Router();

// controller functions
const { loginUser, signupUser } = require('../controllers/userController')

/* POST for login */
router.post('/login', loginUser);

// Post for Signup
router.post('/signup', signupUser);

module.exports = router;
