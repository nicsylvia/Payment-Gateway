import mongoose from "mongoose";

interface iUser {
  name: string;
  email: string;
  password: string;
  product: any[];
}

interface iUserData extends iUser, mongoose.Document {}

const userModel = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },

    product: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<iUserData>("users", userModel);
