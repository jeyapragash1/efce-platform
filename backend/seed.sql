-- Sample seed data for EFCE
-- Replace the password hash if you want a different admin password.
BEGIN;

-- users
INSERT INTO users (name, email, org, avatar_url, hashed_password, is_admin)
VALUES
  ('Admin User', 'admin@efce.local', 'EFCE', NULL, '$2b$12$772mw45EspZH6RULHN6ebuXRvlNQEc4xOgh2LQ5/lmge./1q0N0sO', true),
  ('Sre Lead', 'sre.lead@efce.local', 'EFCE', NULL, '$2b$12$772mw45EspZH6RULHN6ebuXRvlNQEc4xOgh2LQ5/lmge./1q0N0sO', false),
  ('Ops Manager', 'ops.manager@efce.local', 'EFCE', NULL, '$2b$12$772mw45EspZH6RULHN6ebuXRvlNQEc4xOgh2LQ5/lmge./1q0N0sO', false),
  ('Analyst One', 'analyst1@efce.local', 'EFCE', NULL, '$2b$12$772mw45EspZH6RULHN6ebuXRvlNQEc4xOgh2LQ5/lmge./1q0N0sO', false),
  ('Analyst Two', 'analyst2@efce.local', 'EFCE', NULL, '$2b$12$772mw45EspZH6RULHN6ebuXRvlNQEc4xOgh2LQ5/lmge./1q0N0sO', false),
  ('Infra Owner', 'infra.owner@efce.local', 'EFCE', NULL, '$2b$12$772mw45EspZH6RULHN6ebuXRvlNQEc4xOgh2LQ5/lmge./1q0N0sO', false),
  ('Security Lead', 'security.lead@efce.local', 'EFCE', NULL, '$2b$12$772mw45EspZH6RULHN6ebuXRvlNQEc4xOgh2LQ5/lmge./1q0N0sO', false),
  ('Product Owner', 'product.owner@efce.local', 'EFCE', NULL, '$2b$12$772mw45EspZH6RULHN6ebuXRvlNQEc4xOgh2LQ5/lmge./1q0N0sO', false),
  ('Service Owner', 'service.owner@efce.local', 'EFCE', NULL, '$2b$12$772mw45EspZH6RULHN6ebuXRvlNQEc4xOgh2LQ5/lmge./1q0N0sO', false),
  ('Platform Eng', 'platform.eng@efce.local', 'EFCE', NULL, '$2b$12$772mw45EspZH6RULHN6ebuXRvlNQEc4xOgh2LQ5/lmge./1q0N0sO', false)
ON CONFLICT (email) DO UPDATE
SET name = EXCLUDED.name,
    org = EXCLUDED.org,
    avatar_url = EXCLUDED.avatar_url,
    hashed_password = EXCLUDED.hashed_password,
    is_admin = EXCLUDED.is_admin;

-- incidents
INSERT INTO incidents (id, title, service, severity, status, started_at, duration_min) VALUES
  ('inc_001', 'API latency spike', 'api-gateway', 'P1', 'Resolved', NOW() - INTERVAL '10 days', 42),
  ('inc_002', 'Cache eviction storm', 'cache', 'P2', 'Resolved', NOW() - INTERVAL '9 days', 65),
  ('inc_003', 'Database connection saturation', 'postgres', 'P1', 'Resolved', NOW() - INTERVAL '8 days', 37),
  ('inc_004', 'Queue backlog surge', 'message-bus', 'P3', 'Resolved', NOW() - INTERVAL '7 days', 58),
  ('inc_005', 'TLS handshake failures', 'edge-proxy', 'P2', 'Monitoring', NOW() - INTERVAL '6 days', 25),
  ('inc_006', 'Auth service timeout', 'auth', 'P1', 'Resolved', NOW() - INTERVAL '5 days', 49),
  ('inc_007', 'Billing job delay', 'billing', 'P2', 'Resolved', NOW() - INTERVAL '4 days', 33),
  ('inc_008', 'Search index lag', 'search', 'P3', 'Monitoring', NOW() - INTERVAL '3 days', 21),
  ('inc_009', 'Webhook retries spike', 'integrations', 'P2', 'Resolved', NOW() - INTERVAL '2 days', 47),
  ('inc_010', 'Rate limiter misconfig', 'api-gateway', 'P3', 'Resolved', NOW() - INTERVAL '1 days', 18)
ON CONFLICT DO NOTHING;

