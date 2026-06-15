-- Run this once in the Neon SQL Editor to create the quotes table
-- Go to: neon.tech → your project → SQL Editor

CREATE TABLE IF NOT EXISTS quotes (
  id          SERIAL PRIMARY KEY,
  client_name TEXT NOT NULL,
  business_name TEXT NOT NULL DEFAULT 'N/A',
  mobile_number TEXT NOT NULL,
  email       TEXT NOT NULL DEFAULT 'N/A',
  material    TEXT NOT NULL,
  specs_width TEXT NOT NULL,
  specs_height TEXT NOT NULL,
  handle_type TEXT NOT NULL,
  quantity    TEXT NOT NULL,
  printed_logo TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'New',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Grant the Data API's anonymous role access to the table
GRANT SELECT, INSERT, UPDATE, DELETE ON quotes TO anon;
GRANT USAGE, SELECT ON SEQUENCE quotes_id_seq TO anon;
