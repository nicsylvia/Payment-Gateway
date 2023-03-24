import express from "express";
import {
  checkOutToBank,
  checkOutwithCard,
  checkPayment,
  createPay,
  createUser,
  getOneUser,
  getUser,
  viewAdminPay,
  viewUserPay,
} from "../Controllers/userController";

const router = express.Router();

router.route("/").get(getUser);
router.route("/:id").get(getOneUser);
router.route("/created").post(createUser);

router.route("/create-pay/:id").post(createPay);

router.route("/view/admin").get(viewAdminPay);

router.route("/view-user/:id").get(viewUserPay);

router.route("/pay/:id").post(checkOutwithCard);
router.route("/pay-api").post(checkPayment);
router.route("/pay-out").post(checkOutToBank);

export default router;
