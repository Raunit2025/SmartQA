// Smartqa-server/src/controllers/roomController.js

const Questions = require("../models/Questions");
const Rooms = require("../models/Rooms");
const { callGemini } = require("../services/geminiService");

const roomController = {

    // ... (createRoom, getByRoomCode, getQuestions, deleteQuestion are unchanged)
    createRoom: async (request, response) => {
        try {
            const createdBy = request.user._id;
            const code = Math.random().toString(36).substring(2, 8).toUpperCase();
            const room = await Rooms.create({ roomCode: code, createdBy: createdBy });
            const populatedRoom = await Rooms.findById(room._id);
            response.status(201).json(populatedRoom);
        } catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    },
    getByRoomCode: async (request, response) => {
        try {
            const code = request.params.code;
            const room = await Rooms.findOne({ roomCode: code });
            if (!room) {
                return response.status(404).json({ message: 'Invalid room code' });
            }
            response.json(room);
        } catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    },
    getQuestions: async (request, response) => {
        try {
            const code = request.params.code;
            const questions = await Questions.find({ roomCode: code }).sort({ createdAt: -1 });
            response.json(questions);
        } catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    },
    deleteQuestion: async (req, res) => {
        try {
            const { questionId } = req.params;
            const question = await Questions.findById(questionId);
            if (!question) {
                return res.status(404).json({ message: 'Question not found in database' });
            }
            const room = await Rooms.findOne({ roomCode: question.roomCode });
            if (!room.createdBy || room.createdBy._id.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'User not authorized to delete questions in this room' });
            }
            const roomCode = question.roomCode;
            await question.deleteOne();
            const io = req.app.get("io");
            io.to(roomCode).emit("question-deleted", questionId);
            res.status(200).json({ message: 'Question Deleted', questionId: questionId });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    // POST /room/:code/question
    createQuestion: async (request, response) => {
        try {
            const { content } = request.body;
            const { code } = request.params;
            const room = await Rooms.findOne({ roomCode: code });

            // --- START OF ASSIGNMENT LOGIC ---
            // Authorization Check: Prevent room creator from posting questions
            if (room.createdBy._id.toString() === request.user._id.toString()) {
                return response.status(403).json({ message: "Room creators cannot post questions." });
            }
            // --- END OF ASSIGNMENT LOGIC ---

            const question = await Questions.create({
                roomCode: code,
                content: content,
                createdBy: request.user.name
            });
            const io = request.app.get("io");
            io.to(code).emit("new-question", question);

            response.status(201).json(question);
        } catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    },

    // POST /room/:code/summarize
    generateTopQuestions: async (request, response) => {
        try {
            const code = request.params.code;
            const room = await Rooms.findOne({ roomCode: code });

            // --- START OF ASSIGNMENT LOGIC ---
            // Authorization Check: Only the room creator can summarize
            if (room.createdBy._id.toString() !== request.user._id.toString()) {
                return response.status(403).json({ message: "Only the room creator can summarize questions." });
            }
            
            const questions = await Questions.find({ roomCode: code });
            if (questions.length === 0) {
                return response.status(400).json({ message: "No questions to summarize." });
            }

            const topQuestions = await callGemini(questions);

            // Broadcast the summarized questions to everyone in the room
            const io = request.app.get("io");
            io.to(code).emit("top-questions-generated", topQuestions);
            // --- END OF ASSIGNMENT LOGIC ---

            response.status(200).json({ message: "Summary generated and broadcasted to all participants." });
        } catch (error) {
            console.log(error);
            response.status(500).json({
                message: 'Internal server error during summary generation.'
            });
        }
    }
};

module.exports = roomController;
