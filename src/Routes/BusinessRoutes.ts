import express from "express";
import { BusinessLogin, BusinessRegistration } from "../Controllers/BusinessControllers";

const BusinessRouter = express.Router();

BusinessRouter.route("/registerbusiness").post(BusinessRegistration)
BusinessRouter.route("/loginbusiness").post(BusinessLogin)


export default BusinessRouter;