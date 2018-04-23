const mongoose = require('mongoose');
const Category = mongoose.model('Category');

exports.get = (req, res) => {
    Category
        .find({}, 'name')
        .then(data => {
            res.status(200).send(data);    
        })
        .catch(e => {
            res.status(400).send(e);                
        });
}

exports.post = (req, res) => {
    const category = new Category(req.body);

    category
        .save()
        .then(() => {
            res.status(200).send({ message: "Categoria cadastrada com sucesso!" });    
        })
        .catch(err => {
            res.status(500).send({ message: "Falha ao cadastrar categoria", 
            data: err });                
        });
}