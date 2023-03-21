import express from "express";
import { UsersLogin, UsersRegistration } from "../Controllers/UserControllers";

const UserRouter = express.Router();

UserRouter.route("/registeruser").post(UsersRegistration)
UserRouter.route("/loginuser").post(UsersLogin)


export default UserRouter;