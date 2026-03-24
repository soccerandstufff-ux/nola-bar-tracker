export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { place_id } = req.query;
  if (!place_id) return res.status(400).json({ error: 'Missing place_id' });
  const url = `https://serpapi.com/search.json?engine=google_maps&place_id=${place_id}&api_key=${process.env.SERPAPI_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const pt = data?.place_results?.popular_times;
    if (!pt) return res.json({ live: null, info: 'No busyness data', weekly: null });
    res.json({
      live: pt.live_busyness ?? null,
      info: pt.live_busyness_info ?? null,
      weekly: pt.graph_results ?? null
    });
  } catch(e) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
}
