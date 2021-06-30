 SELECT ping.node_id,
    date_trunc('day'::text, ping.ping) AS active_on,
    ping.hash AS base_hash,
    avg(age(ping.response, ping.ping)) AS avg_latency,
    count(*) AS num_pings
   FROM ping
  GROUP BY ping.node_id, ping.hash, (date_trunc('day'::text, ping.ping));
