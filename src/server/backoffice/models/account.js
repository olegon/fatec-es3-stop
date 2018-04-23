const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Account = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Account', Account);