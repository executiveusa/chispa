-- Chispa Phase 1 cloud provisioning
-- Additive only. Creates an internal Chispa client/project under The Pauli Effect.
-- Required before /api/sync can persist via existing work.save_submission RPC.

DO $$
DECLARE
  v_company_id uuid;
  v_client_id uuid;
  v_project_id constant uuid := 'c0000000-0000-0000-0000-000000000001';
BEGIN
  SELECT id INTO v_company_id
  FROM studio.companies
  WHERE lower(name) = 'the pauli effect'
     OR lower(slug) IN ('the-pauli-effect','thepaulieffect','pauli-effect')
  ORDER BY CASE WHEN lower(name)='the pauli effect' THEN 0 ELSE 1 END
  LIMIT 1;

  IF v_company_id IS NULL THEN
    RAISE EXCEPTION 'The Pauli Effect company row was not found; refusing to attach Chispa to the wrong company.';
  END IF;

  SELECT id INTO v_client_id FROM work.clients WHERE slug = 'chispa-household' LIMIT 1;

  IF v_client_id IS NULL THEN
    INSERT INTO work.clients (
      company_id, name, slug, industry, status, notes, metadata
    ) VALUES (
      v_company_id,
      'Chispa Household',
      'chispa-household',
      'Internal household shopping',
      'active',
      'Internal workspace for the Chispa shared shopping PWA.',
      jsonb_build_object('internal', true, 'app', 'chispa', 'owner', 'The Pauli Effect')
    ) RETURNING id INTO v_client_id;
  ELSE
    UPDATE work.clients
      SET company_id = v_company_id,
          updated_at = now(),
          metadata = coalesce(metadata,'{}'::jsonb) || jsonb_build_object('internal', true, 'app', 'chispa')
    WHERE id = v_client_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM work.projects WHERE id = v_project_id) THEN
    INSERT INTO work.projects (
      id, client_id, name, type, status, brief, metadata
    ) VALUES (
      v_project_id,
      v_client_id,
      'Chispa Shopping App',
      'app',
      'active',
      'Bilingual local-first household shopping, project lists, price comparison and shared memory.',
      jsonb_build_object('app','chispa','sync_schema',1,'production_url','https://chispa-nu.vercel.app')
    );
  ELSE
    UPDATE work.projects
      SET client_id = v_client_id,
          name = 'Chispa Shopping App',
          type = 'app',
          status = 'active',
          updated_at = now(),
          metadata = coalesce(metadata,'{}'::jsonb) || jsonb_build_object('app','chispa','sync_schema',1)
    WHERE id = v_project_id;
  END IF;
END $$;

-- Expected smoke test after running:
-- POST /rest/v1/rpc/save_submission with
-- p_project_id = c0000000-0000-0000-0000-000000000001
-- and a Chispa-prefixed hashed p_device_id should return 2xx.