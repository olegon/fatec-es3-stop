const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    normalized_name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
});

schema.index({ normalized_name: 1,  category: 1 }, { unique: true });

module.exports = mongoose.model('Word', schema);