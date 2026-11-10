/** Non-destructive, repeatable server-side import. Never prints document content. */
import fs from 'node:fs';
import path from 'node:path';
import { store, databaseConfigured, type Collection } from '../src/lib/store';

const collections: Collection[] = [
  'leads','referrals','commissions','payouts','orders','host_sessions','host_messages','events',
  'applications','settings','partner_proposals','cms_pages','cms_services','cms_programs',
  'cms_team','cms_partners','cms_media','cms_navigation','cms_seo','cms_revisions',
  'riya_kb_custom','riya_knowledge_gaps','riya_learned_patterns','riya_submissions',
  'riya_sync_log','riya_feedback_ratings','riya_security_events',
];
async function main() {
  const apply = process.argv.includes('--apply');
  if (apply && !databaseConfigured()) throw new Error('Configure Supabase credentials before applying an import');
  const dir = process.env.KR8_IMPORT_DIR || path.join(process.cwd(), '.data');
  if (!fs.existsSync(dir)) throw new Error('Import directory does not exist');
  for (const collection of collections) {
    const file = path.join(dir, `${collection}.json`);
    if (!fs.existsSync(file)) continue;
    const rows = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!Array.isArray(rows) || rows.some(r => !r || typeof r.id !== 'string')) throw new Error(`Invalid documents in ${collection}`);
    let imported = 0, skipped = 0;
    if (apply) {
      for (const row of rows) {
        if (await store.findOne(collection, { id: row.id })) { skipped++; continue; }
        await store.insert(collection, row); imported++;
      }
    }
    console.log(`${collection}: ${rows.length} records${apply ? `; imported ${imported}, existing IDs skipped ${skipped}` : ' (dry run)'}`);
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
