const Questions = require("../models/Questions");
const Rooms = require("../models/Rooms");
const { callGemini } = require("../services/geminiService");

const roomController = {

    // POST: /room/
    createRoom: async (request, response) => {
        try {
            // The user ID is now available from the 'protect' middleware
            const createdBy = request.user._id;

            const code = Math.random().toString(36)
                .substring(2, 8).toUpperCase();

            const room = await Rooms.create({
                roomCode: code,
                createdBy: createdBy
            });
            
            // We can populate the createdBy field to return the user's name
            const populatedRoom = await Rooms.findById(room._id);

            response.status(201).json(populatedRoom);
        } catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    },

    // GET /room/:code
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

    // POST /room/:code/question
    createQuestion: async (request, response) => {
        try {
            const { content } = request.body;
            const { code } = request.params;

            const question = await Questions.create({
                roomCode: code,
                content: content,
                createdBy: request.user.name // Use the name from the authenticated user
            });
            const io = request.app.get("io");
            io.to(code).emit("new-question", question);

            response.status(201).json(question);
        } catch (error)
        {
            console.log(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    },

    // GET /room/:code/question
    getQuestions: async (request, response) => {
        try {
            const code = request.params.code;

            const questions = await Questions.find({ roomCode: code })
                .sort({ createdAt: -1 });

            response.json(questions);
        } catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    },

    //DeleteQuestion
    deleteQuestion: async (req, res) => {
        try {
            const { questionId } = req.params;
            const question = await Questions.findById(questionId);

            if (!question) {
                return res.status(404).json({ message: 'Question not found' });
            }

            const room = await Rooms.findOne({ roomCode: question.roomCode });

            // Authorization Check: Only the user who created the room can delete questions
            if (room.createdBy._id.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'User not authorized to delete questions in this room' });
            }
            
            await question.deleteOne();

            res.status(200).json({ message: 'Question Deleted', questionId: questionId });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    generateTopQuestions: async (request, response) => {
        try{
            const code = request.params.code;

            const questions = await Questions.find({ roomCode: code });
            if(questions.length === 0) return response.json([]);

            const topQuestions = await callGemini(questions);
            response.json(topQuestions);
        } catch(error) {
            console.log(error);
            response.status(500).json({
                message: 'Internal server error'
            });
        }
    }

};

module.exports = roomController;