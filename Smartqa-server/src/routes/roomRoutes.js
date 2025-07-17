// Smartqa-server/src/routes/roomRoutes.js

const express = require('express');
const roomController = require('../controllers/roomController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/', protect, roomController.createRoom);
router.get('/:code', roomController.getByRoomCode);
router.post('/:code/question', protect, roomController.createQuestion);
router.get('/:code/question', roomController.getQuestions);
router.delete("/question/:questionId", protect, roomController.deleteQuestion);

// --- START OF ASSIGNMENT LOGIC ---
// Changed to POST as it's an action. Renamed for clarity.
router.post('/:code/summarize', protect, roomController.generateTopQuestions);
// --- END OF ASSIGNMENT LOGIC ---


module.exports = router;
