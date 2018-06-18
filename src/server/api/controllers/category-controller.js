const mongoose = require('mongoose');
const Category = mongoose.model('Category');
const Word = mongoose.model('Word');
const Room = mongoose.model('Room');

exports.get = (req, res) => {
    Category
        .find({}, 'name')
        .then(categories => {
            res.status(200).json(categories);    
        })
        .catch(err => {
            res.status(500).json({ message: "Falha ao buscar categorias", 
            err: err });                
        });
}

exports.post = (req, res) => {
    const category = new Category(req.body);
    
    category
        .save()
        .then(() => {
            res.status(200).json(category);    
        })
        .catch(err => {
            res.status(500).json({ message: "Falha ao cadastrar categoria", 
            err: err });                
        });
}

exports.delete = (req, res) => {
    const { id } = req.params;

    Word
    .deleteMany({ category: id })
    .then(() => 
        Room.updateMany(
            { categories: id },
            {
                $pull: { categories: id },
                active: false,
                reason: 'Uma categoria foi removida.'
            }
        )
    )
    .then(() =>
        Category
        .deleteMany({ _id: id })
    )
    .then(() => {
        res.status(200).json({ message: "Categoria removida com sucesso" });    
    })
    .catch(err => {
        res.status(500).json({ message: "Falha ao remover categoria.", 
        err: err });                
    });
}