-- risks
INSERT INTO risks (id, risk, owner, level, status) VALUES
  ('risk_001', 'Single region dependency', 'SRE', 'High', 'Open'),
  ('risk_002', 'Aging cache nodes', 'Infra', 'Medium', 'Mitigating'),
  ('risk_003', 'Limited on-call coverage', 'Ops', 'High', 'Open'),
  ('risk_004', 'Excessive alert noise', 'SRE', 'Medium', 'Open'),
  ('risk_005', 'Secrets rotation gaps', 'Security', 'High', 'Mitigating'),
  ('risk_006', 'Legacy batch jobs', 'Platform', 'Medium', 'Open'),
  ('risk_007', 'Database disk growth', 'DBA', 'Medium', 'Monitoring'),
  ('risk_008', 'Service ownership drift', 'Product', 'Low', 'Open'),
  ('risk_009', 'Runbook coverage gaps', 'Ops', 'Medium', 'Open'),
  ('risk_010', 'Third-party API instability', 'Platform', 'High', 'Monitoring')
ON CONFLICT DO NOTHING;

-- reports
INSERT INTO reports (id, title, type, date, tags) VALUES
  ('rep_001', 'Weekly Reliability', 'Weekly', '2026-02-08', '["weekly","reliability"]'::json),
  ('rep_002', 'Monthly Incident Review', 'Monthly', '2026-02-01', '["monthly","incidents"]'::json),
  ('rep_003', 'SLO Breach Summary', 'Weekly', '2026-01-31', '["slo","summary"]'::json),
  ('rep_004', 'Risk Register', 'Monthly', '2026-01-30', '["risk","register"]'::json),
  ('rep_005', 'Executive Brief', 'Monthly', '2026-01-29', '["executive"]'::json),
  ('rep_006', 'Platform Health', 'Weekly', '2026-01-28', '["platform","health"]'::json),
  ('rep_007', 'Service Readiness', 'Weekly', '2026-01-27', '["readiness"]'::json),
  ('rep_008', 'Incident Trends', 'Weekly', '2026-01-26', '["trends"]'::json),
  ('rep_009', 'Control Coverage', 'Monthly', '2026-01-25', '["controls"]'::json),
  ('rep_010', 'Postmortem Digest', 'Weekly', '2026-01-24', '["postmortem"]'::json)
ON CONFLICT DO NOTHING;

-- daily_metrics
INSERT INTO daily_metrics (id, date, incidents, mttr) VALUES
  (1, '2026-01-30', 4, 30),
  (2, '2026-01-31', 3, 26),
  (3, '2026-02-01', 2, 24),
  (4, '2026-02-02', 5, 35),
  (5, '2026-02-03', 3, 27),
  (6, '2026-02-04', 1, 18),
  (7, '2026-02-05', 2, 21),
  (8, '2026-02-06', 4, 29),
  (9, '2026-02-07', 3, 25),
  (10, '2026-02-08', 2, 23)
ON CONFLICT DO NOTHING;

-- cause_patterns
INSERT INTO cause_patterns (id, cause, count, avg_impact) VALUES
  (1, 'Config drift', 5, 'Medium'),
  (2, 'Timeout', 7, 'High'),
  (3, 'Capacity', 3, 'Medium'),
  (4, 'Deploy regression', 4, 'High'),
  (5, 'Dependency failure', 6, 'High'),
  (6, 'Cache miss spike', 3, 'Medium'),
  (7, 'Network jitter', 2, 'Low'),
  (8, 'Schema mismatch', 2, 'Medium'),
  (9, 'Rate limit', 4, 'Low'),
  (10, 'Auth error', 3, 'Medium')
ON CONFLICT DO NOTHING;

-- service_cause_matrix
INSERT INTO service_cause_matrix (id, service, cause, count) VALUES
  (1, 'api-gateway', 'Timeout', 2),
  (2, 'cache', 'Capacity', 1),
  (3, 'postgres', 'Connection', 2),
  (4, 'message-bus', 'Lag', 1),
  (5, 'edge-proxy', 'TLS', 1),
  (6, 'auth', 'Timeout', 2),
  (7, 'billing', 'Deploy regression', 1),
  (8, 'search', 'Index lag', 1),
  (9, 'integrations', 'Webhook retry', 2),
  (10, 'api-gateway', 'Rate limit', 1)
ON CONFLICT DO NOTHING;

-- repeat_rate_trend
INSERT INTO repeat_rate_trend (id, date, repeat_rate) VALUES
  (1, '2026-01-30', 10),
  (2, '2026-01-31', 12),
  (3, '2026-02-01', 8),
  (4, '2026-02-02', 14),
  (5, '2026-02-03', 11),
  (6, '2026-02-04', 9),
  (7, '2026-02-05', 13),
  (8, '2026-02-06', 10),
  (9, '2026-02-07', 12),
  (10, '2026-02-08', 9)
