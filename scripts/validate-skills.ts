// Step 6 of docs/WORK_TABLE_MIGRATION.md: the safety net that replaces the
// foreign key the Tag junctions used to provide.
//
// Skills are a plain String[] now, so a typo ("Typescript" vs "TypeScript")
// is not an error, it is a new skill that renders grey. This script is the
// lint-time check for that: it reports any skill name in the database that
// has no entry in lib/tagColors.ts.
//
// Exits non-zero when something is unmatched, so CI fails on a typo rather
// than shipping a silently grey chip.
//
// Run: npx tsx scripts/validate-skills.ts

import { createClient } from '@supabase/supabase-js';
import { SKILLS } from '../lib/tagColors';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(2);
}

const supabase = createClient(url, key);

type SkillRow = { slug?: string; projectName?: string; skills: string[] | null };

async function main() {
  const [work, oss] = await Promise.all([
    supabase.from('Work').select('slug, skills'),
    supabase.from('OpenSourceContribution').select('projectName, skills'),
  ]);

  // A failed query must not read as "no unmatched skills". Fail loudly.
  if (work.error) throw new Error(`Work query failed: ${work.error.message}`);
  if (oss.error) throw new Error(`OSS query failed: ${oss.error.message}`);

  const palette = new Set(SKILLS);
  const unmatched = new Map<string, string[]>();
  let total = 0;

  for (const [rows, label] of [
    [work.data as SkillRow[], 'Work'],
    [oss.data as SkillRow[], 'OpenSourceContribution'],
  ] as const) {
    for (const row of rows) {
      const owner = row.slug ?? row.projectName ?? '(unknown)';
      for (const skill of row.skills ?? []) {
        total++;
        if (!palette.has(skill)) {
          const where = unmatched.get(skill) ?? [];
          where.push(`${label}:${owner}`);
          unmatched.set(skill, where);
        }
      }
    }
  }

  console.log(`Checked ${total} skill values against ${palette.size} palette entries.`);

  if (unmatched.size === 0) {
    console.log('All skills have a palette entry.');
    return;
  }

  console.error(`\n${unmatched.size} skill name(s) have no entry in lib/tagColors.ts:`);
  for (const [skill, where] of [...unmatched].sort()) {
    console.error(`  "${skill}"  used by: ${where.join(', ')}`);
  }
  console.error('\nAdd each to TAG_COLORS (both light and dark maps), or fix the typo.');
  process.exit(1);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(2);
});
