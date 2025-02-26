"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const auth_service_1 = require("./auth.service");
const registerUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authService.registerUserIntoDB(req.body);
    res.status(200).json({
        success: true,
        message: "User registered successfully",
        data: result
    });
}));
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authService.loginUser(req.body);
    res.status(200).json({
        success: true,
        message: "User login successfully",
        data: result
    });
}));
const makeAgent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authService.makeAgent(req.params.id);
    res.status(200).json({
        success: true,
        message: "Agent created  successfully",
        data: result
    });
}));
const makeBlock = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authService.makeBlock(req.params.id);
    res.status(200).json({
        success: true,
        message: "user blocked  successfully",
        data: result
    });
}));
const getAlluser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authService.getallUser(req.query);
    res.status(200).json({
        success: true,
        message: "All user retrieved successfully",
        data: result
    });
}));
const getSigleUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authService.getSingleUser(req.params.id);
    res.status(200).json({
        success: true,
        message: " user retrieved successfully",
        data: result
    });
}));
exports.authController = {
    registerUser,
    loginUser,
    makeAgent,
    makeBlock,
    getAlluser,
    getSigleUser
};
