"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ActionSchema = new mongoose_1.Schema({
    RMobileNumber: { type: String, required: [true, "Receiver mobile number is required"] },
    amount: { type: Number, required: [true, "Amount is required"] },
    fee: { type: Number },
    paymentStatus: { type: Boolean, default: true },
    TranId: { type: String, unique: true, sparse: true },
    senderId: { type: mongoose_1.Types.ObjectId, ref: "User" },
    receiverId: { type: mongoose_1.Types.ObjectId, ref: "User" },
    method: { type: String },
    pin: { type: String },
}, { timestamps: true });
const ActionModel = mongoose_1.default.model("Action", ActionSchema);
exports.default = ActionModel;
