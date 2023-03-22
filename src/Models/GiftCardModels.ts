import { Schema, model } from "mongoose";

import { GiftCardDetails } from "../AllInterfaces/Interfaces";

const GiftCardSchema: Schema<GiftCardDetails> = new Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    logo: {
        type: String,
    },
    uniqueID: {
        type: String,
    },
    moneyWorth: {
        type: Number,
        required: [true, "Please enter the money worth of card"]
    }
},
{
    timestamps: true
});



const GiftCardModels = model<GiftCardDetails>("Gift Cards", GiftCardSchema);

export default GiftCardModels;