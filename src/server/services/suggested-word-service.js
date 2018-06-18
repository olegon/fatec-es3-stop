const { normalizeWord } = require('./util-service');

module.exports = function (SuggestedWord) {
    return {
        async addWord(word, category) {
            return await addWord(SuggestedWord, word, category);
        }
    }
};

async function addWord(SuggestedWord, word, categoryId) {
    const wordToBeSaved = new SuggestedWord({
        name: word,
        category: categoryId,
        normalized_name: normalizeWord(word)
    });

    return await wordToBeSaved.save();
}
