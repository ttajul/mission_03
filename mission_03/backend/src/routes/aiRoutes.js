const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/tellmeaboutyourself', aiController.tellMeAboutYourself);
router.post('/questions', aiController.interviewQuestions);
router.post('/feedback', aiController.getFeedbackOnAnswer); 

module.exports = router;