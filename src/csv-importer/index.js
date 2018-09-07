const fs = require('fs');
const fetch = require('node-fetch');
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const baseUrl = 'http://localhost:3000';

processFiles([
    'Animal.csv',
    'Cor.csv',
    'Fruta.csv',
    'Instrumento.csv',
    'País.csv',
    'Pokémon.csv',
    'Profissão.csv'
]);

async function processFiles(files) {
    const categoryResponse = await fetch(`${baseUrl}/api/category`, {
        headers: {
            'Content-Type': 'application/json',
            'Cookie': 'userName=Leandico'
        }
    });
    const categories = await categoryResponse.json();

    for (let filename of files) {
        const regexResult = /(.*?)\.csv/.exec(filename);

        if (regexResult == null) {
            console.error(`Falha ao extrair dados do nome do arquivo ${filename}`);
        }
        else {
            const [, categoryName ] = regexResult;

            const category = categories.find(category => category.name == categoryName);

            if (category != null) {
                await processCategory(category._id, filename);
            }
            else {
                const categoryResponse = await fetch(`${baseUrl}/api/category`, {
                    method: 'POST',
                    body: JSON.stringify({
                        name: categoryName
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': 'userName=Leandico'
                    }
                });

                const categoryJsonResponse = await categoryResponse.json();

                console.log(categoryJsonResponse);

                await processCategory(categoryJsonResponse._id, filename);
            }
        }
    }
}

async function processCategory(categoryId, filename) {
    const contents = await readFileAsync(filename, 'utf8');
    const lines = contents.split('\n').filter(line => line.trim() !== '');

    for (let line of lines) {
        const [ , word ] = line.split(',');
        
        try {
            const wordResponse = await fetch(`${baseUrl}/api/words`, {
                method: 'POST',
                body: JSON.stringify({
                    name: word,
                    category: categoryId
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': 'userName=Leandico'
                }
            });

            const wordJsonResponse = await wordResponse.json();

            console.log(wordJsonResponse);
        }
        catch (err) {
            console.log(err);
        }
    }
}