import express from 'express'
import auth from '../../middleware/auth'
import { actionController } from './transection.controller'

const router = express.Router()

router.post("/send-money",auth("user","agent","admin"),actionController.sendMoney)
router.post("/cash-out",auth("user","agent","admin"),actionController.cashOut)
router.post("/cash-in",auth("agent","admin","user"),actionController.cashIn)

router.get("/all-tran/:number",auth("admin"),actionController.AllTran)
router.get("/my-tran",auth("admin","user","agent"),actionController.myTran)








export const actionRoute = router