const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    duration: {
        type: Number,
        required: true
    },
    maxPlayersByMatch: {
        type: Number,
        required: true
    },
    availableLetters: [{
        type: String,
        required: true,
        trim: true
    }]
});

module.exports = mongoose.model('GameParameters', schema);