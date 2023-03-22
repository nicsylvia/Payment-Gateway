import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../Utils/AsyncHandler";
import Cloud from "../Config/cloudinary";
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

// Get all gift card in the database:
export const AllGiftCards = AsyncHandler(async(
    req: Request,
    res: Response,
    next: NextFunction
) =>{
    const Giftcards = await GiftCardModels.find();

    if (!Giftcards) {
        next(new AppError({
            message: "Couldn't get all gift cards",
            httpcode: HTTPCODES.INTERNAL_SERVER_ERROR
        }))
    }

    return res.status(200).json({
        message: "Successfully got all gift cards",
        data: Giftcards
    })
})