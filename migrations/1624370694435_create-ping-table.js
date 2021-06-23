/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('ping', {
        node_id: 'varchar(128)',
        ping: 'timestamp',
        response: 'timestamp',
        hash: 'varchar(72)'
    })

};

exports.down = pgm => {
    pgm.dropTable('ping');
};