ON CONFLICT DO NOTHING;

-- causal_graphs
INSERT INTO causal_graphs (id, incident_id, nodes, edges) VALUES
  (1, 'inc_001', '[{"id":"svc-api","label":"API"},{"id":"db","label":"DB"}]'::json, '[{"source":"svc-api","target":"db","type":"causes"}]'::json),
  (2, 'inc_002', '[{"id":"cache","label":"Cache"}]'::json, '[]'::json),
  (3, 'inc_003', '[{"id":"db","label":"DB"}]'::json, '[]'::json),
  (4, 'inc_004', '[{"id":"queue","label":"Queue"}]'::json, '[]'::json),
  (5, 'inc_005', '[{"id":"edge","label":"Edge"}]'::json, '[]'::json),
  (6, 'inc_006', '[{"id":"auth","label":"Auth"}]'::json, '[]'::json),
  (7, 'inc_007', '[{"id":"billing","label":"Billing"}]'::json, '[]'::json),
  (8, 'inc_008', '[{"id":"search","label":"Search"}]'::json, '[]'::json),
  (9, 'inc_009', '[{"id":"int","label":"Integrations"}]'::json, '[]'::json),
  (10, 'inc_010', '[{"id":"rate","label":"RateLimit"}]'::json, '[]'::json)
ON CONFLICT DO NOTHING;

-- analysis_attributions
INSERT INTO analysis_attributions (id, incident_id, items) VALUES
  (1, 'inc_001', '[{"factor":"timeout","weight":0.7}]'::json),
  (2, 'inc_002', '[{"factor":"capacity","weight":0.6}]'::json),
  (3, 'inc_003', '[{"factor":"connection","weight":0.8}]'::json),
  (4, 'inc_004', '[{"factor":"lag","weight":0.5}]'::json),
  (5, 'inc_005', '[{"factor":"tls","weight":0.4}]'::json),
  (6, 'inc_006', '[{"factor":"timeout","weight":0.6}]'::json),
  (7, 'inc_007', '[{"factor":"deploy","weight":0.5}]'::json),
  (8, 'inc_008', '[{"factor":"index","weight":0.5}]'::json),
  (9, 'inc_009', '[{"factor":"retry","weight":0.4}]'::json),
  (10, 'inc_010', '[{"factor":"rate","weight":0.3}]'::json)
ON CONFLICT DO NOTHING;

-- analysis_counterfactuals
INSERT INTO analysis_counterfactuals (id, incident_id, items) VALUES
  (1, 'inc_001', '[{"change":"increase-replicas","impact":"lower"}]'::json),
  (2, 'inc_002', '[{"change":"warm-cache","impact":"lower"}]'::json),
  (3, 'inc_003', '[{"change":"pool-tuning","impact":"lower"}]'::json),
  (4, 'inc_004', '[{"change":"scale-consumers","impact":"lower"}]'::json),
  (5, 'inc_005', '[{"change":"rotate-certs","impact":"lower"}]'::json),
  (6, 'inc_006', '[{"change":"increase-timeouts","impact":"lower"}]'::json),
  (7, 'inc_007', '[{"change":"roll-back","impact":"lower"}]'::json),
  (8, 'inc_008', '[{"change":"rebuild-index","impact":"lower"}]'::json),
  (9, 'inc_009', '[{"change":"backoff-tuning","impact":"lower"}]'::json),
  (10, 'inc_010', '[{"change":"limit-adjust","impact":"lower"}]'::json)
ON CONFLICT DO NOTHING;

-- controls
INSERT INTO controls (id, name, category) VALUES
  (1, 'Circuit Breaker', 'Resilience'),
  (2, 'Rate Limiter', 'Resilience'),
  (3, 'Retry Policy', 'Resilience'),
  (4, 'WAF Rules', 'Security'),
  (5, 'DB Backups', 'Reliability'),
  (6, 'Chaos Tests', 'Testing'),
  (7, 'Autoscaling', 'Scalability'),
  (8, 'TLS Rotation', 'Security'),
  (9, 'Runbook Checklists', 'Operations'),
  (10, 'Alert Tuning', 'Operations')
ON CONFLICT DO NOTHING;

