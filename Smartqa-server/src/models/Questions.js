const mongoose = require('mongoose');

const questionsSchema = new mongoose.Schema({
    roomCode: { type: String, required: true },
    content: { type: String, required: true },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Questions", questionsSchema);
