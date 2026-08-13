-- Refine Project card content: remove Stripe from QuickPay, give every row a
-- real card blurb, and fill in the outcome line that is currently null on all 8.
--
-- Run in the Supabase SQL editor (RLS denies anonymous writes, so this cannot
-- be applied with the app's anon key).
--
-- Three problems this fixes:
--   1. `outcome` is NULL on all 8 projects. It is the mono result line on the
--      card, and the redesign plan's "simplification delta" lives there.
--   2. excerpt == description on 3 rows (gamepulse, quickpay, blackboard), so
--      those cards render a 275-452 char paragraph into a slot clamped to 2
--      lines and truncate mid-sentence.
--   3. Descriptions open with the technology ("A React Native mobile
--      application that...") rather than what the work accomplished.
--
-- Budget: `excerpt` is the card blurb. At 14px in a ~330px card the 2-line
-- clamp is roughly 110-125 characters. Every excerpt below is under 125.
-- No em dashes anywhere, per CLAUDE.md.

BEGIN;

-- ---------------------------------------------------------------------------
-- QuickPay: drop Stripe from the copy and from the skill tags.
-- Payment processing is described generically instead, since removing the
-- name leaves the capability intact.
-- ---------------------------------------------------------------------------
UPDATE "Project" SET
  description = 'A non-custodial React Native app that unifies multiple bank accounts in one view, settles group expenses by QR code, and turns budgeting into a drag-and-drop flowchart. Funds stay in the user''s own accounts rather than the app.',
  excerpt     = 'Unifies scattered bank accounts into one view, with QR payments and drag-and-drop budgets.',
  outcome     = 'Multiple bank apps to 1 view',
  overview    = REPLACE(
                  REPLACE(overview,
                    'The app integrates Plaid for secure bank connections, Stripe for payment processing, and Clerk for authentication,',
                    'The app integrates Plaid for secure bank connections and Clerk for authentication,'),
                  '<li><strong>Fast Payment Processing</strong> via Stripe allows reliable transfers between accounts and to external recipients.',
                  '<li><strong>Fast Payment Processing</strong> allows reliable transfers between accounts and to external recipients.')
WHERE slug = 'quickpay-mobile-app';

-- Remove the Stripe skill tag from QuickPay (leaves the Tag row itself alone,
-- in case another project uses it).
DELETE FROM "ProjectTag"
WHERE "projectId" = (SELECT id FROM "Project" WHERE slug = 'quickpay-mobile-app')
  AND "tagId"     = (SELECT id FROM "Tag" WHERE name = 'Stripe');

-- ---------------------------------------------------------------------------
-- IBTSS'26 AI Learning Passport
-- ---------------------------------------------------------------------------
UPDATE "Project" SET
  description = 'A digital passport for a conference workshop on AI in higher education. Participants scan a QR code at each station to collect a stamp, get the station''s resources by email straight away, and share a completion passport to LinkedIn.',
  excerpt     = 'Paper workshop passports replaced by QR stamps, with resources emailed on the spot.',
  outcome     = 'Paper stamps to 3 QR stations'
WHERE slug = 'ibtss-26-ai-learning-passport';

-- ---------------------------------------------------------------------------
-- Ed2Go to Modern Campus ETL
-- ---------------------------------------------------------------------------
UPDATE "Project" SET
  description = 'A Python pipeline that keeps FHSU''s continuing education catalog in sync automatically, pulling course data from the Ed2Go Partner API (SOAP/XML) and loading it into Modern Campus Destiny One on a schedule, with structured logging when a run goes wrong.',
  excerpt     = 'Course catalog syncing that used to be manual, now a scheduled pipeline with real logs.',
  outcome     = 'Manual catalog entry to nightly sync'
WHERE slug = 'ed2go-modern-campus-etl';

-- ---------------------------------------------------------------------------
-- Syncia
-- ---------------------------------------------------------------------------
UPDATE "Project" SET
  description = 'A coordination platform for FHSU student teams that replaces the usual scatter of group chats and spreadsheets. Milestones break into tasks and subtasks, progress logs keep history, focus mode shows who is working right now, and Outlook Calendar stays in sync.',
  excerpt     = 'Group chats and spreadsheets replaced by one workspace, with live team availability.',
  outcome     = 'Scattered tools to 1 workspace'
WHERE slug = 'syncia';

-- ---------------------------------------------------------------------------
-- FHSU GamePulse
-- Real metric available in the overview: sub-100ms sync across thousands of
-- devices. That is the strongest number on any of these projects.
-- ---------------------------------------------------------------------------
UPDATE "Project" SET
  description = 'A React Native app that turns a stadium crowd into one synchronized light show. A Node.js WebSocket backend drives screen colors across thousands of phones at once, holding sub 100ms latency so the effect reads as instant from the stands.',
  excerpt     = 'Turns thousands of phones in a stadium into one synchronized light show.',
  outcome     = 'Sub 100ms across 1000s of phones'
WHERE slug = 'fhsu-gamepulse';

-- ---------------------------------------------------------------------------
-- LoFi Focus Timer
-- ---------------------------------------------------------------------------
UPDATE "Project" SET
  description = 'A Pomodoro timer built offline-first, so a dropped connection never costs you a session. Tasks and timers persist locally in IndexedDB and sync to Firebase Firestore once the network returns. Vanilla JavaScript, no framework.',
  excerpt     = 'A Pomodoro timer that keeps working offline and syncs once the network is back.',
  outcome     = 'Works at 0 bars'
WHERE slug = 'lofi-focus-timer';

-- ---------------------------------------------------------------------------
-- Modern Cryptography (RSA & AES)
-- ---------------------------------------------------------------------------
UPDATE "Project" SET
  description = 'RSA and AES built from scratch in pure Python, no crypto libraries, then wrapped in a Flask API and a React frontend so you can watch each step run. Includes Miller-Rabin primality testing, SHA-256 digital signatures, and full AES-128/192/256 with a hand-written S-box, ShiftRows, and MixColumns.',
  excerpt     = 'RSA and AES written from scratch in Python, with a frontend that shows each step.',
  outcome     = 'Built from scratch, 0 crypto libraries'
WHERE slug = 'modern-cryptography-rsa-aes';

-- ---------------------------------------------------------------------------
-- FHSU Blackboard Data Queries
-- ---------------------------------------------------------------------------
UPDATE "Project" SET
  description = 'Fifty production Snowflake queries that turn Blackboard''s raw learning data into answers FHSU''s TILT department can act on: student engagement, content compliance, assignment tracking, tool adoption. Standardized alias and hierarchy patterns keep all 50 maintainable as one set.',
  excerpt     = 'Fifty Snowflake queries turning raw Blackboard data into answers staff can act on.',
  outcome     = '50 reusable queries'
WHERE slug = 'fhsu-blackboard-data-queries';

-- ---------------------------------------------------------------------------
-- Verify before committing.
-- Expect: 8 rows, every outcome non-null, every excerpt under 125 chars,
-- excerpt never equal to description, and no Stripe left anywhere.
-- ---------------------------------------------------------------------------
SELECT slug,
       length(excerpt)                AS excerpt_len,
       (excerpt = description)        AS excerpt_duplicates_desc,
       outcome,
       (description || COALESCE(overview,'')) ILIKE '%stripe%' AS mentions_stripe,
       (description || excerpt || COALESCE(outcome,'')) LIKE '%' || chr(8212) || '%' AS has_em_dash
FROM "Project"
ORDER BY "startDate" DESC;

-- Review the output above, then:
COMMIT;
-- (or ROLLBACK; if anything looks wrong)
