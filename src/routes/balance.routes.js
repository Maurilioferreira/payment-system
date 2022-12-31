const express = require("express");
const balanceController = require('../controllers/balanceController')
const router = express.Router();

router.route("/deposit/:userId").post(balanceController.deposit);

module.exports = router;
