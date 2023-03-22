import express from "express";
import { BusinessLogin, BusinessRegistration, GetSingleBusinessAcount } from "../Controllers/BusinessControllers";

const BusinessRouter = express.Router();

BusinessRouter.route("/registerbusiness").post(BusinessRegistration)
BusinessRouter.route("/loginbusiness").post(BusinessLogin)
BusinessRouter.route("/getsinglebusiness/:businessID").get(GetSingleBusinessAcount)


export default BusinessRouter;