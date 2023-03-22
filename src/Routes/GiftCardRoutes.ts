import express from "express";
import { AllGiftCards, GenerateAGiftCard } from "../Controllers/GiftCardController";

const GiftCardRoutes = express.Router();

GiftCardRoutes.route("generateyourgiftcard/:businessID").post(GenerateAGiftCard)
GiftCardRoutes.route("/getallgiftcards").get(AllGiftCards)

export default GiftCardRoutes