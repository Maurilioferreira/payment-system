const express = require("express")
const contractController = require('../controllers/contractController')
const router = express.Router()

router.route("/").get(contractController.all)
router.route("/:id").get(contractController.one)

module.exports = router;
