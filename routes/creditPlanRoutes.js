const express = require("express");
const { addCreditPlan,getAllCreditPlans,updateCreditPlan,deleteCreditPlan,getCreditPaymentStatus  } = require("../controllers/creditPlanController");

const router = express.Router();

router.post("/add/:adminId", addCreditPlan); 

router.get("/", getAllCreditPlans); 
router.put("/:id", updateCreditPlan); 
router.delete("/:id", deleteCreditPlan);

router.get("/payment-status/:order_id",getCreditPaymentStatus )

module.exports = router;
