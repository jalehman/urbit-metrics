WITH active_children AS (
    SELECT DISTINCT ON (s.parent_id,
        a.node_id)
        s.parent_id,
        a.node_id,
        a.active_on,
        CASE WHEN length(s.parent_id::text) = 4 THEN
            'GALAXY'::text
        WHEN length(s.parent_id::text) = 7 THEN
            'STAR'::text
        WHEN length(s.parent_id::text) = 14 THEN
            'PLANET'::text
        ELSE
            'COMET'::text
        END AS clan
    FROM
        spawn s
        INNER JOIN activity a ON s.spawned_id = a.node_id
    WHERE
        a.active_on > CURRENT_DATE - interval '3 months'
        AND s.parent_id NOT in('~litzod',
            '~marnus')
    ORDER BY
        s.parent_id,
        a.node_id,
        a.active_on DESC
)
SELECT
    parent_id,
    count(node_id) AS active
FROM
    active_children
WHERE
    clan = 'STAR'
GROUP BY
    parent_id
ORDER BY
    active DESC;
