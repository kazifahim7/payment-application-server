import catchAsync from "../../utils/catchAsync";
import { actionService } from "./transection.services";

const sendMoney = catchAsync(async (req, res) => {
    const id=req.user?.id
    const result = await actionService.sendMoney(req.body,id)

    res.status(200).json({
        success:true,
        message:"success full",
        data:result
    })
})
const cashOut = catchAsync(async (req, res) => {
    const id=req.user?.id
    const result = await actionService.cashOut(id, req.body?.RMobileNumber, req.body?.amount)

    res.status(200).json({
        success:true,
        message:"cashOut successFull",
        data:result
    })
})
const cashIn = catchAsync(async (req, res) => {
    const id=req.user?.id
    const result = await actionService.cashIn(id,req.body)

    res.status(200).json({
        success:true,
        message:"cashIn successful",
        data:result
    })
})

const AllTran = catchAsync(async(req,res)=>{
    const result = await actionService.AllTranFromDB(req.params?.number)
    res.status(200).json({
        success: true,
        message: "user transaction retrieved successfully",
        data: result
    })
})
const myTran = catchAsync(async(req,res)=>{
    const result = await actionService.myTran(req.user?.id,req.user?.mobileNumber)
    res.status(200).json({
        success: true,
        message: "user transaction retrieved successfully",
        data: result
    })
})



export const actionController ={
    sendMoney,
    cashOut,
    cashIn,
    AllTran,
    myTran
}