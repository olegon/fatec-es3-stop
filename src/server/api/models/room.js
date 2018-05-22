const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    categories: [
        {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Category'
        }
    ],
    active: {
        type: Boolean,
        required: true,
        default: true
    },
});

module.exports = mongoose.model('Room', schema);