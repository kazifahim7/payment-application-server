import mongoose from "mongoose";
import AppError from "../../Errors/AppError";
import UserModel from "../Auth/auth.model";
import { TAction } from "./transection.interface";
import ActionModel from "./transection.model";

import bcrypt from 'bcrypt'
import RequestModel from "../request/request.model";

const sendMoney = async (payload: TAction, id: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        let fee: number;
        const sender = await UserModel.findById(id).session(session);
        if (!sender) throw new AppError(404, "Sender not found");

        if (sender.isBlocked) {
            throw new AppError(401, "You are blocked");
        }

        const receiver = await UserModel.findOne({ mobileNumber: payload.RMobileNumber }).session(session);
        if (!receiver || receiver.isBlocked) {
            throw new AppError(401, "Receiver is unauthorized");
        }

        if (payload.amount < 50) {
            throw new AppError(401, "Minimum send amount is 50 taka");
        }

        fee = payload.amount > 100 ? 5 : 0;

        // Ensure sender has enough balance
        if (sender.balance! < payload.amount + fee) {
            throw new AppError(400, "Insufficient balance");
        }


        payload.TranId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

        // Update balances
        sender.balance! -= payload.amount + fee;
        receiver.balance! += payload.amount;

        await sender.save({ session });
        await receiver.save({ session });

        // Update admin balance
        const admin = await UserModel.findOne({ role: "admin" }).session(session);
        if (admin) {
            admin.balance! += fee;
            await admin.save({ session });
        }

        // Save transaction in DB
        const transactionData = {
            ...payload,
            senderId: sender._id,
            receiverId: receiver._id,
            method: "Send Money",
            paymentStatus: true,
            fee
        };
        const result = await ActionModel.create([transactionData], { session });


        await session.commitTransaction();
        session.endSession();

        return result

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw new AppError(500, "Transaction failed");
    }
};




const cashOut = async (userId: string, agentMobile: string, amount: number) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const user = await UserModel.findById(userId).session(session).exec();
        if (!user) throw new AppError(404, "User not found");
        if (user.isBlocked) throw new AppError(403, "Your account is blocked");
        if ((user.balance ?? 0) < amount * 1.015) throw new AppError(400, "Insufficient balance");

        if (amount < 50) throw new AppError(400, "Minimum cash-out amount is 50 Taka");


        const agent = await UserModel.findOne({ mobileNumber: agentMobile, role: "agent" })
            .session(session)
            .exec();
        if (!agent) throw new AppError(404, "Agent not found");
        if (agent.isBlocked) throw new AppError(403, "Agent account is blocked");

        //  Calculate Fees
        const fee = amount * 0.015;
        const agentIncome = amount * 0.01;
        const adminIncome = amount * 0.005;

        //  Deduct from User
        user.balance = (user.balance ?? 0) - (amount + fee);
        await user.save();

        //  Add to Agent
        agent.balance = (agent.balance ?? 0) + amount + agentIncome;
        await agent.save();

        //  Update Admin Balance
        const admin = await UserModel.findOne({ role: "admin" }).session(session).exec();
        if (admin) {
            admin.balance = (admin.balance ?? 0) + adminIncome;
            await admin.save();
        }
        const TranId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`

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

        const res = await ActionModel.insertOne(transactionData, { session });



        await session.commitTransaction();
        session.endSession();

        return res;

    } catch (error: any) {
        await session.abortTransaction();
        session.endSession();
        throw new AppError(500, `${error.message}`);
    }
};


const cashIn = async (id: string, payload: TAction) => {
    try {
        // Fetch user
        const user = await UserModel.findById(id);
        if (!user) throw new AppError(404, "User not found");
        if (user.isBlocked) throw new AppError(403, "Your account is blocked");
        if (user.balance! < payload.amount) throw new AppError(400, "Insufficient balance");

        // Check password
        const isPassIsOk = await bcrypt.compare(payload.pin!, user.pin);
        if (!isPassIsOk) {
            throw new AppError(401, "This password is invalid");
        }

        // Fetch customer
        const customer = await UserModel.findOne({ mobileNumber: payload.RMobileNumber });
        if (!customer) throw new AppError(404, "Customer not found");
        if (customer.isBlocked) throw new AppError(403, "Customer account is blocked");

        // Update user balance
        await UserModel.findByIdAndUpdate(user._id, { balance: user.balance! - payload.amount }, { new: true });

        // Update customer balance
        await UserModel.findByIdAndUpdate(customer._id, { balance: customer.balance! + payload.amount }, { new: true });

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
        const res = await ActionModel.insertOne(transactionData);
        if (!res) {
            throw new AppError(500, "Transaction could not be completed");
        }

        // Update complete status based on the transaction
        const updateStatus = await RequestModel.findOneAndUpdate(
            { customerNumber: payload.RMobileNumber },
            { complete: true },
            { new: true }
        );

        if (!updateStatus) {
            throw new AppError(500, "Transaction status could not be updated");
        }

        return res;

    } catch (error: any) {
        throw new AppError(500, error.message);
    }
}

const AllTranFromDB = async (number: string) => {

    const result = await ActionModel.find({ RMobileNumber: number }).populate("senderId").populate("receiverId")
    return result
}
const myTran = async (id: string,number:string) => {

    const result = await ActionModel.find({$or:[
        { senderId: id },
        {RMobileNumber:number}
    ]}).populate("senderId").populate("receiverId")
    return result
}





export const actionService = {
    sendMoney,
    cashOut,
    cashIn,
    AllTranFromDB,
    myTran
}