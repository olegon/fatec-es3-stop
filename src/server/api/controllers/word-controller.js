const mongoose = require('mongoose');
const Word = mongoose.model('Word');

exports.get = (req, res, next) => {
    Word
        .find({ 
            active: true 
        }, 'name letter category')
        .then(data => {
            res.status(200).send(data);    
        })
        .catch(e => {
            res.status(400).send(e);                
        });
}

exports.post = (req, res, next) => {
    var word = new Word(req.body);
    word
        .save()
        .then(x => {
            res.status(201).send({ message: "Palavra cadastrada com sucesso!" });    
        })
        .catch(e => {
            res.status(400).send({ message: "Falha ao cadastrar palavra", 
            data: e });                
        });
}

exports.put = (req, res, next) => {
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
        res.status(400).send({ message: "Falha ao atualizar palavra", 
        data: e });                
    });
}

exports.delete = (req, res, next) => {
    Word.deleteOne({ _id: req.params.id })
    .then(x => {
        res.status(200).send({ message: "Palavra removida com sucesso!" });    
    })
    .catch(e => {
        res.status(400).send({ message: "Falha ao remover palavra", 
        data: e });                
    });
}