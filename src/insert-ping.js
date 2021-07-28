require('dotenv').config();
const format = require('pg-format');
const fs = require('fs');
const yargs = require('yargs');

const { client  } = require('./db');

const RADAR_FILE = 'radar.json';

const LATEST_PINGS = `
    SELECT DISTINCT ON (node_id)
        node_id,
        ping
    FROM
        ping
    ORDER BY
        node_id, ping DESC;
`;

const insert = async (rows) => {
    const s = format('INSERT INTO ping (node_id, ping, response, hash) VALUES %L', rows)
    return await client.query(s);
}

const takeWhile = (array, pred) => {
    const acc = [];
    for (let i = 0; i< array.length; i++) {
        if (!pred(array[i])) {
            return acc;
        }
        acc.push(array[i]);
    }
    return acc;
}

const run = async (filename) => {
    const file = fs.readFileSync(filename, 'utf8');
    const data = JSON.parse(file);

    try {
        await client.connect();

        const result = await client.query(LATEST_PINGS);
        const mostRecentPings = result.rows.reduce((acc, { node_id, ping }) => {
            return { ...acc, [node_id]: ping }
        }, {})


        let rows = [];
        for (const [ship, pings] of Object.entries(data)) {
            const mostRecentPing = mostRecentPings[ship];
            const newPings = !mostRecentPing ?
                  pings :
                  takeWhile(pings, ({ ping }) => ping > mostRecentPing );

            rows = rows.concat(newPings.map(({ ping, result, response }) => {
                return [
                    ship,
                    new Date(ping),
                    new Date(response),
                    result
                ];
            }));
        }


        if (rows.length > 0) {
            const inserted = await insert(rows);
            console.log(`Inserted ${inserted.rowCount} new rows.`);
        } else {
            console.log(`No new rows to insert.`);
        }
    } catch (e) {
        console.error(e);
    } finally {
        client.end();
    }

}

const argv = yargs
      .option('file', {
          alias: 'f',
          type: 'string',
          description: 'The file to import radar data from'
      })
      .help()
      .argv;

if (!argv.file) {
    process.exit(1);
}
run(argv.file);
