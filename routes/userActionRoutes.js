const express = require("express");
const router = express.Router();
const { logUserAction, getUserActions,getPendingAstroRequests,getCompletedAstroRequests,updateAstroRequestStatus } = require("../controllers/userActionController");


router.post("/log/:astroId/:userId", logUserAction);


router.get("/", getUserActions);

router.get("/astro-requests/pending", getPendingAstroRequests);  
router.get("/astro-requests/completed", getCompletedAstroRequests);
router.put("/astro-requests/update/:adminId/:action_id", updateAstroRequestStatus);
module.exports = router;



