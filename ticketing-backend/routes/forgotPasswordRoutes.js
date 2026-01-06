import express from 'express';
import {
    requestOTP,
    verifyOTPCode,
    resetPassword,
    checkBotStatus,
    reconnectBot
} from '../controllers/forgotPasswordController.js';

const router = express.Router();

/**
 * @route POST /api/forgot-password/request-otp
 * @desc Request OTP (Step 1)
 * @param {string} nama - User name
 * @param {string} noHp - Phone number
 */
router.post('/request-otp', requestOTP);

/**
 * @route POST /api/forgot-password/verify-otp
 * @desc Verify OTP (Step 2)
 * @param {string} noHp - Phone number
 * @param {string} otp - OTP code (6 digits)
 */
router.post('/verify-otp', verifyOTPCode);

/**
 * @route POST /api/forgot-password/reset-password
 * @desc Reset password (Step 3)
 * @param {string} noHp - Phone number
 * @param {string} otp - OTP code
 * @param {string} newPassword - New password
 * @param {string} confirmPassword - Confirm new password
 */
router.post('/reset-password', resetPassword);

/**
 * @route GET /api/forgot-password/bot-status
 * @desc Check WhatsApp Bot status
 */
router.get('/bot-status', checkBotStatus);

/**
 * @route POST /api/forgot-password/reconnect-bot
 * @desc Reconnect WhatsApp Bot (to show QR code again)
 */
router.post('/reconnect-bot', reconnectBot);

export default router;
