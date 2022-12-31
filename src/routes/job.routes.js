const express = require("express");
const jobController = require('../controllers/jobController')
const router = express.Router();

router.route("/unpaid").get(jobController.unpaid)
router.route("/:job_id/pay").post(jobController.pay)

module.exports = router;
