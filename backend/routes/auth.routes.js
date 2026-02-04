import express from 'express'
import { registerUser, login, getUser,logout,forgotPassword,resetPassword } from '../controllers/authController.js';
import multer from "multer"

const router = express.Router();



router.post('/register', registerUser)
router.post('/login', login)
router.get('/get', getUser)
router.get('/logout', logout)
router.post('/forgot/password', forgotPassword)
router.put('/reset/password', resetPassword)


export default router;