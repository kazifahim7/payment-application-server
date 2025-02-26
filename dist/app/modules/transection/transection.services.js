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
exports.actionService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../Errors/AppError"));
const auth_model_1 = __importDefault(require("../Auth/auth.model"));
const transection_model_1 = __importDefault(require("./transection.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const request_model_1 = __importDefault(require("../request/request.model"));
const sendMoney = (payload, id) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        let fee;
        const sender = yield auth_model_1.default.findById(id).session(session);
        if (!sender)
            throw new AppError_1.default(404, "Sender not found");
        if (sender.isBlocked) {
            throw new AppError_1.default(401, "You are blocked");
        }
        const receiver = yield auth_model_1.default.findOne({ mobileNumber: payload.RMobileNumber }).session(session);
        if (!receiver || receiver.isBlocked) {
            throw new AppError_1.default(401, "Receiver is unauthorized");
        }
        if (payload.amount < 50) {
            throw new AppError_1.default(401, "Minimum send amount is 50 taka");
        }
        fee = payload.amount > 100 ? 5 : 0;
        // Ensure sender has enough balance
        if (sender.balance < payload.amount + fee) {
            throw new AppError_1.default(400, "Insufficient balance");
        }
        payload.TranId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        // Update balances
        sender.balance -= payload.amount + fee;
        receiver.balance += payload.amount;
        yield sender.save({ session });
        yield receiver.save({ session });
        // Update admin balance
        const admin = yield auth_model_1.default.findOne({ role: "admin" }).session(session);
        if (admin) {
            admin.balance += fee;
            yield admin.save({ session });
        }
        // Save transaction in DB
        const transactionData = Object.assign(Object.assign({}, payload), { senderId: sender._id, receiverId: receiver._id, method: "Send Money", paymentStatus: true, fee });
        const result = yield transection_model_1.default.create([transactionData], { session });
        yield session.commitTransaction();
        session.endSession();
        return result;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(500, "Transaction failed");
    }
});
const cashOut = (userId, agentMobile, amount) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const user = yield auth_model_1.default.findById(userId).session(session).exec();
        if (!user)
            throw new AppError_1.default(404, "User not found");
        if (user.isBlocked)
            throw new AppError_1.default(403, "Your account is blocked");
        if (((_a = user.balance) !== null && _a !== void 0 ? _a : 0) < amount * 1.015)
            throw new AppError_1.default(400, "Insufficient balance");
        if (amount < 50)
            throw new AppError_1.default(400, "Minimum cash-out amount is 50 Taka");
        const agent = yield auth_model_1.default.findOne({ mobileNumber: agentMobile, role: "agent" })
            .session(session)
            .exec();
        if (!agent)
            throw new AppError_1.default(404, "Agent not found");
        if (agent.isBlocked)
            throw new AppError_1.default(403, "Agent account is blocked");
        //  Calculate Fees
        const fee = amount * 0.015;
        const agentIncome = amount * 0.01;
        const adminIncome = amount * 0.005;
        //  Deduct from User
        user.balance = ((_b = user.balance) !== null && _b !== void 0 ? _b : 0) - (amount + fee);
        yield user.save();
        //  Add to Agent
        agent.balance = ((_c = agent.balance) !== null && _c !== void 0 ? _c : 0) + amount + agentIncome;
        yield agent.save();
        //  Update Admin Balance
        const admin = yield auth_model_1.default.findOne({ role: "admin" }).session(session).exec();
        if (admin) {
            admin.balance = ((_d = admin.balance) !== null && _d !== void 0 ? _d : 0) + adminIncome;
            yield admin.save();
        }
        const TranId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        //  Save Transaction
        const transactionData = {
            RMobileNumber: agentMobile,
            amount: amount,
            fee: fee,
            paymentStatus: true,
            TranId,
            senderId: user._id,
            receiverId: agent._id,
            method: "Cash-Out"
        };
        const res = yield transection_model_1.default.insertOne(transactionData, { session });
        yield session.commitTransaction();
        session.endSession();
        return res;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw new AppError_1.default(500, `${error.message}`);
    }
});
const cashIn = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch user
        const user = yield auth_model_1.default.findById(id);
        if (!user)
            throw new AppError_1.default(404, "User not found");
        if (user.isBlocked)
            throw new AppError_1.default(403, "Your account is blocked");
        if (user.balance < payload.amount)
            throw new AppError_1.default(400, "Insufficient balance");
        // Check password
        const isPassIsOk = yield bcrypt_1.default.compare(payload.pin, user.pin);
        if (!isPassIsOk) {
            throw new AppError_1.default(401, "This password is invalid");
        }
        // Fetch customer
        const customer = yield auth_model_1.default.findOne({ mobileNumber: payload.RMobileNumber });
        if (!customer)
            throw new AppError_1.default(404, "Customer not found");
        if (customer.isBlocked)
            throw new AppError_1.default(403, "Customer account is blocked");
        // Update user balance
        yield auth_model_1.default.findByIdAndUpdate(user._id, { balance: user.balance - payload.amount }, { new: true });
        // Update customer balance
        yield auth_model_1.default.findByIdAndUpdate(customer._id, { balance: customer.balance + payload.amount }, { new: true });
        const TranId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        // Save Transaction
        const transactionData = {
            RMobileNumber: payload.RMobileNumber,
            amount: payload.amount,
            fee: 0,
            paymentStatus: true,
            TranId,
            senderId: user._id,
            receiverId: customer._id,
            method: "Cash-in"
        };
        // Ensure the transaction is saved
        const res = yield transection_model_1.default.insertOne(transactionData);
        if (!res) {
            throw new AppError_1.default(500, "Transaction could not be completed");
        }
        // Update complete status based on the transaction
        const updateStatus = yield request_model_1.default.findOneAndUpdate({ customerNumber: payload.RMobileNumber }, { complete: true }, { new: true });
        if (!updateStatus) {
            throw new AppError_1.default(500, "Transaction status could not be updated");
        }
        return res;
    }
    catch (error) {
        throw new AppError_1.default(500, error.message);
    }
});
const AllTranFromDB = (number) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transection_model_1.default.find({ RMobileNumber: number }).populate("senderId").populate("receiverId");
    return result;
});
const myTran = (id, number) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield transection_model_1.default.find({ $or: [
            { senderId: id },
            { RMobileNumber: number }
        ] }).populate("senderId").populate("receiverId");
    return result;
});
exports.actionService = {
    sendMoney,
    cashOut,
    cashIn,
    AllTranFromDB,
    myTran
};
