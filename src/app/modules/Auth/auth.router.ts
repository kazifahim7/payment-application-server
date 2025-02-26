import express from 'express'
import { authController } from './auth.controller'
import auth from '../../middleware/auth'

const router = express.Router()


router.post("/register",authController.registerUser)

router.post('/login',authController.loginUser)

router.post("/make-agent/:id",auth("admin"),authController.makeAgent)
router.post("/blocked/:id",auth("admin"),authController.makeBlock)

router.get('/all-user',auth("admin"),authController.getAlluser)
router.get('/user/:id',auth("admin","user","agent"),authController.getSigleUser)










export const authRouter= router