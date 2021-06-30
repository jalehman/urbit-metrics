WITH dataset AS (
    SELECT DISTINCT ON (ks.node_id)
        ks.node_id,
        a.active_on AS active_on
    FROM
        known_ship ks
    RIGHT JOIN activity a ON ks.node_id = a.node_id
WHERE
    clan = 'PLANET'
ORDER BY
    ks.node_id,
    a.active_on DESC
)
SELECT
    date_trunc('day', active_on) AS day,
    count(node_id) AS num_active
FROM
    dataset
GROUP BY
    day
ORDER BY
    day DESC;
