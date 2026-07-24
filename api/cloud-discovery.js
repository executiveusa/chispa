const SUPABASE = 'https://api.thepaulieffect.com/supabase/rest/v1/';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcyNzc2NjczLCJleHAiOjE5MzA0NTY2NzN9.rl1mc-GgpG6nQArbEfFAKOcMvzL7rrgzPFT-LlCiCy4';

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const response = await fetch(`${SUPABASE}projects?select=id,name,type,status,client_id&order=name.asc&limit=200`, {
      headers: {
        apikey: SUPABASE_ANON,
        Authorization: `Bearer ${SUPABASE_ANON}`,
        'Accept-Profile': 'work',
      },
    });
    const text = await response.text();
    if (!response.ok) {
      return res.status(response.status).json({ ok: false, status: response.status, detail: text.slice(0, 500) });
    }
    const rows = JSON.parse(text || '[]');
    const chispa = rows.filter(row => /chispa/i.test(`${row.name || ''} ${row.type || ''}`));
    return res.status(200).json({ ok: true, visible_count: rows.length, chispa });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
};