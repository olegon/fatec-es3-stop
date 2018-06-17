module.exports = function (GameParamatersModel) {
    return {
        async getGameParamaters() {
            return await getGameParamaters(GameParamatersModel);
        },
        async setGameParameters(parameters) {
            return await setGameParameters(GameParamatersModel, parameters);
        }
    }
};

async function getGameParamaters(GameParametersModel) {
    const gameParamaters = await GameParametersModel.findOne({});
    
    if (gameParamaters == null) {
        const insertedGameParamater = await GameParametersModel.create({
            roundDuration: 60,
            maxPlayersByMatch: 6,
            roundsByMatch: 5
        });

        return insertedGameParamater;
    }
    else {
        return gameParamaters;
    }
}

async function setGameParameters(GameParametersModel, parameters) {
    return await GameParametersModel.findOneAndUpdate({}, parameters);
}
