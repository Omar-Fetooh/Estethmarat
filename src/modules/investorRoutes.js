const express = require('express');
const investorController = require('./../controllers/investorController');
const router = express.Router();

router.route('/register').post(investorController.register);
router.route('/').get(investorController.getAllInvestors);

router
  .route('/:id')
  .get(investorController.getInvestor)
  .patch(investorController.updateInvestor)
  .delete(investorController.deleteInvestor);

module.exports = router;
