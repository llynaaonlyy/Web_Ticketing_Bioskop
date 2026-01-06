import express from 'express';
import { registerUser, loginUser, getAllUsers } from '../controllers/authController.js';

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register new user
 * @param {string} nama - Full name
 * @param {string} email - Email address
 * @param {string} noHp - Phone number
 * @param {string} password - Password (min 6 chars)
 * @param {string} confirmPassword - Confirm password
 */
router.post('/register', registerUser);

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @param {string} email - Email address
 * @param {string} password - Password
 */
router.post('/login', loginUser);

/**
 * @route GET /api/auth/users
 * @desc Get all users (debugging)
 */
router.get('/users', getAllUsers);

export default router;
