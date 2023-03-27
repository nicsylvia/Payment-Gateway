import mongoose from "mongoose";

const LIVE_URL =
  "mongodb+srv://sylviaDB:devsylvia@cluster0.fhx2vt1.mongodb.net/GiftCardHack?retryWrites=true&w=majority";

const db_Url = "mongodb://localhost/GiftCardHack";

export const DBCONNECTION = async () => {
  try {
    const conn = await mongoose.connect(db_Url);
    console.log("");
    console.log(`Database is connected to ${conn.connection.host}`);
  } catch (error) {
    console.log("An error occured in connecting to DB");
  }
};
