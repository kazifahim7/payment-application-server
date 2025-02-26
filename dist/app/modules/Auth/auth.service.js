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
exports.authService = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const auth_model_1 = __importDefault(require("./auth.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserAlreadyExist = yield auth_model_1.default.findOne({ email: payload.email });
    if (isUserAlreadyExist) {
        throw new AppError_1.default(401, "this user already exist");
    }
    if (payload.role === "user") {
        payload.balance = 40;
        payload.approval = true;
    }
    payload.pin = yield bcrypt_1.default.hash(payload.pin, Number(config_1.default.salt_round));
    const result = (yield auth_model_1.default.create(payload));
    return result;
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield auth_model_1.default.findOne({ mobileNumber: payload.mobileNumber });
    if (!isUserExist) {
        throw new AppError_1.default(404, "This user Not Found");
    }
    if (isUserExist.isBlocked) {
        throw new AppError_1.default(403, "This User is blocked");
    }
    // <- check the  password ok or not ->
    const isPassIsOk = yield bcrypt_1.default.compare(payload === null || payload === void 0 ? void 0 : payload.pin, isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.pin);
    if (!isPassIsOk) {
        throw new AppError_1.default(401, "This password  is invalid");
    }
    const user = {
        id: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist._id,
        role: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.role,
        email: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.email,
        mobileNumber: isUserExist === null || isUserExist === void 0 ? void 0 : isUserExist.mobileNumber
    };
    const token = jsonwebtoken_1.default.sign(user, config_1.default.jwt_secret, { expiresIn: "30d" });
    return {
        token
    };
});
const makeAgent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield auth_model_1.default.findById(id);
    if (!isExists) {
        throw new AppError_1.default(404, "this user not available");
    }
    const result = yield auth_model_1.default.findByIdAndUpdate(id, {
        approval: true,
        balance: 100000
    }, { new: true });
    return result;
});
const makeBlock = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield auth_model_1.default.findById(id);
    if (!isExists) {
        throw new AppError_1.default(404, "this user not available");
    }
    const result = yield auth_model_1.default.findByIdAndUpdate(id, {
        isBlocked: true
    }, { new: true });
    return result;
});
const getallUser = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const allUserQuery = new QueryBuilder_1.default(auth_model_1.default.find().select("-pin"), query).search(["mobileNumber"]);
    const result = yield allUserQuery.modelQuery;
    return result;
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_model_1.default.findById(id).select("-pin");
    return result;
});
exports.authService = {
    registerUserIntoDB,
    loginUser,
    makeAgent,
    makeBlock,
    getallUser,
    getSingleUser
};
