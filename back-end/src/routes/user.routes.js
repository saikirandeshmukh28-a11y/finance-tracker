const express = require("express");
const ctrl    = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");
const router  = express.Router();

router.use(protect);
router.get("/profile",         ctrl.getProfile);
router.put("/profile",         ctrl.updateProfile);
router.put("/change-password", ctrl.changePassword);

module.exports = router;