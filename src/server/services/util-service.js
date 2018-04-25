module.exports = {
    normalizeWord
};

function normalizeWord (word) {
    return word
    .toLowerCase()
    .replace(/[áàãâä]/g, 'a')
    .replace(/[éèẽêë]/g, 'e')
    .replace(/[íìĩîï]/g, 'i')
    .replace(/[óòõôö]/g, 'o')
    .replace(/[úùũûü]/g, 'u')
    .replace(/ç/g, 'c')
    .replace(/[^\-\ a-z]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/\ {2,}/g, ' ')
    .trim();
}
