import express from 'express'
import { registerUser, login, getUser,logout,forgotPassword,resetPassword } from '../controllers/authController.js';
import multer from "multer"
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();



router.post('/register', registerUser)
router.post('/login', login)
router.get('/get',isAuthenticated, getUser)
router.get('/logout',isAuthenticated, logout)
router.post('/forgot/password', forgotPassword)
router.put('/reset/password/:token', resetPassword)


export default router;