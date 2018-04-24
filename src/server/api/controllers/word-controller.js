const mongoose = require('mongoose');
const Word = mongoose.model('Word');

exports.get = (req, res) => {
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

exports.post = (req, res) => {
    const { name, category } = req.body;
    
    Word
    .findOne({ name, category })
    .then(wordFromDb => {
        if (wordFromDb == null) {
            var word = new Word(req.body);

            return word.save()
        }
        else {
            throw new Error('A palavra já está cadastrada no banco de dados.')    ;
        }
    })
    .then(x => {
        res.status(201).send({ message: "Palavra cadastrada com sucesso!" });    
    })
    .catch(e => {
        res.status(400).send({ message: "Falha ao cadastrar palavra", 
        data: e });                
    });
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
        res.status(400).send({ message: "Falha ao atualizar palavra", 
        data: e });                
    });
}

exports.delete = (req, res) => {
    Word.deleteOne({ _id: req.params.id })
    .then(x => {
        res.status(200).send({ message: "Palavra removida com sucesso!" });    
    })
    .catch(e => {
        res.status(400).send({ message: "Falha ao remover palavra", 
        data: e });                
    });
}