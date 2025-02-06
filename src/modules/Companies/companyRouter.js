import { Router } from "express";
import {
  login,
  forgotPassword,
  resetPassword,
  logout,
} from "../authController.js";
export const companyRouter = Router();

import {
  createCompany,
  deleteCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
} from "./companyController.js";
companyRouter.post("/login", login);
companyRouter.post("/forgotPassword", forgotPassword);
companyRouter.patch("/resetPassword/:token", resetPassword);
companyRouter.get("/logout", logout);
companyRouter.route("/").get(getAllCompanies).post(createCompany);
companyRouter
  .route("/:id")
  .get(getCompany)
  .patch(updateCompany)
  .delete(deleteCompany);
