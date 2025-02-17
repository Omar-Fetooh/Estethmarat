import { Router } from "express";

export const companyRouter = Router();

import {
  createCompany,
  deleteCompany,
  getAllCompanies,
  getCompany,
  updateCompany,
} from "./companyController.js";

companyRouter.route("/").get(getAllCompanies).post(createCompany);

companyRouter
  .route("/:id")
  .get(getCompany)
  .patch(updateCompany)
  .delete(deleteCompany);
