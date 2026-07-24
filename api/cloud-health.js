const SUPABASE_RPC = 'https://api.thepaulieffect.com/supabase/rest/v1/rpc/';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcyNzc2NjczLCJleHAiOjE5MzA0NTY2NzN9.rl1mc-GgpG6nQArbEfFAKOcMvzL7rrgzPFT-LlCiCy4';
const PROJECT_ID = 'c0000000-0000-0000-0000-000000000001';
const DEVICE_ID = 'chispa-cloud-health-v1';

function headers() {
  return {
    'Content-Type': 'application/json',
    apikey: SUPABASE_ANON,
    Authorization: `Bearer ${SUPABASE_ANON}`,
    'Content-Profile': 'work',
  };
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const checkedAt = new Date().toISOString();
    const save = await fetch(`${SUPABASE_RPC}save_submission`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        p_project_id: PROJECT_ID,
        p_device_id: DEVICE_ID,
        p_payload: { app: 'chispa', healthcheck: true, saved_at: checkedAt },
      }),
    });
    const saveText = await save.text();
    if (!save.ok) return res.status(502).json({ ok:false, stage:'save', status:save.status, detail:saveText.slice(0,300) });
    const load = await fetch(`${SUPABASE_RPC}load_submission`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ p_device_id: DEVICE_ID }),
    });
    const loadText = await load.text();
    if (!load.ok) return res.status(502).json({ ok:false, stage:'load', status:load.status, detail:loadText.slice(0,300) });
    const data = JSON.parse(loadText || 'null');
    const row = Array.isArray(data) ? data[0] : data;
    const ok = Boolean(row?.payload?.app === 'chispa' && row?.payload?.healthcheck === true);
    return res.status(ok ? 200 : 502).json({ ok, project_id: PROJECT_ID, checked_at: checkedAt, save:'connected', load:ok?'connected':'unexpected-response' });
  } catch (error) {
    return res.status(500).json({ ok:false, stage:'network', error:error instanceof Error?error.message:String(error) });
  }
};