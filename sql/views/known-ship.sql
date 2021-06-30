 WITH all_nodes AS (
         SELECT activity.node_id
           FROM activity
        UNION ALL
         SELECT event.node_id
           FROM event
        )
 SELECT DISTINCT ON (all_nodes.node_id) all_nodes.node_id,
        CASE
            WHEN length(all_nodes.node_id::text) = 4 THEN 'GALAXY'::text
            WHEN length(all_nodes.node_id::text) = 7 THEN 'STAR'::text
            WHEN length(all_nodes.node_id::text) = 14 THEN 'PLANET'::text
            ELSE 'COMET'::text
        END AS clan
   FROM all_nodes;
