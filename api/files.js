const RPC='https://cyxdevcjycmffhmwxojh.supabase.co/rest/v1/rpc/';
const ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5eGRldmNqeWNtZmZobXd4b2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5ODM5ODUsImV4cCI6MjA5NzU1OTk4NX0.X3W-woCp-nVcnHXIG-d8wnpT_BGLdp6p1tjZ1jezdmI';
const MAX_BYTES=2000000;
const VALID_TYPES=new Set(['image/jpeg','image/png','image/webp','application/pdf']);
const VALID_KINDS=new Set(['photo','receipt','warranty']);
const validHousehold=v=>/^chispa-[a-f0-9]{64}$/.test(String(v||''));
const validUuid=v=>/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(v||''));
const safeName=v=>String(v||'file').replace(/[^A-Za-z0-9_. -]/g,'-').replace(/-+/g,'-').slice(0,180)||'file';
const headers=hid=>({'Content-Type':'application/json',apikey:ANON,Authorization:`Bearer ${ANON}`,'x-chispa-household-key':hid});
async function rpc(name,body,hid){const r=await fetch(`${RPC}${name}`,{method:'POST',headers:headers(hid),body:JSON.stringify(body)}),text=await r.text();let data;try{data=text?JSON.parse(text):null}catch{data=text}if(!r.ok){const e=new Error('rpc_failed');e.status=r.status;e.data=data;throw e}return data}
module.exports=async function handler(req,res){
  res.setHeader('Cache-Control','private, no-store');
  const householdId=String(req.method==='GET'?req.query.householdId:req.body?.householdId||'');
  if(!validHousehold(householdId))return res.status(400).json({ok:false,error:'invalid_household_id'});
  try{
    if(req.method==='POST'){
      const{itemId,kind,name,type,data}=req.body||{};
      if(!VALID_KINDS.has(String(kind)))return res.status(400).json({ok:false,error:'invalid_kind'});
      if(!VALID_TYPES.has(String(type)))return res.status(415).json({ok:false,error:'unsupported_file_type'});
      if(typeof data!=='string'||!data.length)return res.status(400).json({ok:false,error:'missing_file'});
      let bytes;try{bytes=Buffer.from(data,'base64')}catch{return res.status(400).json({ok:false,error:'invalid_file_data'})}
      if(!bytes.length||bytes.length>MAX_BYTES)return res.status(413).json({ok:false,error:'file_too_large',maxBytes:MAX_BYTES});
      const out=await rpc('chispa_save_file',{p_household_key:householdId,p_item_id:String(itemId||'item'),p_kind:String(kind),p_file_name:safeName(name),p_mime_type:String(type),p_data_base64:data},householdId),row=Array.isArray(out)?out[0]:out;
      if(!row?.id)throw new Error('missing_file_id');
      const url=`/api/files?householdId=${encodeURIComponent(householdId)}&fileId=${encodeURIComponent(row.id)}`;
      return res.status(201).json({ok:true,fileId:row.id,url,name:row.file_name,type:row.mime_type,size:row.size_bytes});
    }
    if(req.method==='GET'){
      const fileId=String(req.query.fileId||'');if(!validUuid(fileId))return res.status(400).json({ok:false,error:'invalid_file_id'});
      const out=await rpc('chispa_load_file',{p_household_key:householdId,p_file_id:fileId},householdId),row=Array.isArray(out)?out[0]:out;
      if(!row?.data_base64)return res.status(404).json({ok:false,error:'file_not_found'});
      const body=Buffer.from(row.data_base64,'base64');
      res.setHeader('Content-Type',row.mime_type||'application/octet-stream');
      res.setHeader('Content-Length',String(body.length));
      res.setHeader('Content-Disposition',`inline; filename="${safeName(row.file_name).replace(/"/g,'')}"`);
      return res.status(200).send(body);
    }
    if(req.method==='DELETE'){
      const fileId=String(req.body?.fileId||'');if(!validUuid(fileId))return res.status(400).json({ok:false,error:'invalid_file_id'});
      const out=await rpc('chispa_delete_file',{p_household_key:householdId,p_file_id:fileId},householdId);
      return res.status(200).json({ok:true,deleted:Boolean(out)});
    }
    return res.status(405).json({ok:false,error:'method_not_allowed'});
  }catch(error){const detail=error?.data;return res.status(error?.status===400?400:502).json({ok:false,error:'file_backend_unavailable',detail:typeof detail==='object'?detail?.message||detail?.code||'rpc_error':String(detail||error?.message||'error')})}
};
