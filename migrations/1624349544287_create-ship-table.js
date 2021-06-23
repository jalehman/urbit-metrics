/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('ship', {
        point: 'id',
        node_id: 'varchar(24)',
        clan: 'varchar(10)',
        sein: 'varchar(24)'
    })
};

exports.down = pgm => {
    pgm.dropTable('ship')
};
