const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    category: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true
    },
    letter: {
        type: String,
        required: true,
        trim: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    }
});

module.exports = mongoose.model('Word', schema);