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
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const AppError_1 = __importDefault(require("../Errors/AppError"));
const config_1 = __importDefault(require("../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_model_1 = __importDefault(require("../modules/Auth/auth.model"));
const auth = (...roles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        //  <-get Toke->
        const token = req.headers.authorization;
        if (!token) {
            throw new AppError_1.default(401, "Authorization token missing");
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_secret);
        if (!decoded) {
            throw new AppError_1.default(401, "invalid token");
        }
        const { role, email } = decoded;
        // <- check this user exist in database
        const isExists = yield auth_model_1.default.findOne({ email: email });
        if (!isExists) {
            throw new AppError_1.default(404, "This User Not Found");
        }
        // <- this user is Blocked ->
        if (isExists.isBlocked) {
            throw new AppError_1.default(403, "This User is blocked");
        }
        if (!roles.includes(isExists === null || isExists === void 0 ? void 0 : isExists.role)) {
            throw new AppError_1.default(401, 'You are not authorized . please logIn again');
        }
        console.log("hello", role);
        if (role && !roles.includes(role)) {
            throw new AppError_1.default(401, 'You are not authorized  .please logIn again');
        }
        req.user = decoded;
        next();
    }));
};
exports.default = auth;
