require('dotenv').config();
const http = require('http');
const fs = require('fs');

const PATH = 'http://35.247.74.19:8080/~radar.json';
const FILENAME = 'radar.json';

const file = fs.createWriteStream(FILENAME);
console.log(`<- pulling radar results from ${PATH}...`);

const request = http.get(PATH, (res) => {
    console.log('request successful.')
    res.pipe(file);
    file.on('finish', () => {
        file.close();
        console.log('-> done!');
    });
}).on('error', (e) => {
    fs.unlink(FILENAME);
    console.error(e);
})
