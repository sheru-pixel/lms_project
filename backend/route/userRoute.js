import express from 'express';
import isAuth from '../middleware/isauth.js';
import upload from '../middleware/multer.js';
import { getCurrentUser, updateUserProfile } from '../contollers/userController.js';

const userRouter = express.Router();
userRouter.get('/current', isAuth, getCurrentUser);
userRouter.post('/profile', isAuth, upload.single('photoUrl'), updateUserProfile);
export default userRouter;
