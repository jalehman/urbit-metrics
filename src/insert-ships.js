require('dotenv').config();
const ob = require('urbit-ob');
const format = require('pg-format');

const { client } = require('./db');

const TOTAL_SHIPS = 4294967295;
const BATCH_SIZE = 10000;

const insert = async (rows) => {
    const s = format('INSERT INTO ship (point, node_id) VALUES %L', rows)
    await client.query(s);
}

const run = async () => {
    console.log('starting to sync ships');

    try {
        await client.connect();

        await client.query('TRUNCATE ship');

        let rows = [];
        for (var i = 0; i <= TOTAL_SHIPS; i++) {
            var patp = ob.patp(i);
            rows.push([
                i,
                patp,
                // ob.clan(patp),
                // ob.sein(patp)
            ]);

            if (i % BATCH_SIZE === 0) {
                await insert(rows);
                rows = [];
                console.log(`${(i / TOTAL_SHIPS) * 100}% complete...`)
            }
        }

    } catch (e) {
        console.error(e);
    } finally {
        client.end();
    }
}

run();
