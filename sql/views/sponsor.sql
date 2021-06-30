 WITH sponsor_event AS (
         SELECT event.node_id,
            event.sponsor_id,
            event."time" AS sponsored_at
           FROM event
          WHERE event.sponsor_id IS NOT NULL AND event.event_type::text = 'escape_accepted'::text
        UNION ALL
         SELECT event.spawned_id AS node_id,
            event.node_id AS sponsor_id,
            event."time" AS sponsored_at
           FROM event
          WHERE event.spawned_id IS NOT NULL
        )
 SELECT DISTINCT ON (sponsor_event.node_id) sponsor_event.node_id,
    sponsor_event.sponsor_id,
    sponsor_event.sponsored_at
   FROM sponsor_event
  ORDER BY sponsor_event.node_id, sponsor_event.sponsor_id, sponsor_event.sponsored_at DESC;
