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
exports.actionController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const transection_services_1 = require("./transection.services");
const sendMoney = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield transection_services_1.actionService.sendMoney(req.body, id);
    res.status(200).json({
        success: true,
        message: "success full",
        data: result
    });
}));
const cashOut = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield transection_services_1.actionService.cashOut(id, (_b = req.body) === null || _b === void 0 ? void 0 : _b.RMobileNumber, (_c = req.body) === null || _c === void 0 ? void 0 : _c.amount);
    res.status(200).json({
        success: true,
        message: "cashOut successFull",
        data: result
    });
}));
const cashIn = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const result = yield transection_services_1.actionService.cashIn(id, req.body);
    res.status(200).json({
        success: true,
        message: "cashIn successful",
        data: result
    });
}));
const AllTran = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield transection_services_1.actionService.AllTranFromDB((_a = req.params) === null || _a === void 0 ? void 0 : _a.number);
    res.status(200).json({
        success: true,
        message: "user transaction retrieved successfully",
        data: result
    });
}));
const myTran = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const result = yield transection_services_1.actionService.myTran((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, (_b = req.user) === null || _b === void 0 ? void 0 : _b.mobileNumber);
    res.status(200).json({
        success: true,
        message: "user transaction retrieved successfully",
        data: result
    });
}));
exports.actionController = {
    sendMoney,
    cashOut,
    cashIn,
    AllTran,
    myTran
};
