import { AuthUser } from "./store";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class AuthApiError extends Error {
  field?: string;
  constructor(message: string, field?: string) {
    super(message);
    this.field = field;
  }
}

async function post<T>(path: string, body: unknown, token?: string): Promise<T> {
  if (!API_URL) {
    throw new AuthApiError("SkillDex's backend isn't configured in this environment (NEXT_PUBLIC_API_URL is unset).");
  }
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new AuthApiError(data.error ?? "Something went wrong. Please try again.", data.field);
  return data as T;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
  dashboard: string;
}

export function signIn(email: string, password: string) {
  return post<AuthResponse>("/api/auth/login", { email, password });
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: string;
  roleFields: Record<string, string>;
  tags: string[];
}

export function register(payload: RegisterPayload) {
  return post<AuthResponse>("/api/auth/register", payload);
}

export interface RoleOptionsResponse {
  roles: string[];
  requiredFields: Record<string, { table: string; idColumn: string; required: string[] }>;
  tagOptions: Record<string, string[]>;
}

export async function fetchRoleOptions(): Promise<RoleOptionsResponse | null> {
  if (!API_URL) return null;
  const res = await fetch(`${API_URL}/api/auth/role-options`);
  if (!res.ok) return null;
  return res.json();
}
