const express = require("express");
const ctrl    = require("../controllers/goal.controller");
const { protect } = require("../middleware/auth.middleware");
const router  = express.Router();

router.use(protect);
router.get("/",              ctrl.getAll);
router.post("/",             ctrl.create);
router.put("/:id",           ctrl.update);
router.patch("/:id/deposit", ctrl.deposit);
router.delete("/:id",        ctrl.remove);

module.exports = router;