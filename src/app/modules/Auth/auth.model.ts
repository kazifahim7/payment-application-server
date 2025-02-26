import mongoose, { Schema } from "mongoose";
import { TUser } from "./auth.interface";

const UserSchema: Schema<TUser> = new Schema(
    {
        name: { type: String, required: [true, "Name is required"] },
        pin: { type: String, required: [true, "PIN is required"]},
        mobileNumber: {
            type: String,
            required: [true, "Mobile number is required"],
            unique: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
        },
        role: {
            type: String,
            enum: {
                values: ["user", "agent", "admin"],
                message: "Role must be either 'user', 'agent', or 'admin'",
            },
            required: [true, "Role is required"],
        },
        nid: { type: String, required: [true, "NID is required"] },
        balance: { type: Number, default: 0 },
        isBlocked: {
            type: Boolean,
            required: [true, "Blocked status is required"],
            default: false,
        },
        approval: {
            type: Boolean,
            required: [true, "Approval status is required"],
            default: false,
        },
    },
    { timestamps: true }
);

const UserModel = mongoose.model<TUser>("User", UserSchema);

export default UserModel;