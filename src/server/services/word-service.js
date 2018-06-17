const { normalizeWord } = require('./util-service');

module.exports = function (WordModel) {
    return {
        async addWord(word) {
            return await addWord(WordModel, word);
        },
        async findWord(word) {
            return await findWord(WordModel, word);
        }
    }
};

async function addWord(WordModel, word) {
    const wordToBeSaved = new WordModel({
        ...word,
        normalized_name: normalizeWord(word.name)
    });
    
    return await wordToBeSaved.save();
}

async function findWord(WordModel, word) {
    const normalized_name = normalizeWord(word);
    
    return await
        WorkModel
        .find({ normalized_name })
        .populate('category');
}
