const RPC = 'https://api.thepaulieffect.com/supabase/rest/v1/rpc/';
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcyNzc2NjczLCJleHAiOjE5MzA0NTY2NzN9.rl1mc-GgpG6nQArbEfFAKOcMvzL7rrgzPFT-LlCiCy4';
const PROJECT_ID = 'c0000000-0000-0000-0000-000000000001';
const MAX_BYTES = 900_000;

const headers = () => ({
  'Content-Type': 'application/json',
  apikey: ANON,
  Authorization: `Bearer ${ANON}`,
  'Content-Profile': 'work',
});

const validHouseholdId = value => /^chispa-[a-f0-9]{64}$/.test(String(value || ''));

async function rpc(name, body) {
  const response = await fetch(`${RPC}${name}`, { method: 'POST', headers: headers(), body: JSON.stringify(body) });
  const text = await response.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!response.ok) {
    const error = new Error('supabase_rpc_error');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  const action = String(req.query.action || req.body?.action || '');
  const householdId = String(req.body?.householdId || '');
  if (!validHouseholdId(householdId)) return res.status(400).json({ ok: false, error: 'invalid_household_id' });

  try {
    if (action === 'load') {
      const data = await rpc('load_submission', { p_device_id: householdId });
      const row = Array.isArray(data) ? data[0] : data;
      const payload = row?.payload;
      if (!payload || payload.app !== 'chispa') return res.status(200).json({ ok: true, exists: false, projectId: PROJECT_ID });
      return res.status(200).json({ ok: true, exists: true, payload, projectId: PROJECT_ID });
    }

    if (action === 'save') {
      const payload = req.body?.payload;
      if (!payload || payload.app !== 'chispa' || typeof payload.state !== 'object') return res.status(400).json({ ok: false, error: 'invalid_payload' });
      if (Buffer.byteLength(JSON.stringify(payload), 'utf8') > MAX_BYTES) return res.status(413).json({ ok: false, error: 'payload_too_large' });
      await rpc('save_submission', { p_project_id: PROJECT_ID, p_device_id: householdId, p_payload: payload });
      return res.status(200).json({ ok: true, savedAt: new Date().toISOString(), projectId: PROJECT_ID });
    }

    return res.status(400).json({ ok: false, error: 'invalid_action' });
  } catch (error) {
    const detail = error?.data;
    const code = detail?.code || '';
    if (error?.status === 409 && code === '23503') return res.status(503).json({ ok: false, error: 'cloud_not_provisioned' });
    return res.status(502).json({ ok: false, error: 'cloud_unavailable', status: error?.status || 502 });
  }
};