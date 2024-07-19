const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

router.post("/generate-question", aiController.generateInterviewQuestions);
router.post("/get-feedback", aiController.getFeedbackOnAnswer);

module.exports = router;
