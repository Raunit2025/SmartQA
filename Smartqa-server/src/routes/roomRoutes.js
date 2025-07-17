const express = require('express');
const roomController = require('../controllers/roomController');
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware
const router = express.Router();


router.post('/', protect, roomController.createRoom); // Protect this route
router.get('/:code', roomController.getByRoomCode); // This can remain public
router.post('/:code/question', protect, roomController.createQuestion); // Protect this route
router.get('/:code/question', roomController.getQuestions); // This can remain public
router.delete("/question/:questionId", protect, roomController.deleteQuestion); // Protect this route
router.get('/:code/top-questions', protect, roomController.generateTopQuestions); // Protect this route

module.exports = router;