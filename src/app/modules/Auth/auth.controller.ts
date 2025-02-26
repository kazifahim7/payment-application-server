import catchAsync from "../../utils/catchAsync";
import { authService } from "./auth.service";

const registerUser = catchAsync(async (req, res) => {
    const result = await authService.registerUserIntoDB(req.body)
    
    res.status(200).json({
        success: true,
        message: "User registered successfully",
        data: result
    })

})
const loginUser = catchAsync(async (req, res) => {
    const result = await authService.loginUser(req.body)
    
    res.status(200).json({
        success: true,
        message: "User login successfully",
        data: result
    })

})
const makeAgent = catchAsync(async (req, res) => {
    const result = await authService.makeAgent(req.params.id)
    
    res.status(200).json({
        success: true,
        message: "Agent created  successfully",
        data: result
    })

})
const makeBlock = catchAsync(async (req, res) => {
    const result = await authService.makeBlock(req.params.id)
    
    res.status(200).json({
        success: true,
        message: "user blocked  successfully",
        data: result
    })

})
const getAlluser = catchAsync(async (req, res) => {
    const result = await authService.getallUser(req.query)
    
    res.status(200).json({
        success: true,
        message: "All user retrieved successfully",
        data: result
    })

})
const getSigleUser = catchAsync(async (req, res) => {
    const result = await authService.getSingleUser(req.params.id)
    
    res.status(200).json({
        success: true,
        message: " user retrieved successfully",
        data: result
    })

})




export const authController = {
    registerUser,
    loginUser,
    makeAgent,
    makeBlock,
    getAlluser,
    getSigleUser
}