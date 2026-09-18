import { Router } from "express";
import { pool } from "../db";
import { hashPassword, verifyPassword, signToken } from "./crypto";
import { requireAuth, AuthedRequest } from "./middleware";
import { isRole, roleFieldSpecs, roleDashboard, roleTagOptions, Role } from "./roles";

export const authRouter = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Maps each role's camelCase form fields to the snake_case columns of its
// profile table, in the exact order roleFieldSpecs declares them plus the
// non-"required" optional extras (program/department/year, designation).
const columnsByRole: Record<Role, { column: string; field: string }[]> = {
  student: [
    { column: "student_id", field: "studentId" },
    { column: "institution", field: "institution" },
    { column: "program", field: "program" },
    { column: "department", field: "department" },
    { column: "year", field: "year" },
  ],
  faculty: [
    { column: "faculty_id", field: "facultyId" },
    { column: "institution", field: "institution" },
    { column: "department", field: "department" },
    { column: "designation", field: "designation" },
  ],
  institution_admin: [
    { column: "institution_id", field: "institutionId" },
    { column: "institution_name", field: "institutionName" },
    { column: "designation", field: "designation" },
  ],
  industry: [
    { column: "company_id", field: "companyId" },
    { column: "company_name", field: "companyName" },
    { column: "designation", field: "designation" },
  ],
  recruiter: [
    { column: "recruiter_id", field: "recruiterId" },
    { column: "company", field: "company" },
    { column: "designation", field: "designation" },
  ],
};

function publicUser(row: {
  id: string; name: string; email: string; role: string; created_at: Date; last_login: Date | null;
}) {
  return { id: row.id, name: row.name, email: row.email, role: row.role, createdAt: row.created_at, lastLogin: row.last_login };
}

// GET /api/auth/role-options — lets the frontend build the dynamic
// registration form (which fields + which tags) from one source of truth
// instead of duplicating this config on both sides.
authRouter.get("/role-options", (_req, res) => {
  res.json({
    roles: Object.keys(roleFieldSpecs),
    requiredFields: roleFieldSpecs,
    tagOptions: roleTagOptions,
  });
});

authRouter.post("/register", async (req, res) => {
  const { name, email, password, role, roleFields, tags } = req.body ?? {};

  if (typeof name !== "string" || name.trim().length < 2) {
    return res.status(400).json({ error: "Enter your full name." });
  }
  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }
  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters." });
  }
  if (!isRole(role)) {
    return res.status(400).json({ error: "Select a valid account type." });
  }
  const spec = roleFieldSpecs[role];
  const fields = roleFields ?? {};
  for (const key of spec.required) {
    if (typeof fields[key] !== "string" || !fields[key].trim()) {
      return res.status(400).json({ error: `${key} is required for this account type.` });
    }
  }
  const tagNames: string[] = Array.isArray(tags) ? tags.filter((t) => typeof t === "string" && t.trim()).slice(0, 10) : [];

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const existing = await client.query("SELECT 1 FROM users WHERE email = $1", [email.toLowerCase()]);
    if (existing.rowCount) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: "An account with this email already exists.", field: "email" });
    }

    const idColumn = spec.idColumn;
    const idValue = fields[columnsByRole[role].find((c) => c.column === idColumn)!.field];
    const dup = await client.query(`SELECT 1 FROM ${spec.table} WHERE ${idColumn} = $1`, [idValue]);
    if (dup.rowCount) {
      await client.query("ROLLBACK");
      return res.status(409).json({ error: `This ${idColumn.replace(/_/g, " ")} is already registered. Try signing in instead.`, field: idColumn });
    }

    const passwordHash = await hashPassword(password);
    const userResult = await client.query(
      `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at, last_login`,
      [name.trim(), email.toLowerCase(), passwordHash, role]
    );
    const user = userResult.rows[0];

    const cols = columnsByRole[role];
    const colNames = ["user_id", ...cols.map((c) => c.column)];
    const values = [user.id, ...cols.map((c) => {
      const v = fields[c.field];
      if (c.column === "year" && v !== undefined && v !== "") return Number(v);
      return v || null;
    })];
    const placeholders = colNames.map((_, i) => `$${i + 1}`).join(", ");
    await client.query(`INSERT INTO ${spec.table} (${colNames.join(", ")}) VALUES (${placeholders})`, values);

    for (const tagName of tagNames) {
      const tagResult = await client.query(
        `INSERT INTO tags (name, category) VALUES ($1, $2)
         ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [tagName, role]
      );
      await client.query(
        `INSERT INTO user_tags (user_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [user.id, tagResult.rows[0].id]
      );
    }

    await client.query("COMMIT");

    const token = signToken({ sub: user.id, role: user.role });
    res.status(201).json({ token, user: publicUser(user), dashboard: roleDashboard[role as Role] });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Registration failed:", err);
    res.status(500).json({ error: "We couldn't create your account. Please try again." });
  } finally {
    client.release();
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const result = await pool.query(
      "SELECT id, name, email, password_hash, role, created_at, last_login FROM users WHERE email = $1",
      [email.toLowerCase()]
    );
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "Incorrect email or password." });

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Incorrect email or password." });

    await pool.query("UPDATE users SET last_login = now() WHERE id = $1", [user.id]);

    const token = signToken({ sub: user.id, role: user.role });
    res.json({ token, user: publicUser(user), dashboard: roleDashboard[user.role as Role] });
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).json({ error: "Something went wrong signing you in." });
  }
});

authRouter.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at, last_login FROM users WHERE id = $1",
      [req.auth!.userId]
    );
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: "User not found" });

    const spec = roleFieldSpecs[user.role as Role];
    const profileResult = await pool.query(`SELECT * FROM ${spec.table} WHERE user_id = $1`, [user.id]);
    const tagsResult = await pool.query(
      `SELECT t.name FROM tags t JOIN user_tags ut ON ut.tag_id = t.id WHERE ut.user_id = $1`,
      [user.id]
    );

    res.json({
      user: publicUser(user),
      profile: profileResult.rows[0] ?? null,
      tags: tagsResult.rows.map((r) => r.name),
      dashboard: roleDashboard[user.role as Role],
    });
  } catch (err) {
    console.error("Fetching profile failed:", err);
    res.status(500).json({ error: "Couldn't load your profile." });
  }
});
