module.exports = service;

function service(dbWordService) {

    return {
        async isValid (word, category) {
            const words = await dbWordService.findWord(word);
            
            return Math.random() > 0.5;
        }
    }
    
}

