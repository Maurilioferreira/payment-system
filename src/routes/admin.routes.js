const express = require("express");
const adminController = require('../controllers/adminController')
const router = express.Router();

router.route("/best-profession").get(adminController.profession)
router.route("/best-clients").get(adminController.clients);

module.exports = router;
