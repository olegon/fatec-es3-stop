const mongoose = require('mongoose');
const GameParameters = mongoose.model('GameParameters');
const GameParametersService = require('../../services/gameparameters-service')(GameParameters);

exports.get = async (req, res, next) => {
    try {
        const gameParamaters = await GameParametersService.getGameParamaters();

        res.status(200).json(gameParamaters);
    }
    catch (err) {
        res.status(500).json(err);
    }

    next();
};

exports.put = async (req, res, next) => {
    try {
        GameParametersService.setGameParameters(req.body);

        res.status(200).json({ message: 'Parâmetros do jogo atualizados' });
    }
    catch (err) {
        res.status(500).json(err);
    }

    next();
};

