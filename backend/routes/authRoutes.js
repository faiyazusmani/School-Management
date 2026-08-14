const express = require('express');
const passport = require('passport');
const {
  registerUser,
  loginUser,
  verifyOtp,
  resendOtp,
  getMe,
  forgotPassword,
  resetPassword,
  googleCallback,
  googleTokenAuth,
  refreshToken,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Local Email/Password & OTP 2FA Auth
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

router.get('/me', protect, getMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.post('/refresh', refreshToken);

// Google Passport OAuth 2.0 Web Redirect Routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login?error=google_auth_failed', session: false }),
  googleCallback
);

// Google Direct Frontend Token Route
router.post('/google', googleTokenAuth);

module.exports = router;
