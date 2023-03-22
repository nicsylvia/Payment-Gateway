import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../Utils/AsyncHandler";
import Cloud from "../Config/cloudinary";
import bcrypt from "bcrypt"
import { AppError, HTTPCODES } from "../Utils/AppError";
import GiftCardModels from "../Models/GiftCardModels";
import BusinessModels from "../Models/BusinessModels";

// Create a gift card:
export const GenerateAGiftCard = AsyncHandler(async(
    req: Request,
    res: Response,
    next: NextFunction
) =>{
    const { moneyWorth } = req.body;

    const GetBusiness = await BusinessModels.findById(req.params.businessID);

    const GiftCard = await GiftCardModels.create({
        name: GetBusiness?.name,
        BrandLogo: GetBusiness?.logo,
        uniqueID: GetBusiness?.BusinessCode,
        moneyWorth,
    })
    
    return res.status(200).json({
        message: `Gift card for ${GetBusiness?.name} successfully generated`,
        data: GiftCard
    })
})