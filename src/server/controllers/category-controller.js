'use strict'

const mongoose = require('mongoose');
const Word = mongoose.model('Word');

exports.get = (req, res, next) => {
    Word
        .distinct('category')
        .then(data => {
            res.status(200).send(data);    
        })
        .catch(e => {
            res.status(400).send(e);                
        });
}