const express = require('express');

const router = express.Router();

const { catchErrors } = require('@/handlers/errorHandlers');
const { body } = require('express-validator');
const adminAuth = require('@/controllers/coreControllers/adminAuth');

router.route('/register').post(
//   [
//     body('username').notEmpty().withMessage('Username is required'),
//     body('email').isEmail().withMessage('Valid email is required'),
//     body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
//   ],
  catchErrors(adminAuth.register)
);

router.route('/login').post(catchErrors(adminAuth.login));

router.route('/forgetpassword').post(catchErrors(adminAuth.forgetPassword));
router.route('/resetpassword').post(catchErrors(adminAuth.resetPassword));

router.route('/logout').post(adminAuth.isValidAuthToken, catchErrors(adminAuth.logout));

module.exports = router;
