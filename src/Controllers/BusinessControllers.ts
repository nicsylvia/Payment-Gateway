import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../Utils/AsyncHandler";
import Cloud from "../Config/cloudinary";
import bcrypt from "bcrypt"
import otpgenerator from "otp-generator"
import { AppError, HTTPCODES } from "../Utils/AppError";
import BusinessModels from "../Models/BusinessModels";

// Users Registration:
export const BusinessRegistration = AsyncHandler(async(
    req: any,
    res: Response,
    next: NextFunction
) =>{
    const {name, email, password, confirmPassword } = req.body;

    const findEmail = await BusinessModels.findOne({ email });

    if (findEmail) {
        next(new AppError({
            message: "Business with this account already exists",
            httpcode: HTTPCODES.FORBIDDEN
        }))
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)

    const Business = await BusinessModels.create({
        name,
        email,
        password: hashedPassword,
        confirmPassword: hashedPassword,
        BusinessCode: otpgenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, digits: true, lowerCaseAlphabets : false }) ,
        status: "Business",
    })

    return res.status(201).json({
        message: "Successfully created Business",
        data: Business
    })
})

// Users Login:
export const BusinessLogin = AsyncHandler(async(
    req: Request,
    res: Response,
    next: NextFunction
) =>{
    const { email, password} = req.body;

    const CheckEmail = await BusinessModels.findOne({email})

    if (!CheckEmail) {
        next(new AppError({
            message: "Business not Found",
            httpcode: HTTPCODES.NOT_FOUND
        }))
    }

    const CheckPassword = await bcrypt.compare(password, CheckEmail!.password)

    if (!CheckPassword) {
        next(new AppError({
            message: "Email or password not correct",
            httpcode: HTTPCODES.CONFLICT
        }))
    }

    if (CheckEmail && CheckPassword) {
        return res.status(200).json({
            message: "Login Successfull",
            data: `Welcome ${CheckEmail?.name}`
        })
    }

})
