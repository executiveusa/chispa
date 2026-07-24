const BASE = 'https://api.thepaulieffect.com/supabase/rest/v1/';
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzcyNzc2NjczLCJleHAiOjE5MzA0NTY2NzN9.rl1mc-GgpG6nQArbEfFAKOcMvzL7rrgzPFT-LlCiCy4';

async function schema(profile) {
  const response = await fetch(BASE, {
    headers: { apikey: ANON, Authorization: `Bearer ${ANON}`, 'Accept-Profile': profile, Accept: 'application/openapi+json' },
  });
  const text = await response.text();
  if (!response.ok) return { ok:false, status:response.status, detail:text.slice(0,300) };
  const doc = JSON.parse(text || '{}');
  const defs = doc.definitions || doc.components?.schemas || {};
  const pick = {};
  for (const name of ['projects','clients','submissions','companies','people','company_members']) {
    if (!defs[name]) continue;
    const d = defs[name];
    pick[name] = { required:d.required || [], properties:Object.fromEntries(Object.entries(d.properties || {}).map(([k,v])=>[k,{type:v.type,format:v.format,description:v.description,default:v.default}])) };
  }
  return { ok:true, tables:Object.keys(pick), definitions:pick };
}
module.exports = async function handler(req,res){res.setHeader('Cache-Control','no-store');try{return res.status(200).json({work:await schema('work'),studio:await schema('studio')})}catch(error){return res.status(500).json({ok:false,error:error instanceof Error?error.message:String(error)})}};