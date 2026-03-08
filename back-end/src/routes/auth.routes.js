const express  = require("express");
const { body } = require("express-validator");
const ctrl     = require("../controllers/auth.controller");
const { protect }  = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate.middleware");

const router = express.Router();

router.post("/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  ],
  validate, ctrl.register
);

router.post("/login",
  [
    body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate, ctrl.login
);

router.get("/me", protect, ctrl.getMe);

module.exports = router;