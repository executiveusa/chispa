const RPC = 'https://cyxdevcjycmffhmwxojh.supabase.co/rest/v1/rpc/';
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5eGRldmNqeWNtZmZobXd4b2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5ODM5ODUsImV4cCI6MjA5NzU1OTk4NX0.X3W-woCp-nVcnHXIG-d8wnpT_BGLdp6p1tjZ1jezdmI';
const TEST_KEY = 'chispa-ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const response = await fetch(`${RPC}chispa_load_snapshot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: ANON,
        Authorization: `Bearer ${ANON}`,
      },
      body: JSON.stringify({ p_household_key: TEST_KEY }),
    });
    if (!response.ok) {
      const detail = await response.text();
      return res.status(502).json({ ok: false, database: 'unreachable', status: response.status, detail: detail.slice(0, 160) });
    }
    return res.status(200).json({ ok: true, database: 'connected', provider: 'supabase', schema: 'chispa', isolation: 'rpc-only' });
  } catch (error) {
    return res.status(500).json({ ok: false, database: 'unreachable', error: error instanceof Error ? error.message : String(error) });
  }
};