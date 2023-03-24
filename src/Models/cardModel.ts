import mongoose from "mongoose";

interface iUser {
  title: string;
  amount: number;
  description: string;
  userName: string;
  user: {};
}

interface iUserData extends iUser, mongoose.Document {
  _id: any;
}

const cardModel = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    userName: {
      type: String,
    },
    amount: {
      type: Number,
    },
    description: {
      type: String,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

export default mongoose.model<iUserData>("products", cardModel);
