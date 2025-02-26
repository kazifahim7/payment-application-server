"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const request_controller_1 = require("./request.controller");
const router = express_1.default.Router();
router.post("/send-request", (0, auth_1.default)("user", "agent"), request_controller_1.requestController.sendRequest);
router.get("/request", (0, auth_1.default)("agent", "admin"), request_controller_1.requestController.getRequest);
router.get("/myRequest", (0, auth_1.default)("user"), request_controller_1.requestController.myRequest);
exports.requestRouter = router;
