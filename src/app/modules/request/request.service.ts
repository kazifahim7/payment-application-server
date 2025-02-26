import AppError from "../../Errors/AppError";
import UserModel from "../Auth/auth.model";
import { TRequest } from "./request.interface";
import RequestModel from "./request.model";

const sendRequestIntoDB = async (payload: TRequest,number:string) => {
    payload.customerNumber=number

    const isUserExists= await UserModel.findOne({mobileNumber:payload.requestNumber})
    if(!isUserExists){
        throw new AppError(404,"this is user not found");
        
    }


    const result = await RequestModel.create(payload)
    return result
}
const getRequest = async (number:string) => {
   

  


    const result = await RequestModel.find({requestNumber:number})
    return result
}
const myRequest = async (number:string) => {
   

  


    const result = await RequestModel.find({customerNumber:number})
    return result
}


export const requestService = {
    sendRequestIntoDB,
    getRequest,
    myRequest
}