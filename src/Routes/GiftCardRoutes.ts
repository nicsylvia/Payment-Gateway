import express from "express";
import { GenerateAGiftCard } from "../Controllers/GiftCardController";

const GiftCardRoutes = express.Router();

GiftCardRoutes.route("generateyourgiftcard/:businessID").post(GenerateAGiftCard)

export default GiftCardRoutes