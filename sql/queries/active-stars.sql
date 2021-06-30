WITH dataset AS (
    SELECT DISTINCT ON (a.active_on,
        a.node_id)
        a.node_id,
        a.active_on
    FROM
        known_ship ks
    RIGHT JOIN activity a ON ks.node_id = a.node_id
WHERE
    clan = 'STAR'
)
SELECT
    active_on, count(node_id) AS num_active
FROM
    dataset
GROUP BY
    active_on
ORDER BY
    active_on DESC;
