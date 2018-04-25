const { normalizeWord } = require('./util-service');

module.exports = function (WordModel) {
    return {
        addWord: addWord.bind(this, WordModel),
    }
};

async function addWord(WordModel, word) {
    try {
        const wordToBeSaved = new WordModel({
            ...word,
            normalized_name: normalizeWord(word.name)
        });
        
        return await wordToBeSaved.save();
    }
    catch (err) {
        throw err;
    }
}
