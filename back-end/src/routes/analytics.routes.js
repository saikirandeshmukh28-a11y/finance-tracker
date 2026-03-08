const express = require("express");
const ctrl    = require("../controllers/analytics.controller");
const { protect } = require("../middleware/auth.middleware");
const router  = express.Router();

router.use(protect);
router.get("/overview",      ctrl.overview);
router.get("/categories",    ctrl.categories);
router.get("/top-merchants", ctrl.topMerchants);
router.get("/weekly",        ctrl.weekly);

module.exports = router;