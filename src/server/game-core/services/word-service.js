module.exports = service;

function service(dbWordService) {

    return {
        async isValid (typedWord, category) {
            const words = await dbWordService.findWord(typedWord);

            for (let word of words) {
                if (word.active && word.category._id == category) return true;
            }

            return false;
        }
    }
    
}

