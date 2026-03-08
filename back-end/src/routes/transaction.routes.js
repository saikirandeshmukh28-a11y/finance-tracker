const express  = require("express");
const { body } = require("express-validator");
const ctrl     = require("../controllers/transaction.controller");
const { protect }  = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");

const router = express.Router();

router.use(protect);

router.get("/",        ctrl.getAll);
router.get("/summary", ctrl.summary);
router.get("/:id",     ctrl.getOne);

router.post("/",
  [
    body("payee").trim().notEmpty().withMessage("Payee is required"),
    body("amount").isFloat({ gt: 0 }).withMessage("Amount must be greater than 0"),
    body("type").isIn(["credit","debit"]).withMessage("Type must be credit or debit"),
  ],
  validate, ctrl.create
);

router.put("/:id",    ctrl.update);
router.delete("/:id", ctrl.remove);

module.exports = router;