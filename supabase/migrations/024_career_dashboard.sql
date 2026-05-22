-- Migration 024: Career Dashboard
-- Tables: job_applications, target_companies, resumes
-- User-scoped only — no venture_slug

-- Resume vault
create table if not exists resumes (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  industry_tag  text not null, -- 'Aerospace' | 'IT' | 'Trucking' | 'Drone' | 'General'
  file_url      text not null,
  version       int not null default 1,
  analysis_json jsonb,         -- cached Claude analysis output
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Job applications (the Kanban cards)
create table if not exists job_applications (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  company          text not null,
  company_domain   text,
  industry         text not null,  -- Aerospace | IT | Trucking | Drone | Business
  province         text not null,  -- ON | BC | AB | QC | MB | SK | Remote | ...
  location_type    text not null default 'onsite', -- onsite | hybrid | remote
  salary_min       int,
  salary_max       int,
  source           text,           -- LinkedIn | Indeed | Adzuna | Company Site | Referral
  job_url          text,
  status           text not null default 'saved',  -- saved | applied | followed_up | interview | offer | closed
  resume_id        uuid references resumes(id) on delete set null,
  cover_letter     text,
  notes            text,
  contact_name     text,
  contact_linkedin text,
  applied_at       timestamptz,
  next_action      text,
  next_action_date date,
  closed_reason    text,          -- rejected | ghosted | withdrew
  match_score      int,           -- 0-100, from Claude analysis
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Company browser + watchlist
create table if not exists target_companies (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  domain       text,
  industry     text not null,
  province     text not null,
  size         text not null default 'medium', -- startup | small | medium | large | enterprise
  description  text,
  careers_url  text,
  is_watching  boolean not null default false,
  open_roles   int not null default 0,
  created_at   timestamptz not null default now()
);

-- Indexes
create index if not exists idx_job_applications_status   on job_applications(status);
create index if not exists idx_job_applications_industry on job_applications(industry);
create index if not exists idx_target_companies_industry on target_companies(industry);
create index if not exists idx_target_companies_watching on target_companies(is_watching);

-- Trigger: keep updated_at current
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists trg_resumes_updated_at on resumes;
create trigger trg_resumes_updated_at
  before update on resumes for each row execute function update_updated_at();

drop trigger if exists trg_job_applications_updated_at on job_applications;
create trigger trg_job_applications_updated_at
  before update on job_applications for each row execute function update_updated_at();

-- Seed: curated Canadian companies by industry
insert into target_companies (name, domain, industry, province, size, description, careers_url) values
  -- Aerospace / Aviation
  ('Bombardier',          'bombardier.com',      'Aerospace',  'QC', 'enterprise', 'Business jets and rail transportation systems.', 'https://jobs.bombardier.com'),
  ('CAE Inc.',            'cae.com',             'Aerospace',  'QC', 'large',      'Flight simulators, defense training systems, civil aviation.', 'https://www.cae.com/careers'),
  ('Pratt & Whitney Canada','pwc.ca',            'Aerospace',  'QC', 'large',      'Aircraft engines for regional and business aviation.', 'https://www.pwc.ca/en/careers'),
  ('MDA Space',           'mda.space',           'Aerospace',  'ON', 'large',      'Space robotics, satellites, Canadarm program.', 'https://mda.space/en/careers'),
  ('StandardAero',        'standardaero.com',    'Aerospace',  'MB', 'large',      'Aviation MRO and engine services.', 'https://www.standardaero.com/careers'),
  ('KF Aerospace',        'kfaerospace.com',     'Aerospace',  'BC', 'medium',     'Cargo, charter, and MRO services.', 'https://www.kfaerospace.com/careers'),
  ('Viking Air',          'vikingair.com',       'Aerospace',  'BC', 'small',      'Amphibious and utility aircraft manufacturing.', 'https://www.vikingair.com/about/careers'),
  ('Cascade Aerospace',   'cascadeaerospace.com','Aerospace',  'BC', 'medium',     'Military and commercial aircraft MRO.', 'https://www.cascadeaerospace.com/careers'),
  -- Drone / UAV
  ('Draganfly',           'draganfly.com',       'Drone',      'SK', 'startup',    'Commercial drones for public safety and agriculture.', 'https://draganfly.com/careers'),
  ('Percepto',            'percepto.com',        'Drone',      'ON', 'small',      'Autonomous drone operations for industrial inspection.', 'https://percepto.co/careers'),
  -- IT / Software
  ('Shopify',             'shopify.com',         'IT',         'ON', 'enterprise', 'E-commerce platform, remote-first engineering culture.', 'https://www.shopify.com/careers'),
  ('Cohere',              'cohere.com',          'IT',         'ON', 'medium',     'Enterprise AI and NLP platform.', 'https://cohere.com/careers'),
  ('Wealthsimple',        'wealthsimple.com',    'IT',         'ON', 'large',      'Fintech platform for investing and banking.', 'https://www.wealthsimple.com/en-ca/careers'),
  ('Hootsuite',           'hootsuite.com',       'IT',         'BC', 'large',      'Social media management platform.', 'https://www.hootsuite.com/careers'),
  ('Lightspeed Commerce', 'lightspeedhq.com',    'IT',         'QC', 'large',      'POS and e-commerce for retail and hospitality.', 'https://www.lightspeedhq.com/careers'),
  ('D2L',                 'd2l.com',             'IT',         'ON', 'medium',     'Learning management platform for education.', 'https://www.d2l.com/careers'),
  -- Trucking / Logistics / Dispatch
  ('TFI International',   'tfiintl.com',         'Trucking',   'QC', 'enterprise', 'Largest transport and logistics company in Canada.', 'https://www.tfiintl.com/careers'),
  ('Mullen Group',        'mullengroup.com',      'Trucking',   'AB', 'large',      'Trucking, logistics, warehousing across western Canada.', 'https://www.mullengroup.com/careers'),
  ('Day & Ross',          'dayross.com',          'Trucking',   'NB', 'large',      'National LTL and logistics, part of FedEx Canada.', 'https://dayross.com/careers'),
  ('Challenger Motor Freight','challenger.com',   'Trucking',   'ON', 'medium',     'Truckload, warehousing, and logistics.', 'https://www.challenger.com/careers'),
  ('Trimac Transportation','trimac.com',          'Trucking',   'AB', 'large',      'Bulk liquid and dry bulk transportation.', 'https://www.trimac.com/careers'),
  ('Bison Transport',     'bisontransport.com',   'Trucking',   'MB', 'large',      'Refrigerated and dry van trucking.', 'https://www.bisontransport.com/careers')
on conflict do nothing;
