const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/question', aiController.generateInterviewQuestions);
router.post('/question2', aiController.interviewQuestions2);
router.post('/feedback', aiController.getFeedbackOnAnswer); 

module.exports = router;