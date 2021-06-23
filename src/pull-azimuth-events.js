const https = require('https');
const fs = require('fs');

// This is to make our request insecure, which is okay because we trust this
// endpoint.
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const AZIMUTH_EVENTS = "https://azimuth.network/stats/events.txt";
const FILENAME = "events.txt";

const file = fs.createWriteStream(FILENAME);
console.log(`<- pulling events from ${AZIMUTH_EVENTS}...`);

const request = https.get(AZIMUTH_EVENTS, (res) => {
    console.log('request successful.');

    console.log('writing file...');
    res.pipe(file);
    file.on('finish', () => {
        file.close();
        console.log('-> done!')
    });
}).on('error', (e) => {
    fs.unlink(FILENAME);
    console.error(e);
});
