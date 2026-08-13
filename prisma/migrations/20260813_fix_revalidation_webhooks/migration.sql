-- Repoint the revalidation webhooks at the canonical domain, and fix the
-- Tag trigger's typo'd path.
--
-- Two defects found in the existing triggers:
--   1. All seven posted to https://rattnak.vercel.app, not the canonical
--      https://rattnak.com.
--   2. The Tag trigger posted to /api/validate, which does not exist and
--      returned 404 on every tag edit, so tag changes never revalidated.
--
-- Each trigger is recreated with identical arguments except the URL: the
-- existing headers (including the bearer token) and the {"table","record"}
-- params are read back from the current definition rather than retyped, so
-- nothing else can drift.

DO $$
DECLARE
  t record;
  new_url  constant text := 'https://rattnak.com/api/revalidate';
  hdrs     text;
  parms    text;
  tmo      text;
  meth     text;
BEGIN
  FOR t IN
    SELECT c.relname AS tbl,
           tg.tgname AS name,
           pg_get_triggerdef(tg.oid) AS def
    FROM pg_trigger tg
    JOIN pg_class c ON c.oid = tg.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND NOT tg.tgisinternal
      AND pg_get_triggerdef(tg.oid) LIKE '%supabase_functions.http_request%'
  LOOP
    -- Pull the trailing four arguments out of the existing definition so the
    -- token and payload shape are carried over verbatim.
    meth  := (regexp_match(t.def, 'http_request\(''[^'']*'', ''([^'']*)'''))[1];
    hdrs  := (regexp_match(t.def, 'http_request\(''[^'']*'', ''[^'']*'', ''([^'']*)'''))[1];
    parms := (regexp_match(t.def, 'http_request\(''[^'']*'', ''[^'']*'', ''[^'']*'', ''([^'']*)'''))[1];
    tmo   := (regexp_match(t.def, 'http_request\(''[^'']*'', ''[^'']*'', ''[^'']*'', ''[^'']*'', ''([^'']*)'''))[1];

    IF meth IS NULL OR hdrs IS NULL OR parms IS NULL OR tmo IS NULL THEN
      RAISE EXCEPTION 'could not parse trigger args for %.%', t.tbl, t.name;
    END IF;

    EXECUTE format('DROP TRIGGER %I ON public.%I', t.name, t.tbl);

    EXECUTE format(
      'CREATE TRIGGER %I AFTER INSERT OR UPDATE OR DELETE ON public.%I '
      || 'FOR EACH ROW EXECUTE FUNCTION supabase_functions.http_request(%L, %L, %L, %L, %L)',
      t.name, t.tbl, new_url, meth, hdrs, parms, tmo
    );

    RAISE NOTICE 'repointed %.% -> %', t.tbl, t.name, new_url;
  END LOOP;
END $$;
