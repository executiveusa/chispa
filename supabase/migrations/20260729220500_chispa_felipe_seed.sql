-- Migration: 20260729220500_chispa_felipe_seed.sql
-- Purpose: Idempotent seed migration for Felipe Kit de Arenero project

do $$
declare
  v_project_id uuid;
  v_item1_id uuid;
  v_item2_id uuid;
  v_item3_id uuid;
  v_item4_id uuid;
  v_budget_a_id uuid;
  v_budget_b_id uuid;
begin
  -- Select or Insert Project
  select id into v_project_id from public.chispa_projects where slug = 'felipe-litter-kit';
  
  if v_project_id is null then
    v_project_id := uuid_generate_v4();
    insert into public.chispa_projects (
      id, slug, name, project_type, category, locale, target_location, currency, status, visibility, description, metadata
    ) values (
      v_project_id,
      'felipe-litter-kit',
      'Kit de arenero para Felipe',
      'shopping_guide',
      'pet_care',
      'es-MX',
      'Ciudad de México',
      'MXN',
      'active',
      'public',
      'Guía de compra rápida para preparar dos areneros grandes, arena sin aroma, limpiador enzimático y feromonas durante la adaptación de Felipe.',
      '{"source_version": "1.0", "source_updated_label": "Julio 2026", "contains_legacy_claims_requiring_review": true}'::jsonb
    );
  end if;

  -- Delete existing child records for clean idempotent seed
  delete from public.chispa_timeline_entries where project_id = v_project_id;
  delete from public.chispa_protocol_steps where project_id = v_project_id;
  delete from public.chispa_checklist_items where project_id = v_project_id;
  delete from public.chispa_budget_options where project_id = v_project_id;
  delete from public.chispa_shopping_items where project_id = v_project_id;

  -- 1. Insert Timeline Entries (4 entries)
  insert into public.chispa_timeline_entries (project_id, sort_order, label, description) values
    (v_project_id, 1, 'Semana 1-2', 'Estrés máximo, esconderse'),
    (v_project_id, 2, 'Semana 3-4', 'Explora, prueba arenero'),
    (v_project_id, 3, 'Semana 5-6', 'Se adapta, menos accidentes'),
    (v_project_id, 4, 'Después', 'Rutina establecida');

  -- 2. Insert Shopping Items (4 items)
  v_item1_id := uuid_generate_v4();
  insert into public.chispa_shopping_items (
    id, project_id, sort_order, category, name, variant, recommended, quantity, required, priority, status, currency, price_min_cents, price_max_cents, why, specifications, warnings, verification_required
  ) values (
    v_item1_id, v_project_id, 1, 'Cajas de almacenamiento', 'Rubbermaid Roughneck 66 Qt Clear', 'Contenedor transparente con tapa de cierre', true, 2, true, 'critical', 'not_purchased', 'MXN', 60000, 80000,
    'Tamaño grande, plástico resistente, tapa de cierre seguro y cuerpo transparente para ver el interior.',
    '["Peso máximo indicado en la guía original: 96 lb", "Material indicado: polipropileno resistente a impactos", "Rango de temperatura indicado: 0-115 °F"]'::jsonb,
    '["No comprar areneros comerciales pequeños de aproximadamente 20 litros."]'::jsonb,
    true
  );

  v_item2_id := uuid_generate_v4();
  insert into public.chispa_shopping_items (
    id, project_id, sort_order, category, name, variant, recommended, quantity, required, priority, status, currency, price_min_cents, price_max_cents, why, usage, verification_required
  ) values (
    v_item2_id, v_project_id, 2, 'Arena para gatos', 'Dr. Elsey''s Precious Cat Ultra', 'Unscented, bolsa de 20 lb / 9.1 kg', true, 2, true, 'critical', 'not_purchased', 'MXN', 40000, 50000,
    'La guía original la describe como 99.9% libre de polvo, de arcilla pesada, sin perfume, con control natural de olores y gránulos grandes.',
    'Usar aproximadamente 7-10 cm de profundidad en cada arenero.',
    true
  );

  v_item3_id := uuid_generate_v4();
  insert into public.chispa_shopping_items (
    id, project_id, sort_order, category, name, variant, recommended, quantity, required, priority, status, currency, price_min_cents, price_max_cents, why, usage, verification_required
  ) values (
    v_item3_id, v_project_id, 3, 'Limpieza enzimática', 'Nature''s Miracle Cat Enzymatic Stain & Odor Remover', 'Spray de 32 oz / 946 mL', true, 1, true, 'critical', 'not_purchased', 'MXN', 30000, 40000,
    'La guía original indica que una fórmula de bacterias y enzimas ayuda a descomponer residuos de orina y reducir el remarcaje.',
    'Después de limpiar con vinagre blanco, rociar, esperar 15 minutos, absorber con paño blanco y no enjuagar.',
    true
  );

  v_item4_id := uuid_generate_v4();
  insert into public.chispa_shopping_items (
    id, project_id, sort_order, category, name, variant, recommended, quantity, required, priority, status, currency, price_min_cents, price_max_cents, why, usage, verification_required
  ) values (
    v_item4_id, v_project_id, 4, 'Feromonas', 'Feliway Classic Spray', '60 mL', true, 1, true, 'high', 'not_purchased', 'MXN', 35000, 40000,
    'La guía original lo utiliza para reducir estrés y marcaje territorial durante la transición.',
    'Rociar dos veces al día durante las primeras cuatro semanas en marcos de puertas, ventanas y muebles donde Felipe se acerca.',
    true
  );

  -- 3. Insert Purchase Links (5 links total)
  insert into public.chispa_shopping_links (item_id, label, retailer, region, url, link_type, is_active) values
    (v_item1_id, 'Home Depot USA', 'Home Depot', 'US', 'https://www.homedepot.com/p/Rubbermaid-Roughneck-66-Qt-16-5-Gal-Stackable-Storage-Containers-Clear-w-Latching-Grey-Lids-4-Pack-RMRC066004/326993153', 'product', true),
    (v_item1_id, 'Amazon USA', 'Amazon', 'US', 'https://www.amazon.com/Rubbermaid-Roughneck-Containers-Stackable-Organization/dp/B0B7P6GYR6', 'product', true),
    (v_item2_id, 'Amazon México', 'Amazon', 'MX', 'https://www.amazon.com.mx/Dr-Elseys-Seguimiento-aglutinamiento-Ingredientes/dp/B0BFBR9JNS', 'product', true),
    (v_item3_id, 'Amazon USA, búsqueda Nature''s Miracle Cat', 'Amazon', 'US', 'https://www.amazon.com/', 'retailer_home', true),
    (v_item4_id, 'Amazon México', 'Amazon', 'MX', 'https://www.amazon.com.mx/FELIWAY-Classic-Estr%C3%A9s-Calmante-Feromonas/dp/B089115N2B', 'product', true);

  -- 4. Insert Budget Options & Lines (2 budget options)
  v_budget_a_id := uuid_generate_v4();
  insert into public.chispa_budget_options (id, project_id, sort_order, name, description, currency, min_total_cents, max_total_cents) values
    (v_budget_a_id, v_project_id, 1, 'Opción A: Amazon México', 'Compra priorizando rapidez y disponibilidad en Amazon México y veterinarias locales.', 'MXN', 275000, 320000);

  insert into public.chispa_budget_lines (budget_option_id, item_id, sort_order, label, min_cents, max_cents) values
    (v_budget_a_id, v_item1_id, 1, '2 Rubbermaid 66 Qt', 120000, 140000),
    (v_budget_a_id, v_item2_id, 2, '2 Dr. Elsey''s 20 lb', 90000, 100000),
    (v_budget_a_id, v_item3_id, 3, 'Nature''s Miracle', 30000, 40000),
    (v_budget_a_id, v_item4_id, 4, 'Feliway Spray 60 mL', 35000, 40000);

  v_budget_b_id := uuid_generate_v4();
  insert into public.chispa_budget_options (id, project_id, sort_order, name, description, currency, min_total_cents, max_total_cents) values
    (v_budget_b_id, v_project_id, 2, 'Opción B: compra urgente en Mercado Libre y CDMX', 'Compra local para entrega el mismo día o al día siguiente, sujeta a disponibilidad.', 'MXN', 275000, 350000);

  insert into public.chispa_budget_lines (budget_option_id, sort_order, label, min_cents, max_cents) values
    (v_budget_b_id, 1, '2 contenedores plásticos de 66 litros', 120000, 160000),
    (v_budget_b_id, 2, '2 bolsas de arena sin aroma', 80000, 100000),
    (v_budget_b_id, 3, 'Limpiador enzimático', 30000, 40000),
    (v_budget_b_id, 4, 'Feliway', 35000, 40000);

  -- 5. Insert Protocol Steps (5 setup steps)
  insert into public.chispa_protocol_steps (project_id, sort_order, title, body) values
    (v_project_id, 1, 'Preparar ambos areneros', 'Llenar cada contenedor con 7-10 cm de arena. Colocar uno en el baño y otro en la cocina o pasillo, en lugares tranquilos y lejos de la comida.'),
    (v_project_id, 2, 'Aplicar Feliway', 'Aplicar 4-6 pulverizaciones en marcos de puertas y ventanas. Esperar 15 minutos antes de traer a Felipe.'),
    (v_project_id, 3, 'Introducir a Felipe gradualmente', 'Comenzar en una habitación pequeña y tranquila. Colocar un arenero, agua y comida en zonas separadas y permitirle explorar.'),
    (v_project_id, 4, 'Limpiar accidentes', 'Aplicar vinagre diluido 1:1 con agua, esperar cinco minutos y absorber. Después aplicar el limpiador enzimático siguiendo la etiqueta del producto.'),
    (v_project_id, 5, 'Monitorear diariamente', 'Registrar si usa el arenero, si orina fuera y si cambia su conducta de rascado.');

  -- 6. Insert Checklist Items (7 items)
  insert into public.chispa_checklist_items (project_id, sort_order, label, status) values
    (v_project_id, 1, 'Comprar 2 Rubbermaid 66 Qt y verificar dimensiones', 'open'),
    (v_project_id, 2, 'Comprar 2 bolsas Dr. Elsey''s Unscented de 20 lb', 'open'),
    (v_project_id, 3, 'Comprar Nature''s Miracle Cat spray de 32 oz', 'open'),
    (v_project_id, 4, 'Comprar Feliway Classic Spray de 60 mL', 'open'),
    (v_project_id, 5, 'Preparar los areneros el día 1', 'open'),
    (v_project_id, 6, 'Aplicar Feliway antes de traer a Felipe', 'open'),
    (v_project_id, 7, 'Monitorear el uso del arenero durante las semanas 1-2', 'open');

end $$;
