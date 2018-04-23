const mongoose = require('mongoose');
const GameParameters = mongoose.model('GameParameters');

exports.get = async (req, res,  next) => {
    try {
        const gameParamaters = await GameParameters.findOne({});

        if (gameParamaters == null) {
            const insertedGameParamater = await GameParameters.create({
                duration: 60,
                maxPlayersByMatch: 5,
                availableLetters: [ 'a', 'b' ]
            });

            res.status(200).json(insertedGameParamater);
        }
        else {
            res.status(200).json(gameParamaters);
        }

        done();
    }
    catch (err) {
        res.status(500).json(err);
        
        done(err);
    }
};

exports.put = async (req, res, next) => {
    try {
        const gameParameters = await GameParameters.findOneAndUpdate({}, req.body);

        res.status(200).json({ message: 'Parâmetros do jogo atualizados' });

        done();
    }
    catch (err) {
        res.status(500).json(err);

        done(err);
    }
};

