const mongoose = require('mongoose');
const GameParameters = mongoose.model('GameParameters');

exports.get = async (req, res, next) => {
    try {
        const gameParamaters = await GameParameters.findOne({});
        
        if (gameParamaters == null) {
            const insertedGameParamater = await GameParameters.create({
                roundDuration: 60,
                maxPlayersByMatch: 6,
                roundsByMatch: 5
            });

            res.status(200).json(insertedGameParamater);
        }
        else {
            res.status(200).json(gameParamaters);
        }
    }
    catch (err) {
        res.status(500).json(err);
    }

    next();
};

exports.put = async (req, res, next) => {
    try {
        const gameParameters = await GameParameters.findOneAndUpdate({}, req.body);

        res.status(200).json({ message: 'Parâmetros do jogo atualizados' });
    }
    catch (err) {
        res.status(500).json(err);
    }

    next();
};

