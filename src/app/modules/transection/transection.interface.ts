import { Types } from "mongoose"

export type TAction ={
    RMobileNumber:string
    amount:number,
    paymentStatus?:boolean,
    TranId?:string,
    senderId?:Types.ObjectId,
    receiverId?:Types.ObjectId,
    method:string,
    fee:number,
    pin?:string

}