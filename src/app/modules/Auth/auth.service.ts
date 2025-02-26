import QueryBuilder from "../../builder/QueryBuilder";
import config from "../../config";
import AppError from "../../Errors/AppError";
import { TUser } from "./auth.interface";
import UserModel from "./auth.model";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const registerUserIntoDB = async (payload: TUser) => {

    const isUserAlreadyExist = await UserModel.findOne({ email: payload.email })
    if (isUserAlreadyExist) {
        throw new AppError(401, "this user already exist");

    }

    if (payload.role === "user") {
        payload.balance = 40
        payload.approval = true

    }


    payload.pin = await bcrypt.hash(payload.pin, Number(config.salt_round))

    const result = (await UserModel.create(payload))


    return result


}

const loginUser = async (payload: Pick<TUser, "mobileNumber" | "pin">) => {

    const isUserExist = await UserModel.findOne({ mobileNumber: payload.mobileNumber })
    if (!isUserExist) {
        throw new AppError(404, "This user Not Found");

    }
    if (isUserExist.isBlocked) {
        throw new AppError(403, "This User is blocked");
    }
    // <- check the  password ok or not ->
    const isPassIsOk = await bcrypt.compare(payload?.pin, isUserExist?.pin)

    if (!isPassIsOk) {
        throw new AppError(401, "This password  is invalid");
    }

    const user = {
        id: isUserExist?._id,
        role: isUserExist?.role,
        email: isUserExist?.email,
        mobileNumber: isUserExist?.mobileNumber
    }

    const token = jwt.sign(user, config.jwt_secret as string, { expiresIn: "30d" })

    return {
        token
    }



}

const makeAgent = async (id: string) => {
    const isExists = await UserModel.findById(id)
    if (!isExists) {
        throw new AppError(404, "this user not available");

    }
    const result = await UserModel.findByIdAndUpdate(id, {
        approval: true,
        balance: 100000
    }, { new: true })

    return result


}
const makeBlock = async (id: string) => {
    const isExists = await UserModel.findById(id)
    if (!isExists) {
        throw new AppError(404, "this user not available");

    }
    const result = await UserModel.findByIdAndUpdate(id, {
        isBlocked: true
    }, { new: true })

    return result


}

const getallUser = async (query: Record<string, unknown>) => {

    const allUserQuery = new QueryBuilder(UserModel.find().select("-pin"), query).search(["mobileNumber"])


    const result = await  allUserQuery.modelQuery
    return result
}
const getSingleUser = async (id: string) => {
    const result = await UserModel.findById(id).select("-pin")
    return result
}









export const authService = {
    registerUserIntoDB,
    loginUser,
    makeAgent,
    makeBlock,
    getallUser,
    getSingleUser
}