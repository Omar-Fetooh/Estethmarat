import { Router } from "express";

import {
  register,
  getAllInvestors,
  getInvestor,
  updateInvestor,
  deleteInvestor,
} from "./investorController.js";

export const investorRouter = Router();

investorRouter.route("/register").post(register);
investorRouter.route("/").get(getAllInvestors);

investorRouter
  .route("/:id")
  .get(getInvestor)
  .patch(updateInvestor)
  .delete(deleteInvestor);
