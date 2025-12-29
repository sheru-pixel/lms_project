import express from 'express';
import { signUp, login, logOut, forgetPasswordSendOtp, verifyOtp, resetPassword } from '../contollers/authController.js';

const authRouther = express.Router();

authRouther.post('/signup', signUp);
authRouther.post('/login', login);
authRouther.post('/logout', logOut);
authRouther.post('/forget-password', forgetPasswordSendOtp);
authRouther.post('/verify-otp', verifyOtp);
authRouther.post('/reset-password', resetPassword);

export default authRouther;

