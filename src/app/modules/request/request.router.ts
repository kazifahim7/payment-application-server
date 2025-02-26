import express from 'express'
import auth from '../../middleware/auth'
import { requestController } from './request.controller'


const router = express.Router()

router.post("/send-request",auth("user","agent"),requestController.sendRequest)
router.get("/request",auth("agent","admin"),requestController.getRequest)
router.get("/myRequest",auth("user"),requestController.myRequest)






export const requestRouter = router