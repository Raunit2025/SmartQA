const Questions = require("../models/Questions");
const Rooms = require("../models/Rooms");

const roomController = {

    //POST: /room/
    createRoom: async (req, res) => {
        try{
            const { createdBy } = req.body;

            const code = Math.random().toString(36).substring(2, 8).toUpperCase();

            const room = await Rooms.create({
                roomCode: code,
                createdBy: createdBy
            });

            res.json(room);
        }catch(error){
            console.log(error);
            res.status(500).json({
                message: 'Internal server error'
            });
        }
    },

    //GET /room/:code
    getByRoomCode: async (req, res) => {
        try{
            const code = req.params.code;

            const room = await Rooms.findOne({ roomCode: code });
            if(!room){
                return response.status(404).json({
                    message: 'Invalid room code'
                });
            }
            res.json(room);
        } catch(error){
            console.log(error);
        }
    },
    
    //POST /room/:code/question
    createQuestion: async (req, res) =>{
        try{
            const { content, createdBy } = req.body;
            const { code } = req.params;

            const question = await Questions.create({
                roomCode: code,
                content: content,
                createdBy: createdBy
            });

            res.json(question);
        }catch(error){
            console.log(error);
            res.status(500).json({
                message: 'Internal server error '
            });
        }
    },

    //GET /room/:code/question
    getQuestions: async (req, res) =>{
        try{
            const code = req.params.code;

            const questions = await Questions.find({ roomCode: code }).sort({ createdAt: -1});

            response.json(questions);
        }catch(error){
            console.log(error);
            res.status(500).json({
                messgae: 'Internal server error '
            });
        }
    },
};

module.exports = roomController;
