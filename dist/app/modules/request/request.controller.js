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
exports.requestController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const request_service_1 = require("./request.service");
const sendRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield request_service_1.requestService.sendRequestIntoDB(req.body, (_a = req.user) === null || _a === void 0 ? void 0 : _a.mobileNumber);
    res.status(200).json({
        success: true,
        message: "Cash in request send success fully",
        data: result
    });
}));
const getRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield request_service_1.requestService.getRequest((_a = req.user) === null || _a === void 0 ? void 0 : _a.mobileNumber);
    res.status(200).json({
        success: true,
        message: "ALL data",
        data: result
    });
}));
const myRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield request_service_1.requestService.myRequest((_a = req.user) === null || _a === void 0 ? void 0 : _a.mobileNumber);
    res.status(200).json({
        success: true,
        message: "ALL data",
        data: result
    });
}));
exports.requestController = {
    sendRequest,
    getRequest,
    myRequest
};
