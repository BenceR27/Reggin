import { toCar, type Car, type CarDto } from "../components/sections/carsData";

export const API_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export async function fetchCars(): Promise<Car[]> {
  try {
    const res = await fetch(`${API_URL}/cars`);
    if (!res.ok) return [];
    return ((await res.json()) as CarDto[]).map(toCar);
  } catch {
    return [];
  }
}

export interface AuthTokens {
  accessToken: string;
  accessTokenExpiresAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: body === undefined ? {} : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    let message = "Hiba történt, próbáld újra.";
    try {
      const data = await res.json();
      if (typeof data.error === "string") message = data.error;
      else if (data.errors) message = Object.values<string[]>(data.errors).flat()[0] ?? message;
    } catch {}
    throw new ApiError(res.status, message);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export const register = (email: string, password: string, displayName: string) =>
  post<AuthTokens>("/auth/register", { email, password, displayName });

export const login = (email: string, password: string) =>
  post<AuthTokens>("/auth/login", { email, password });

// The refresh token lives in an httpOnly cookie, so the browser sends it automatically.
// Share one in-flight request so React StrictMode's double effect doesn't rotate the cookie twice.
let refreshing: Promise<AuthTokens> | null = null;
export function refresh(): Promise<AuthTokens> {
  refreshing ??= post<AuthTokens>("/auth/refresh").finally(() => {
    refreshing = null;
  });
  return refreshing;
}

export const logout = () => post<void>("/auth/logout");
export async function fetchMe(accessToken: string): Promise<AuthUser | null> {
  const res = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${accessToken}` } });
  return res.ok ? res.json() : null;
}