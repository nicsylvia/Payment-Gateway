import { NextFunction, Request, Response } from "express";
import UserModels from "../Models/UserModels";
import { AsyncHandler } from "../Utils/AsyncHandler";
import Cloud from "../Config/cloudinary";
import bcrypt from "bcrypt";
import { AppError, HTTPCODES } from "../Utils/AppError";
import BusinessModels from "../Models/BusinessModels";
import HistoryModels from "../Models/HistoryModels";
import { uuid } from "uuidv4";
import mongoose from "mongoose";
import GiftCardModels from "../Models/GiftCardModels";
import crypto from "crypto";

// My secret key from Kora dashboard
const secret = "sk_test_MHgGti4ajFmKnSMgymPeGH4p1hBNwJxSAWxZQwVr";

// Encrypted Key from Kora dashboard
const encrypt = "YyGQFKjiyCLnHMSzo1jmhFCkmi79iceT";

// Kora's API that we'll be hiiting on to do pay ins (zenith bank to wallet)
const urlData = "https://api.korapay.com/merchant/api/v1/charges/card";

// Function to encrypt the payment that will be coming in
function encryptAES256(encryptionKey: string, paymentData: any) {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey, iv);
  const encrypted = cipher.update(paymentData);

  const ivToHex = iv.toString("hex");
  const encryptedToHex = Buffer.concat([encrypted, cipher.final()]).toString(
    "hex"
  );

  return `${ivToHex}:${encryptedToHex}:${cipher.getAuthTag().toString("hex")}`;
}

// Users Registration:
export const UsersRegistration = AsyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { name, email, phoneNumber, username, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const findEmail = await UserModels.findOne({ email });

    if (findEmail) {
      next(
        new AppError({
          message: "User with this account already exists",
          httpcode: HTTPCODES.FORBIDDEN,
        })
      );
    }

    const Users = await UserModels.create({
      name,
      email,
      username,
      phoneNumber: "234" + phoneNumber,
      password: hashedPassword,
      confirmPassword: hashedPassword,
      status: "User",
    });

    return res.status(201).json({
      message: "Successfully created User",
      data: Users,
    });
  }
);

// Users Login:
export const UsersLogin = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const CheckEmail = await UserModels.findOne({ email });

    if (!CheckEmail) {
      next(
        new AppError({
          message: "User not Found",
          httpcode: HTTPCODES.NOT_FOUND,
        })
      );
    }

    const CheckPassword = await bcrypt.compare(password, CheckEmail!.password);

    if (!CheckPassword) {
      next(
        new AppError({
          message: "Email or password not correct",
          httpcode: HTTPCODES.CONFLICT,
        })
      );
    }

    if (CheckEmail && CheckPassword) {
      return res.status(200).json({
        message: "Login Successfull",
        data: CheckEmail,
      });
    }
  }
);

// Get a single User:
export const GetSingleUser = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const singleuser = await UserModels.findById(req.params.userID);

    if (!singleuser) {
      next(
        new AppError({
          message: "User not found",
          httpcode: HTTPCODES.NOT_FOUND,
        })
      );
    }

    return res.status(200).json({
      message: "Successfully got this single user",
      data: singleuser,
    });
  }
);

// User wants to buy a business gift card using Kora's API:
export const UserBuyAGiftCardWithKoraAPIs = AsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { amount, title } = req.body;

    const GenerateTransactionReference = uuid();

    // To get both single user and business
    const user = await UserModels.findById(req.params.userID);
    const Business = await BusinessModels.findById(req.params.businessID);
    const giftcard = await GiftCardModels.findById(req.params.giftcardID);

    if (!user && !Business && !giftcard) {
      next(
        new AppError({
          message: "Invalid Account, Does not exist",
          httpcode: HTTPCODES.NOT_FOUND,
        })
      );
    }

    // If no gift card from this business:
    if (!Business?.giftCard) {
      next(
        new AppError({
          message: `${Business?.name} does not have a gift card yet`,
          httpcode: HTTPCODES.NOT_FOUND,
        })
      );
    }

    if (user && Business) {
      // For user to make the payment from their bank to business wallet:
      const data = {
        amount: `${amount}`,
        redirect_url: "https://codelab-student.web.app",
        currency: "NGN",
        reference: `${GenerateTransactionReference}`,
        narration: "Fix Test Webhook",
        channels: ["card"],
        default_channel: "card",
        customer: {
          name: `${user?.name}`,
          email: `${user?.email}@gmail.com`,
        },
        notification_url:
          "https://webhook.site/8d321d8d-397f-4bab-bf4d-7e9ae3afbd50",
        metadata: {
          key0: "test0",
          key1: "test1",
          key2: "test2",
          key3: "test3",
          key4: "test4",
        },
      };

      // To update the balance of the business with the amount the user bought with ATM card
      await BusinessModels.findByIdAndUpdate(req.params.businessID, {
        MoneyBalance: Business?.Balance + amount,
      });
      // To generate a receipt for the business and a notification
      const BusinesstransactionHistory = await HistoryModels.create({
        message: `${user?.name} bought a gift card from your store with money worth of ${amount}`,
        transactionReference: GenerateTransactionReference,
        transactionType: "Credit",
      });

      Business?.TransactionHistory?.push(
        new mongoose.Types.ObjectId(BusinesstransactionHistory?._id)
      );
      Business.save();

      const UserTransactionHistory = await HistoryModels.create({
        message: `You bought a gift card worth ${amount} from ${Business?.name}`,
        transactionReference: GenerateTransactionReference,
        transactionType: "Debit",
      });

      user?.TransactionHistory?.push(
        new mongoose.Types.ObjectId(UserTransactionHistory?._id)
      );
      user.save();
    }
  }
);

// User wants to buy a business gift card using paying with their card:
