module.exports = service;

function service(dbWordService, dbSuggestedWordService) {

    return {
        async isValid (typedWord, category, letter) {
            if (typedWord == null) {
                console.log(`validation word: word ${typedWord} is null`);
                return false;
            }

            if (typeof typedWord !== 'string') {
                console.log(`validation word: word ${typedWord} isnt a string`);
                return false;
            }

            if (typedWord === '') {
                console.log(`validation word: word ${typedWord} is a empty string`);
                return false;
            }

            if (letter.toLowerCase() !== typedWord[0].toLowerCase()) {
                console.log(`validation word: word ${typedWord} doesnt start with letter ${letter}`);
                return false;
            }

            const words = await dbWordService.findWord(typedWord);

            for (let word of words) {
                if (word.active && word.category._id == category) return true;
            }

            try {
                await dbSuggestedWordService.addWord(typedWord, category);
            }
            catch (err) {
                console.error('# error while adding suggested word: ', err && err.message);
            }

            return false;
        }
    }
    
}

