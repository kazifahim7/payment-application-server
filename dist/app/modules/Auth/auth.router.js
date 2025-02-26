"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const router = express_1.default.Router();
router.post("/register", auth_controller_1.authController.registerUser);
router.post('/login', auth_controller_1.authController.loginUser);
router.post("/make-agent/:id", (0, auth_1.default)("admin"), auth_controller_1.authController.makeAgent);
router.post("/blocked/:id", (0, auth_1.default)("admin"), auth_controller_1.authController.makeBlock);
router.get('/all-user', (0, auth_1.default)("admin"), auth_controller_1.authController.getAlluser);
router.get('/user/:id', (0, auth_1.default)("admin", "user", "agent"), auth_controller_1.authController.getSigleUser);
exports.authRouter = router;
