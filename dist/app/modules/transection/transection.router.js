"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionRoute = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const transection_controller_1 = require("./transection.controller");
const router = express_1.default.Router();
router.post("/send-money", (0, auth_1.default)("user", "agent", "admin"), transection_controller_1.actionController.sendMoney);
router.post("/cash-out", (0, auth_1.default)("user", "agent", "admin"), transection_controller_1.actionController.cashOut);
router.post("/cash-in", (0, auth_1.default)("agent", "admin", "user"), transection_controller_1.actionController.cashIn);
router.get("/all-tran/:number", (0, auth_1.default)("admin"), transection_controller_1.actionController.AllTran);
router.get("/my-tran", (0, auth_1.default)("admin", "user", "agent"), transection_controller_1.actionController.myTran);
exports.actionRoute = router;
