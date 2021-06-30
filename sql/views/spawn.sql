 SELECT event.node_id AS parent_id,
    event.spawned_id,
    event."time" AS sponsored_at
   FROM event
  WHERE event.spawned_id IS NOT NULL;
