const express = require("express");
const Router = express.Router();
const companyController = require("./../controllers/companyController");
Router.route("/")
  .get(companyController.getAllCompanies)
  .post(companyController.createCompany);
Router.route("/:id")
  .get(companyController.getCompany)
  .patch(companyController.updateCompany)
  .delete(companyController.deleteCompany);
module.exports = Router;
