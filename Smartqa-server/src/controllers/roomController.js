const Questions = require("../models/Questions");
const Rooms = require("../models/Rooms");

const roomController = {

    // POST: /room/
    createRoom: async (request, response) => {
        try {
            const { createdBy } = request.body;

            const code = Math.random().toString(36)
                .substring(2, 8).toUpperCase();

            const room = await Rooms.create({
                roomCode: code,
                createdBy: createdBy
            });

            response.json(room);
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
        }
    },

    // POST /room/:code/question
    createQuestion: async (request, response) => {
        try {
            const { content, createdBy } = request.body;
            const { code } = request.params;

            const question = await Questions.create({
                roomCode: code,
                content: content,
                createdBy: createdBy
            });

            response.json(question);
        } catch (error) {
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

    //DeleteRoom
    deleteRoom: async (req, res) => {
        try {
            const { roomId } = req.params;
            const room = await Rooms.findOneAndDelete({ _id: roomId, user: req.user._id });
            if (!room) {
                return res.status(404).json({
                    message: 'Room is not there in database'
                });
            }
            await Questions.deleteMany({ room: roomId, user: req.user._id }); //delete related questions
            res.status(500).json({ error: err.message });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    //DeleteQuestion
    deleteQuestion: async (req, res) => {
        try {
            const { questionId } = req.params;
            const question = await Questions.findOneAndDelete({ _id: questionId, user: req.user._id });
            if (!question) {
                return res.status(404).json({
                    message: 'Question not found in database'
                });
            }
            res.status(200).json({
                message: 'Question Deleted'
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

module.exports = roomController;
