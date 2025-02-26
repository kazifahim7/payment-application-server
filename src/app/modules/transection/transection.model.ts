import mongoose, { Schema, Types } from "mongoose";
import { TAction } from "./transection.interface";

const ActionSchema: Schema<TAction> = new Schema(
    {
        RMobileNumber: { type: String, required: [true, "Receiver mobile number is required"] },
        amount: { type: Number, required: [true, "Amount is required"] },
        fee: { type: Number },
        paymentStatus: { type: Boolean, default: true },
        TranId: { type: String, unique: true, sparse: true },
        senderId: { type: Types.ObjectId, ref: "User" },
        receiverId: { type: Types.ObjectId, ref: "User" },
        method: { type: String },
        pin: { type: String },
    },
    { timestamps: true }
);

const ActionModel = mongoose.model<TAction>("Action", ActionSchema);

export default ActionModel;