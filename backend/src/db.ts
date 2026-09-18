import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn("DATABASE_URL is not set — auth endpoints will fail until it is configured.");
}

// Railway's internal Postgres uses a self-signed cert; require SSL only
// when the URL signals it (sslmode=require) or we're not on localhost.
const needsSsl = !!connectionString && !connectionString.includes("localhost");

export const pool = new Pool({
  connectionString,
  ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
});

const schema = `
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'faculty', 'institution_admin', 'industry', 'recruiter')),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS student_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  student_id TEXT NOT NULL UNIQUE,
  institution TEXT NOT NULL,
  program TEXT,
  department TEXT,
  year INT
);

CREATE TABLE IF NOT EXISTS faculty_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  faculty_id TEXT NOT NULL UNIQUE,
  institution TEXT NOT NULL,
  department TEXT,
  designation TEXT
);

CREATE TABLE IF NOT EXISTS institution_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  institution_id TEXT NOT NULL UNIQUE,
  institution_name TEXT NOT NULL,
  designation TEXT
);

CREATE TABLE IF NOT EXISTS industry_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  company_id TEXT NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  designation TEXT
);

CREATE TABLE IF NOT EXISTS recruiter_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  recruiter_id TEXT NOT NULL UNIQUE,
  company TEXT NOT NULL,
  designation TEXT
);

CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'general'
);

CREATE TABLE IF NOT EXISTS user_tags (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tag_id INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, tag_id)
);
`;

export async function runMigrations() {
  if (!connectionString) return;
  await pool.query("CREATE EXTENSION IF NOT EXISTS pgcrypto;");
  await pool.query(schema);
  console.log("Database schema is up to date.");
}
