const mongoose = require('mongoose');
const Word = mongoose.model('Word');
const WordService = require('../../services/word-service')(Word);

exports.get = (req, res) => {
    Word
    .find({ 
        active: true 
    })
    .populate('category')
    .then(data => {
        res.status(200).send(data);    
    })
    .catch(e => {
        res.status(500).send(e);                
    });
}

exports.post = async (req, res, next) => {
    try {
        const savedWord = await WordService.addWord(req.body);
        res.status(200).json(savedWord);
        next();
    }
    catch (err) {
        res.status(500).json(err);
        next(err);
    }
}

exports.put = (req, res) => {
    Word.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            letter: req.body.letter,
            category: req.body.category
        }
    }).then(x => {
        res.status(200).send({ message: "Palavra atualizada com sucesso!" });    
    })
    .catch(e => {
        res.status(500).send({ message: "Falha ao atualizar palavra", 
        data: e });                
    });
}

exports.delete = (req, res) => {
    Word.deleteOne({ _id: req.params.id })
    .then(x => {
        res.status(200).send({ message: "Palavra removida com sucesso!" });    
    })
    .catch(e => {
        res.status(500).send({ message: "Falha ao remover palavra", 
        data: e });                
    });
}