const mongoose = require('mongoose');

const roomsSchema = new mongoose.Schema({
    roomCode: { type: String, required: true, unique: true },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Creates a reference to the User model
    },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

// Populate the 'createdBy' field with user's name when finding a room
roomsSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'createdBy',
        select: 'name' // Select only the name field from the User document
    });
    next();
});


module.exports = mongoose.model("Rooms", roomsSchema);