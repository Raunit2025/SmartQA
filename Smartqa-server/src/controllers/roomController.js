const Questions = require("../models/Questions");
const Rooms = require("../models/Rooms");

const roomController = {

    // POST: /room/
    createRoom: async (req, res) => {
        try {
            const code = Math.random().toString(36).substring(2, 8).toUpperCase();

            const room = await Rooms.create({
                roomCode: code,
                createdBy: req.user._id // User ID from auth middleware
            });

            res.json(room);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // GET: /room/:code
    getByRoomCode: async (req, res) => {
        try {
            const code = req.params.code;
            const room = await Rooms.findOne({ roomCode: code });

            if (!room) {
                return res.status(404).json({ message: 'Invalid room code' });
            }

            res.json(room);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // POST: /room/:code/question
    createQuestion: async (req, res) => {
        try {
            const { content } = req.body;
            const { code } = req.params;

            const question = await Questions.create({
                roomCode: code,
                content,
                createdBy: req.user._id // User ID from auth middleware
            });

            res.json(question);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // GET: /room/:code/question
    getQuestions: async (req, res) => {
        try {
            const code = req.params.code;
            const questions = await Questions.find({ roomCode: code }).sort({ createdAt: -1 });

            res.json(questions);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    //DeleteRoom
    deleteRoom: async (req,res) =>{
        try{
            const { roomId } = req.params;
            const room = await Rooms.findOneAndDelete({ _id: roomId, user: req.user._id });
            if(!room){
                return res.status(404).json({
                    message: 'Room is not there in database'
                });
            }
            await Questions.deleteMany({ room: roomId, user: req.user._id }); //delete related questions
            res.status(500).json({ error: err.message });
        }catch(error){
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    //DeleteQuestion
    deleteQuestion: async (req,res) =>{
        try{
            const { questionId } = req.params;
            const question = await Questions.findOneAndDelete({  _id: questionId, user: req.user._id });
            if(!question){
                return res.status(404).json({ 
                    message: 'Question not found in database'
                });
            }
            res.status(200).json({
                message: 'Question Deleted'
            });
        }catch(error){
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

module.exports = roomController;
