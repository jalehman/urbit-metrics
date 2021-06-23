require('dotenv').config();
const csv = require('csv-parse');
const fs = require('fs');
const format = require('pg-format');

const { client  } = require('./db');

const AZIMUTH_EVENTS = "events.txt";
const rows = [];

const readCsv = () => {
    return new Promise((resolve, reject) => {
        const rows = [];
        console.log('reading csv...')
        fs.createReadStream(AZIMUTH_EVENTS)
            .pipe(csv({ relax_column_count: true }))
            .on('data', (row) => {
                rows.push(row);
            })
            .on('end', () => {
                console.log('done reading csv');
                resolve(rows);
            });
    });
}

const parseDate = (s) => {
    const [a, b] = s.split('..');
    const [y, m, d] = a.replace('~', '').split('.');
    const [h, mi, se] = b.split('.');

    return new Date(Date.UTC(y, parseInt(m)-1, d, h, mi, se));
};

const CHANGE_OWNERSHIP = 'change_ownership';
const CHANGE_TRANSFER_PROXY = 'change_transfer_proxy';
const CHANGE_MANAGEMENT_PROXY = 'change_management_proxy';
const CHANGE_SPAWN_PROXY = 'change_spawn_proxy';
const CHANGE_VOTING_PROXY = 'change_voting_proxy';
const ESCAPE_REQUESTED = 'escape_requested';
const ESCAPE_CANCELED = 'escape_canceled';
const ESCAPE_ACCEPTED = 'escape_accepted'
const LOST_SPONSOR = 'lost_sponsor';
const SET_NETWORKING_KEYS = 'set_networking_keys';
const BREACHED = 'breached';
const INVITATION_SENT = 'invitation_sent';
const SPAWNED = 'spawned';

const EVENT_TYPES = {
    'owner': CHANGE_OWNERSHIP,
    'transfer-p': CHANGE_TRANSFER_PROXY,
    'spawn-p': CHANGE_SPAWN_PROXY,
    'management-p': CHANGE_MANAGEMENT_PROXY,
    'voting-p': CHANGE_VOTING_PROXY,
    'keys': SET_NETWORKING_KEYS,
    'activated': 'activate',
    'spawned': SPAWNED,
    'breached': BREACHED,
    'sponsor': ESCAPE_ACCEPTED,
    'escape-req': ESCAPE_REQUESTED,
    'invite': INVITATION_SENT
};

const csvToSql = (row) => {
    const time = parseDate(row[0]);
    const node_id = row[1];
    let event_type = EVENT_TYPES[row[2]];
    let sponsor_id, address, revision, continuity, spawned_id;

    if (event_type === ESCAPE_REQUESTED && row[3] === 'canceled')
        event_type = ESCAPE_CANCELED;

    if (event_type === ESCAPE_ACCEPTED && row[3] === 'detached from')
        event_type = LOST_SPONSOR;

    if (event_type === ESCAPE_ACCEPTED)
        sponsor_id = row[4];

    if ([CHANGE_OWNERSHIP,
         CHANGE_TRANSFER_PROXY,
         CHANGE_MANAGEMENT_PROXY,
         CHANGE_SPAWN_PROXY,
         CHANGE_VOTING_PROXY].includes(event_type))
        address = row[3];

    if (event_type === SET_NETWORKING_KEYS)
        revision = parseInt(row[3]);

    if (event_type === BREACHED)
        continuity = parseInt(row[3]);

    if (event_type === INVITATION_SENT)
        address = row[4];

    if (event_type === SPAWNED)
        spawned_id = row[3];

    return [
        node_id,
        event_type,
        time,
        sponsor_id,
        spawned_id,
        address,
        continuity,
        revision
    ];
};

const insert = (rows) => {
    return format(
        'INSERT INTO event (node_id, event_type, time, sponsor_id, spawned_id, address, continuity, revision) VALUES %L',
        rows.map(csvToSql)
    );
}

const run = async () => {

    const rows = await readCsv();
    const s = insert(rows.slice(1));

    try {
        await client.connect();
        // first, delete all content out of the events table
        await client.query('TRUNCATE event');
        // then insert the new data
        await client.query(s);
        console.log('done importing data');
    } catch (e) {
        console.error(e);
    } finally {
        client.end();
    }
}

run();
