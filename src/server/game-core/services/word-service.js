module.exports = service;

function service(dbWorkService) {

    return {
        async isValid (word, category) {
            return Math.random() < 0.5;
        }
    }
    
}

