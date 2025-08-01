const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const groupCtrl = require("../controllers/groupController");


// All routes protected 
router.post("/", protect,groupCtrl.createGroup);
router.get("/", protect, groupCtrl.getMyGruops);
router.get("/:id", protect, groupCtrl.getMyGruopById);
router.put("/:id", protect, groupCtrl.updateGruop);
router.delete("/:id", protect, groupCtrl.deleteGruop);


module.exports = router;  