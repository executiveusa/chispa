const BASE = 'https://cyxdevcjycmffhmwxojh.supabase.co/storage/v1/object';
const BUCKET = 'chispa-private';
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5eGRldmNqeWNtZmZobXd4b2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5ODM5ODUsImV4cCI6MjA5NzU1OTk4NX0.X3W-woCp-nVcnHXIG-d8wnpT_BGLdp6p1tjZ1jezdmI';
const MAX_BYTES = 4 * 1024 * 1024;
const VALID_TYPES = new Set(['image/jpeg','image/png','image/webp','application/pdf']);
const VALID_KINDS = new Set(['photo','receipt','warranty']);
const validHousehold = value => /^chispa-[a-f0-9]{64}$/.test(String(value || ''));
const safeSegment = value => String(value || '').replace(/[^A-Za-z0-9_.-]/g,'-').replace(/-+/g,'-').slice(0,120) || 'file';
const authHeaders = householdId => ({apikey:ANON,Authorization:`Bearer ${ANON}`,'x-chispa-household-key':householdId});
const validPath = (householdId,path) => typeof path==='string' && path.startsWith(`${householdId}/`) && !path.includes('..') && path.length<600;

module.exports = async function handler(req,res){
  res.setHeader('Cache-Control','private, no-store');
  const householdId=String(req.method==='GET'?req.query.householdId:req.body?.householdId||'');
  if(!validHousehold(householdId)) return res.status(400).json({ok:false,error:'invalid_household_id'});
  try{
    if(req.method==='POST'){
      const {itemId,kind,name,type,data}=req.body||{};
      if(!VALID_KINDS.has(String(kind))) return res.status(400).json({ok:false,error:'invalid_kind'});
      if(!VALID_TYPES.has(String(type))) return res.status(415).json({ok:false,error:'unsupported_file_type'});
      if(typeof data!=='string'||!data.length) return res.status(400).json({ok:false,error:'missing_file'});
      let bytes;
      try{bytes=Buffer.from(data,'base64')}catch{return res.status(400).json({ok:false,error:'invalid_file_data'})}
      if(!bytes.length||bytes.length>MAX_BYTES) return res.status(413).json({ok:false,error:'file_too_large',maxBytes:MAX_BYTES});
      const ext=String(type)==='application/pdf'?'.pdf':String(type)==='image/png'?'.png':String(type)==='image/webp'?'.webp':'.jpg';
      const filename=safeSegment(String(name||'file').replace(/\.[^.]+$/,''))+ext;
      const path=`${householdId}/${safeSegment(itemId)}/${safeSegment(kind)}/${Date.now()}-${filename}`;
      const response=await fetch(`${BASE}/${BUCKET}/${path.split('/').map(encodeURIComponent).join('/')}`,{
        method:'POST',
        headers:{...authHeaders(householdId),'Content-Type':type,'x-upsert':'false'},
        body:bytes
      });
      const text=await response.text();
      if(!response.ok) return res.status(response.status).json({ok:false,error:'storage_upload_failed',detail:text.slice(0,300)});
      const url=`/api/files?householdId=${encodeURIComponent(householdId)}&path=${encodeURIComponent(path)}`;
      return res.status(201).json({ok:true,path,url,name:filename,type,size:bytes.length});
    }
    if(req.method==='GET'){
      const path=String(req.query.path||'');
      if(!validPath(householdId,path)) return res.status(400).json({ok:false,error:'invalid_path'});
      const response=await fetch(`${BASE}/authenticated/${BUCKET}/${path.split('/').map(encodeURIComponent).join('/')}`,{headers:authHeaders(householdId)});
      if(!response.ok){const text=await response.text();return res.status(response.status).json({ok:false,error:'file_unavailable',detail:text.slice(0,240)})}
      const body=Buffer.from(await response.arrayBuffer());
      res.setHeader('Content-Type',response.headers.get('content-type')||'application/octet-stream');
      res.setHeader('Content-Length',String(body.length));
      res.setHeader('Content-Disposition',response.headers.get('content-disposition')||'inline');
      return res.status(200).send(body);
    }
    if(req.method==='DELETE'){
      const path=String(req.body?.path||'');
      if(!validPath(householdId,path)) return res.status(400).json({ok:false,error:'invalid_path'});
      const response=await fetch(`${BASE}/${BUCKET}/${path.split('/').map(encodeURIComponent).join('/')}`,{method:'DELETE',headers:authHeaders(householdId)});
      if(!response.ok){const text=await response.text();return res.status(response.status).json({ok:false,error:'storage_delete_failed',detail:text.slice(0,240)})}
      return res.status(200).json({ok:true});
    }
    return res.status(405).json({ok:false,error:'method_not_allowed'});
  }catch(error){return res.status(502).json({ok:false,error:'storage_unavailable',detail:error instanceof Error?error.message:String(error)})}
};
