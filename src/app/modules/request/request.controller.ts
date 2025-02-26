import catchAsync from "../../utils/catchAsync";
import { requestService } from "./request.service";

const sendRequest=catchAsync(async(req,res)=>{
    const result = await requestService.sendRequestIntoDB(req.body, req.user?.mobileNumber)

    res.status(200).json({
        success:true,
        message:"Cash in request send success fully",
        data:result
    })
})
const getRequest =catchAsync(async(req,res)=>{
    const result = await requestService.getRequest(req.user?.mobileNumber)

    res.status(200).json({
        success:true,
        message:"ALL data",
        data:result
    })
})
const myRequest =catchAsync(async(req,res)=>{
    const result = await requestService.myRequest(req.user?.mobileNumber)

    res.status(200).json({
        success:true,
        message:"ALL data",
        data:result
    })
})

export const requestController={
    sendRequest,
    getRequest,
    myRequest
}