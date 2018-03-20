module.exports = service;

function service() {
    
    return {
        isName (word) {
            return Math.random() < 0.5;
        },
        
        isFruit (word) {
            return Math.random() < 0.5;
        },

        isColor (word) {
            return Math.random() < 0.5;
        }
    }
    
}

