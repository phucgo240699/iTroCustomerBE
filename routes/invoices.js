const router = require("express").Router();

const invoicesController = require("../controllers/invoices");

router.get("/", invoicesController.getAll);

module.exports = router;
