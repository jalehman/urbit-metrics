/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('event', {
        event_id: 'id',
        node_id: {
            type: 'varchar(24)',
            notNull: true
        },
        event_type: {
            type: 'varchar(32)',
            notNull: true
        },
        time: {
            type: 'timestamp',
            notNull: true
        },
        sponsor_id: 'varchar(24)',
        spawned_id: 'varchar(24)',
        address: 'varchar(64)',
        continuity: 'integer',
        revision: 'integer'
    });
};

exports.down = pgm => {
    pgm.dropTable('event');
};
