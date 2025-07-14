const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../middleware/validators/authValidator');
const validateRequest = require('../middleware/validators/validateRequest');

router.post('/register', registerValidator, validateRequest, authController.register);
router.post('/login', loginValidator, validateRequest, authController.login);

module.exports = router;
