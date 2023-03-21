import express from "express";
import { BusinessLogin, BusinessRegistration } from "../Controllers/BusinessControllers";

const UserRouter = express.Router();

UserRouter.route("/registerbusiness").post(BusinessRegistration)
UserRouter.route("/loginbusiness").post(BusinessLogin)


export default UserRouter;