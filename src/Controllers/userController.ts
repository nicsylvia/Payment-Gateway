import { json, Request, Response } from "express";
import axios from "axios";
import mongoose from "mongoose";
import cardModel from "../Models/cardModel";
import userModel from "../Models/userModel";
import { AppError, HTTPCODES } from "../Utils/AppError";
import { AsyncHandler } from "../Utils/AsyncHandler";
import { uuid } from "uuidv4";
import crypto from "crypto";

export const createUser = AsyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    const user = await userModel.create({ email, name, password });

    return res.status(HTTPCODES.CREATED).json({
      message: "success",
      data: user,
    });
  } catch (err) {
    new AppError({
      message: `Account cannot be created`,
      httpcode: HTTPCODES.BAD_REQUEST,
      name: "created Error",
      isOperational: false,
    });
  }
});

export const getUser = AsyncHandler(async (req: Request, res: Response) => {
  try {
    const user = await userModel.find();

    return res.status(HTTPCODES.OK).json({
      message: "success",
      data: user,
    });
  } catch (err) {
    new AppError({
      message: `Account cannot be created`,
      httpcode: HTTPCODES.BAD_REQUEST,
      name: "created Error",
      isOperational: false,
    });
  }
});

export const getOneUser = AsyncHandler(async (req: Request, res: Response) => {
  try {
    const user = await userModel.findById(req.params.id);
    return res.status(HTTPCODES.OK).json({
      message: "success",
      data: user,
    });
  } catch (err) {
    new AppError({
      message: `Account cannot be created`,
      httpcode: HTTPCODES.BAD_REQUEST,
      name: "created Error",
      isOperational: false,
    });
  }
});

export const createPay = AsyncHandler(async (req: Request, res: Response) => {
  try {
    const { amount, title, description } = req.body;

    const getUser = await userModel.findById(req.params.id);

    const createPayment: any = await cardModel.create({
      amount,
      title,
      description,
      userName: getUser?.name,
      user: getUser?._id,
    });

    getUser?.product?.push(new mongoose.Types.ObjectId(createPayment?._id));
    getUser!.save();

    return res.status(HTTPCODES.OK).json({
      message: "success",
      data: createPayment,
    });
  } catch (err) {
    new AppError({
      message: `Account cannot be created`,
      httpcode: HTTPCODES.BAD_REQUEST,
      name: "created Error",
      isOperational: false,
    });
  }
});

export const viewAdminPay = async (req: Request, res: Response) => {
  try {
    const getUser = await cardModel.find();

    return res.status(HTTPCODES.OK).json({
      message: "success",
      data: getUser,
    });
  } catch (err) {
    new AppError({
      message: `Account cannot be created`,
      httpcode: HTTPCODES.BAD_REQUEST,
      name: "created Error",
      isOperational: false,
    });
  }
};

export const viewUserPay = AsyncHandler(async (req: Request, res: Response) => {
  try {
    console.log("data");
    const getUser = await userModel.findById(req.params.id).populate({
      path: "product",
      options: {
        sort: {
          createdAt: -1,
        },
      },
    });

    console.log("data: ", getUser);
    return res.status(HTTPCODES.OK).json({
      message: "success",
      data: getUser,
    });
  } catch (err) {
    new AppError({
      message: `Account cannot be created`,
      httpcode: HTTPCODES.BAD_REQUEST,
      name: "created Error",
      isOperational: false,
    });
  }
});

const secret = "sk_test_MHgGti4ajFmKnSMgymPeGH4p1hBNwJxSAWxZQwVr";
const urlData = "https://api.korapay.com/merchant/api/v1/charges/card";
const encrypt = "YyGQFKjiyCLnHMSzo1jmhFCkmi79iceT";

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

export const checkOutwithCard = async (req: Request, res: Response) => {
  try {
    const { amount, title, description } = req.body;

    const user = await userModel.findById(req.params.id);

    console.log(user);

    const data = {
      amount: `${amount}`,
      redirect_url: "https://codelab-student.web.app",
      currency: "NGN",
      reference: `${uuid()}`,
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

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.korapay.com/merchant/api/v1/charges/initialize",
      headers: {
        Authorization: `Bearer ${secret}`,
      },
      data: data,
    };
    // res.end();
    await axios(config)
      .then(async function (response) {
        const getUser = await userModel.findById(req.params.id);

        const createPayment: any = await cardModel.create({
          amount,
          title,
          description,
          userName: getUser?.name,
          user: getUser?._id,
        });

        getUser?.product?.push(new mongoose.Types.ObjectId(createPayment?._id));
        getUser!.save();

        return res.status(HTTPCODES.OK).json({
          message: "success",
          data: {
            paymentInfo: createPayment,
            paymentData: JSON.parse(JSON.stringify(response.data)),
          },
        });

        // return res.status(201).json({
        //   message: "done",
        //   data: JSON.parse(JSON.stringify(response.data)),
        // });
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};

export const checkPayment = async (req: Request, res: Response) => {
  try {
    // name: "Test Cards",
    // number: "5188513618552975",
    // cvv: "123",
    // expiry_month: "09",
    // expiry_year: "30",
    // pin: "1234",

    const {
      amount,
      name,
      number,
      cvv,
      pin,
      expiry_year,
      expiry_month,
      title,
      description,
    } = req.body;

    const paymentData = {
      reference: uuid(), // must be at least 8 chara
      card: {
        name,
        number,
        cvv,
        pin,
        expiry_year,
        expiry_month,
      },
      amount,
      currency: "NGN",
      redirect_url: "https://merchant-redirect-url.com",
      customer: {
        name: "John Doe",
        email: "johndoe@korapay.com",
      },
      metadata: {
        internalRef: "JD-12-67",
        age: 15,
        fixed: true,
      },
    };

    const stringData = JSON.stringify(paymentData);
    const bufData = Buffer.from(stringData, "utf-8");
    const encryptedData = encryptAES256(encrypt, bufData);

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: urlData,
      headers: {
        Authorization: `Bearer ${secret}`,
      },
      data: {
        charge_data: `${encryptedData}`,
      },
    };

    axios(config)
      .then(async function (response) {
        const getUser = await userModel.findById(req.params.id);

        const createPayment: any = await cardModel.create({
          amount,
          title,
          description,
          userName: getUser?.name,
          user: getUser?._id,
        });

        getUser?.product?.push(new mongoose.Types.ObjectId(createPayment?._id));
        getUser!.save();

        return res.status(HTTPCODES.OK).json({
          message: "success",
          data: {
            paymentInfo: createPayment,
            paymentData: JSON.parse(JSON.stringify(response.data)),
          },
        });

        // return res.status(201).json({
        //   message: "done",
        //   data: JSON.parse(JSON.stringify(response.data)),
        // });
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};

export const checkOutToBank = async (req: Request, res: Response) => {
  try {
    const {
      amount,
      name,
      number,
      cvv,
      pin,
      expiry_year,
      expiry_month,
      title,
      description,
    } = req.body;

    var data = JSON.stringify({
      reference: uuid(),
      destination: {
        type: "bank_account",
        amount: "1000000",
        currency: "NGN",
        narration: "Test Transfer Payment",
        bank_account: {
          bank: "033",
          account: "0000000000",
        },
        customer: {
          name: "John Doe",
          email: "johndoe@korapay.com",
        },
      },
    });

    var config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.korapay.com/merchant/api/v1/transactions/disburse",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secret}`,
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        return res.status(201).json({
          message: "success",
          data: JSON.parse(JSON.stringify(response.data)),
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (error) {
    console.log(error);
  }
};
