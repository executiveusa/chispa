/* Cloud Sync & Supabase Integration for Chispa
   Project: botanic-creations (cyxdevcjycmffhmwxojh)
   Table Prefix: chispa_ ONLY
*/

const SUPABASE_URL = 'https://cyxdevcjycmffhmwxojh.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_PoqI-3PsCqewtJWJ0Z73Ag_5hIE0oKI';

export async function fetchChispaProjects() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/chispa_projects?select=*`, {
      headers: {
        'apikey': SUPABASE_PUBLISHABLE_KEY,
        'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}`
      }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('[Supabase Sync Warning]', err);
    return null;
  }
}

export async function fetchFelipeProjectData() {
  try {
    const [projectRes, itemsRes, linksRes, budgetRes, stepsRes, checklistRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/chispa_projects?slug=eq.felipe-litter-kit&select=*`, {
        headers: { 'apikey': SUPABASE_PUBLISHABLE_KEY, 'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}` }
      }),
      fetch(`${SUPABASE_URL}/rest/v1/chispa_shopping_items?select=*&order=sort_order.asc`, {
        headers: { 'apikey': SUPABASE_PUBLISHABLE_KEY, 'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}` }
      }),
      fetch(`${SUPABASE_URL}/rest/v1/chispa_shopping_links?select=*`, {
        headers: { 'apikey': SUPABASE_PUBLISHABLE_KEY, 'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}` }
      }),
      fetch(`${SUPABASE_URL}/rest/v1/chispa_budget_options?select=*,chispa_budget_lines(*)&order=sort_order.asc`, {
        headers: { 'apikey': SUPABASE_PUBLISHABLE_KEY, 'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}` }
      }),
      fetch(`${SUPABASE_URL}/rest/v1/chispa_protocol_steps?select=*&order=sort_order.asc`, {
        headers: { 'apikey': SUPABASE_PUBLISHABLE_KEY, 'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}` }
      }),
      fetch(`${SUPABASE_URL}/rest/v1/chispa_checklist_items?select=*&order=sort_order.asc`, {
        headers: { 'apikey': SUPABASE_PUBLISHABLE_KEY, 'Authorization': `Bearer ${SUPABASE_PUBLISHABLE_KEY}` }
      })
    ]);

    if (!projectRes.ok) return null;

    const projects = await projectRes.json();
    if (!projects || projects.length === 0) return null;

    const project = projects[0];
    const items = itemsRes.ok ? await itemsRes.json() : [];
    const links = linksRes.ok ? await linksRes.json() : [];
    const budgetOptions = budgetRes.ok ? await budgetRes.json() : [];
    const steps = stepsRes.ok ? await stepsRes.json() : [];
    const checklist = checklistRes.ok ? await checklistRes.json() : [];

    return { project, items, links, budgetOptions, steps, checklist };
  } catch (err) {
    console.warn('[Supabase Felipe Fetch Error]', err);
    return null;
  }
}