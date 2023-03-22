import mongoose, { Schema, model } from "mongoose";

import { BusinessDetails } from "../AllInterfaces/Interfaces";

import isEmail from "validator/lib/isEmail";

const BusinessSchema: Schema<BusinessDetails> = new Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [isEmail, "Please enter a valid email"],
    },
    logo: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "Please enter your Password"]
    },
    confirmPassword: {
        type: String,
        required: [true, "Please confirm your password"]
    },
    BusinessCode: {
        type: String,
        unique: true,
    },
    phoneNumber:{
        type: Number,
        required: [true, "Please enter your Phone number"]
    },
    status: {
        type: String,
        required: [true, "Please enter your status"],
        message: "You must either be a User or for Business",
        enum: ["User", "Business"],
        default: "Business"
    },
    giftCard: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "GiftCards"
    }]
},
{
    timestamps: true
});



const BusinessModels = model<BusinessDetails>("Businesses", BusinessSchema);

export default BusinessModels;