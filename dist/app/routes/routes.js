"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_router_1 = require("../modules/Auth/auth.router");
const transection_router_1 = require("../modules/transection/transection.router");
const request_router_1 = require("../modules/request/request.router");
const router = express_1.default.Router();
const moduleRouter = [
    {
        path: "/auth",
        route: auth_router_1.authRouter
    },
    {
        path: "/action",
        route: transection_router_1.actionRoute
    },
    {
        path: "/request",
        route: request_router_1.requestRouter
    },
];
moduleRouter.forEach((route) => router.use(route.path, route.route));
exports.default = router;
