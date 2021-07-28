require('dotenv').config();
const http = require('http');
const fs = require('fs');

const now = new Date();
const PATH = process.env['RADAR_ENDPOINT'];
const FILENAME = `radar.${now.toISOString()}.json`;

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
