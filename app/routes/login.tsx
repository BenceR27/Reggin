import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import type { Route } from "./+types/login";
import { Page } from "../components/layout";
import { useAuth } from "../lib/auth";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Belépés - Reggin" }];
}

const inputCls =
  "w-full border border-[var(--border-input)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-dark)] bg-[var(--bg-light)] outline-none focus:border-[var(--primary)] transition-colors";

export default function Login() {
  const { user, loading, login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (!loading && user) return <Navigate to="/" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") await login(email, password);
      else await register(email, password, name);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hiba történt, próbáld újra.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Page>
      <section className="pt-28 pb-20 min-h-screen bg-[var(--bg-light)]">
        <div className="max-w-md mx-auto px-6">
          <h1 className="text-4xl font-black text-[var(--text-dark)] mb-8">
            {mode === "login" ? "Bejelentkezés" : "Regisztráció"}
          </h1>
          <form
            onSubmit={submit}
            className="bg-[var(--surface)] rounded-2xl p-6 border border-[var(--border-color)] flex flex-col gap-4"
          >
            {mode === "register" && (
              <label className="text-sm font-bold text-[var(--text-dark)]">
                Név
                <input className={`${inputCls} mt-1 font-normal`} value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} />
              </label>
            )}
            <label className="text-sm font-bold text-[var(--text-dark)]">
              E-mail
              <input type="email" className={`${inputCls} mt-1 font-normal`} value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </label>
            <label className="text-sm font-bold text-[var(--text-dark)]">
              Jelszó
              <input
                type="password"
                className={`${inputCls} mt-1 font-normal`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={mode === "register" ? 8 : undefined}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
            </label>
            {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="px-4 py-2.5 rounded-xl bg-[var(--secondary)] text-white text-sm font-semibold hover:bg-[var(--primary)] transition-colors cursor-pointer disabled:opacity-60"
            >
              {mode === "login" ? "Belépés" : "Regisztrálok"}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError("");
              }}
              className="text-xs font-semibold text-[var(--primary)] cursor-pointer"
            >
              {mode === "login" ? "Még nincs fiókod? Regisztrálj" : "Van már fiókod? Jelentkezz be"}
            </button>
          </form>
        </div>
      </section>
    </Page>
  );
}