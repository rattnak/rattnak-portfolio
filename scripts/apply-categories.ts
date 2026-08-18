// Step 7 of docs/WORK_TABLE_MIGRATION.md: apply the categories decided in
// docs/STEP7_CATEGORIES.md.
//
// Reads the `## <slug>` / `categories:` pairs out of that file and writes them
// to Work.categories. Only rows whose value actually differs are updated, so
// rerunning after editing one block touches one row.
//
// Requires a service-role key: RLS denies anonymous writes by design. This
// repo's .env has no such key today, so the practical path is --sql, which
// prints the UPDATE statements to pipe into psql with DIRECT_URL:
//
//   npx tsx scripts/apply-categories.ts --sql | psql "$DIRECT_URL"
//
// Run: npx tsx scripts/apply-categories.ts [--dry-run|--sql]

import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const VALID = new Set(['DEVELOP', 'DESIGN', 'LEADERSHIP', 'OPEN_SOURCE']);
const DRY = process.argv.includes('--dry-run');
const SQL = process.argv.includes('--sql');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL');
  process.exit(2);
}
if (!key && !DRY && !SQL) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY (RLS denies anonymous writes).');
  console.error('Re-run with --sql to emit UPDATE statements for psql instead.');
  process.exit(2);
}

function parse(path: string): Map<string, string[]> {
  const text = readFileSync(path, 'utf8');
  const out = new Map<string, string[]>();
  let slug: string | null = null;

  for (const line of text.split('\n')) {
    const heading = line.match(/^##\s+(\S+)/);
    if (heading) {
      slug = heading[1];
      continue;
    }
    const cats = line.match(/^\s*categories:\s*(.+?)\s*$/);
    if (cats && slug) {
      const values = cats[1]
        .replace(/[{}]/g, '')
        .split(',')
        .map((v) => v.trim().toUpperCase())
        .filter(Boolean);

      const bad = values.filter((v) => !VALID.has(v));
      if (bad.length) throw new Error(`${slug}: invalid category ${bad.join(', ')}`);
      // The CHECK constraint rejects this too, but failing here names the row.
      if (!values.length) throw new Error(`${slug}: categories cannot be empty`);

      out.set(slug, [...new Set(values)]);
      slug = null;
    }
  }
  return out;
}

async function main() {
  const desired = parse('docs/STEP7_CATEGORIES.md');
  (SQL ? console.error : console.log)(`Parsed ${desired.size} rows from docs/STEP7_CATEGORIES.md`);

  const supabase = createClient(url!, key ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data, error } = await supabase.from('Work').select('slug, categories');
  if (error) throw new Error(`read failed: ${error.message}`);

  const current = new Map((data as { slug: string; categories: string[] }[]).map((r) => [r.slug, r.categories]));

  const missing = [...desired.keys()].filter((s) => !current.has(s));
  if (missing.length) throw new Error(`slug(s) not in Work: ${missing.join(', ')}`);

  let changed = 0;
  for (const [slug, next] of desired) {
    const now = current.get(slug)!;
    if (now.length === next.length && now.every((v, i) => v === next[i])) continue;

    changed++;
    if (SQL) {
      const arr = next.map((v) => `'${v}'`).join(',');
      // slug comes from a heading matched against Work.slug, and every value
      // is checked against VALID above, so neither can carry a quote.
      console.log(`UPDATE "Work" SET "categories" = ARRAY[${arr}]::"WorkCategory"[] WHERE "slug" = '${slug}';`);
      continue;
    }
    console.log(`  ${slug}: {${now.join(',')}} -> {${next.join(',')}}`);
    if (DRY) continue;

    const { error: upErr } = await supabase.from('Work').update({ categories: next }).eq('slug', slug);
    if (upErr) throw new Error(`${slug}: update failed: ${upErr.message}`);
  }

  if (!changed) console.error('No changes: every row already matches the file.');
  else if (SQL) console.error(`-- ${changed} statement(s) emitted.`);
  else console.log(DRY ? `\n${changed} row(s) would change (dry run, nothing written).` : `\n${changed} row(s) updated.`);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
