import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const LABELS: Record<Theme, string> = {
  light: "Váltás sötét témára",
  dark: "Váltás világos témára",
};

function apply(theme: Theme) {
  const root = document.documentElement;
  if (theme === "light") root.setAttribute("data-theme", "light");
  else root.removeAttribute("data-theme");
  try {
    localStorage.setItem("theme", theme);
  } catch {
    /* storage unavailable */
  }
}

function Icon({ theme }: { theme: Theme }) {
  const common = { className: "w-5 h-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 } as const;
  // shows the theme you are currently in
  if (theme === "light")
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path strokeLinecap="round" d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4m11.4-11.4 1.4-1.4" />
      </svg>
    );
  return (
    <svg {...common}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
    </svg>
  );
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  // The inline script in root.tsx has already applied the right theme; just mirror it.
  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    apply(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title={LABELS[theme]}
      aria-label={LABELS[theme]}
      className="text-white/80 hover:text-white border border-white/20 hover:border-white/40 p-2 rounded-lg transition-colors cursor-pointer"
    >
      <Icon theme={theme} />
    </button>
  );
}
