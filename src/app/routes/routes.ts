import express from 'express'
import { authRouter } from '../modules/Auth/auth.router'
import { actionRoute } from '../modules/transection/transection.router'
import { requestRouter } from '../modules/request/request.router'

const router = express.Router()

const moduleRouter = [
    {
        path: "/auth",
        route: authRouter
    },
    {
        path: "/action",
        route: actionRoute
    },
    {
        path: "/request",
        route: requestRouter
    },
]

moduleRouter.forEach((route) => router.use(route.path, route.route))


export default router