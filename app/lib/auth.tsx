import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as api from "./api";
import type { AuthTokens, AuthUser } from "./api";

interface AuthContextValue {
  user: AuthUser | null;
  /** Short-lived access token. Only kept in memory, never in storage. */
  accessToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Renew the access token a bit before it expires.
const RENEW_MARGIN_MS = 30_000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);

  // On page load the access token is gone, so ask the API for a new one using the refresh cookie.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const tokens = await api.refresh();
        const me = await api.fetchMe(tokens.accessToken);
        if (!cancelled && me) {
          setSession(tokens);
          setUser(me);
        }
      } catch {
        // Not logged in.
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep the access token fresh while logged in.
  useEffect(() => {
    if (!session) return;
    const delay = Math.max(0, new Date(session.accessTokenExpiresAt).getTime() - Date.now() - RENEW_MARGIN_MS);
    const timer = setTimeout(async () => {
      try {
        setSession(await api.refresh());
      } catch {
        setSession(null);
        setUser(null);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [session]);

  const startSession = useCallback(async (tokens: AuthTokens) => {
    setUser(await api.fetchMe(tokens.accessToken));
    setSession(tokens);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken: session?.accessToken ?? null,
      loading,
      login: async (email, password) => startSession(await api.login(email, password)),
      register: async (email, password, name) => startSession(await api.register(email, password, name)),
      logout: async () => {
        setSession(null);
        setUser(null);
        await api.logout().catch(() => {});
      },
    }),
    [user, session, loading, startSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}