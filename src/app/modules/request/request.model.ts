import mongoose, { Schema } from "mongoose";
import { TRequest } from "./request.interface";


const requestSchema = new Schema<TRequest>({
    customerNumber: {
        type: String,
        required: [true, "Customer number is required"],
    },
    requestNumber: {
        type: String,
        required: [true, "Request number is required"],
       // Ensures each request number is unique
    },
    amount: {
        type: Number,
        required: [true, "Amount is required"],
    },
    complete:{type:Boolean,default:false}
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt timestamps
});

const RequestModel = mongoose.model<TRequest>('Request', requestSchema);

export default RequestModel;