-- notifications
INSERT INTO notifications (id, user_id, message, type, read) VALUES
  (1, 1, 'New incident assigned', 'info', false),
  (2, 2, 'Risk updated: Single region dependency', 'warning', false),
  (3, 3, 'Report export completed', 'success', true),
  (4, 4, 'Onboarding step pending', 'info', false),
  (5, 5, 'Control coverage updated', 'info', true),
  (6, 6, 'Incident resolved: inc_006', 'success', true),
  (7, 7, 'Security policy change', 'warning', false),
  (8, 8, 'New pattern detected', 'info', false),
  (9, 9, 'Scenario saved', 'success', true),
  (10, 10, 'Graph studio synced', 'info', true)
ON CONFLICT DO NOTHING;

-- onboarding_state
INSERT INTO onboarding_state (id, user_id, step, dismissed) VALUES
  (1, 1, 3, false),
  (2, 2, 2, false),
  (3, 3, 1, false),
  (4, 4, 0, true),
  (5, 5, 2, false),
  (6, 6, 4, false),
  (7, 7, 1, true),
  (8, 8, 3, false),
  (9, 9, 2, false),
  (10, 10, 1, false)
ON CONFLICT DO NOTHING;

-- scenarios
INSERT INTO scenarios (id, user_id, name, state) VALUES
  ('scn_001', 1, 'Traffic spike', '{"variables":{"traffic":2.0}}'::json),
  ('scn_002', 2, 'Cache warmup', '{"variables":{"cache":1.5}}'::json),
  ('scn_003', 3, 'DB failover', '{"variables":{"failover":true}}'::json),
  ('scn_004', 4, 'Queue surge', '{"variables":{"queue":3.0}}'::json),
  ('scn_005', 5, 'TLS renewal', '{"variables":{"certs":"rotate"}}'::json),
  ('scn_006', 6, 'Scale auth', '{"variables":{"auth":2.0}}'::json),
  ('scn_007', 7, 'Rate limit tighten', '{"variables":{"limit":0.8}}'::json),
  ('scn_008', 8, 'Index rebuild', '{"variables":{"rebuild":true}}'::json),
  ('scn_009', 9, 'Webhook backoff', '{"variables":{"retry":0.6}}'::json),
  ('scn_010', 10, 'Billing batch', '{"variables":{"batch":1.2}}'::json)
ON CONFLICT DO NOTHING;

-- graph_studio_state
INSERT INTO graph_studio_state (id, user_id, nodes, edges, evidence, versions) VALUES
  (1, 1, '[{"id":"node-1","label":"Service A"}]'::json, '[]'::json, '[]'::json, '[{"version":"v1"}]'::json),
  (2, 2, '[{"id":"node-2","label":"Service B"}]'::json, '[]'::json, '[]'::json, '[{"version":"v1"}]'::json),
  (3, 3, '[{"id":"node-3","label":"Service C"}]'::json, '[]'::json, '[]'::json, '[{"version":"v1"}]'::json),
  (4, 4, '[{"id":"node-4","label":"Service D"}]'::json, '[]'::json, '[]'::json, '[{"version":"v1"}]'::json),
  (5, 5, '[{"id":"node-5","label":"Service E"}]'::json, '[]'::json, '[]'::json, '[{"version":"v1"}]'::json),
  (6, 6, '[{"id":"node-6","label":"Service F"}]'::json, '[]'::json, '[]'::json, '[{"version":"v1"}]'::json),
  (7, 7, '[{"id":"node-7","label":"Service G"}]'::json, '[]'::json, '[]'::json, '[{"version":"v1"}]'::json),
  (8, 8, '[{"id":"node-8","label":"Service H"}]'::json, '[]'::json, '[]'::json, '[{"version":"v1"}]'::json),
  (9, 9, '[{"id":"node-9","label":"Service I"}]'::json, '[]'::json, '[]'::json, '[{"version":"v1"}]'::json),
  (10, 10, '[{"id":"node-10","label":"Service J"}]'::json, '[]'::json, '[]'::json, '[{"version":"v1"}]'::json)
ON CONFLICT DO NOTHING;

-- report_exports
INSERT INTO report_exports (id, user_id, incident_id) VALUES
  (1, 1, 'inc_001'),
  (2, 2, 'inc_002'),
  (3, 3, 'inc_003'),
  (4, 4, 'inc_004'),
  (5, 5, 'inc_005'),
  (6, 6, 'inc_006'),
  (7, 7, 'inc_007'),
  (8, 8, 'inc_008'),
  (9, 9, 'inc_009'),
  (10, 10, 'inc_010')
ON CONFLICT DO NOTHING;

COMMIT;
