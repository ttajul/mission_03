const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.get('/story', aiController.generateStory); 

module.exports = router;