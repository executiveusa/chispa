const RPC = 'https://cyxdevcjycmffhmwxojh.supabase.co/rest/v1/rpc/';
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5eGRldmNqeWNtZmZobXd4b2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5ODM5ODUsImV4cCI6MjA5NzU1OTk4NX0.X3W-woCp-nVcnHXIG-d8wnpT_BGLdp6p1tjZ1jezdmI';
const MAX_BYTES = 900_000;

const headers = () => ({
  'Content-Type': 'application/json',
  apikey: ANON,
  Authorization: `Bearer ${ANON}`,
});

const validHouseholdId = value => /^chispa-[a-f0-9]{64}$/.test(String(value || ''));

async function rpc(name, body) {
  const response = await fetch(`${RPC}${name}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });
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
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const action = String(req.query.action || req.body?.action || '');
  const householdId = String(req.body?.householdId || '');
  if (!validHouseholdId(householdId)) {
    return res.status(400).json({ ok: false, error: 'invalid_household_id' });
  }

  try {
    if (action === 'load') {
      const data = await rpc('chispa_load_snapshot', { p_household_key: householdId });
      const row = Array.isArray(data) ? data[0] : data;
      if (!row?.payload || row.payload.app !== 'chispa') {
        return res.status(200).json({ ok: true, exists: false, revision: 0 });
      }
      return res.status(200).json({
        ok: true,
        exists: true,
        payload: row.payload,
        revision: Number(row.revision || 0),
        updatedAt: row.updated_at || null,
      });
    }

    if (action === 'save') {
      const payload = req.body?.payload;
      const expectedRevision = req.body?.expectedRevision;
      if (!payload || payload.app !== 'chispa' || typeof payload.state !== 'object') {
        return res.status(400).json({ ok: false, error: 'invalid_payload' });
      }
      if (Buffer.byteLength(JSON.stringify(payload), 'utf8') > MAX_BYTES) {
        return res.status(413).json({ ok: false, error: 'payload_too_large' });
      }

      const data = await rpc('chispa_save_snapshot', {
        p_household_key: householdId,
        p_payload: payload,
        p_expected_revision: Number.isFinite(Number(expectedRevision)) ? Number(expectedRevision) : null,
      });
      const row = Array.isArray(data) ? data[0] : data;
      return res.status(200).json({
        ok: true,
        revision: Number(row?.revision || 0),
        savedAt: row?.updated_at || new Date().toISOString(),
      });
    }

    return res.status(400).json({ ok: false, error: 'invalid_action' });
  } catch (error) {
    const detail = error?.data;
    const code = detail?.code || '';
    const message = String(detail?.message || '');
    if (code === '40001' || message.includes('revision_conflict')) {
      return res.status(409).json({ ok: false, error: 'revision_conflict' });
    }
    return res.status(502).json({ ok: false, error: 'cloud_unavailable', status: error?.status || 502 });
  }
};