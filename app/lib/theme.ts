// Custom colour themes: visitors can change a handful of colours, each of which drives several CSS variables.
// Choices are saved per base theme (light / dark) in localStorage. The resolved variables are saved too, so a tiny
// inline script in root.tsx can apply them before the page paints.

export type Mode = "light" | "dark";

const COLORS_KEY = "theme-colors";
const VARS_KEY = "theme-vars";

type Rgb = [number, number, number];

function parseHex(hex: string): Rgb {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function toHex([r, g, b]: Rgb): string {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}

function mix(a: string, b: string, t: number): string {
  const x = parseHex(a);
  const y = parseHex(b);
  return toHex([0, 1, 2].map((i) => x[i] + (y[i] - x[i]) * t) as Rgb);
}

const darken = (c: string, t: number) => mix(c, "#000000", t);
const lighten = (c: string, t: number) => mix(c, "#ffffff", t);

function isLight(c: string): boolean {
  const [r, g, b] = parseHex(c);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
}

const rgba = (c: string, a: number) => {
  const [r, g, b] = parseHex(c);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

export interface ThemeGroup {
  key: string;
  label: string;
  /** A variable whose current value is shown in the colour picker. */
  probe: string;
  /** All CSS variables that follow this colour. */
  build: (color: string) => Record<string, string>;
}

export const GROUPS: ThemeGroup[] = [
  {
    key: "accent",
    label: "Kiemelő szín",
    probe: "--primary",
    build: (c) => ({
      "--primary": c,
      "--primary-hover": darken(c, 0.15),
      "--primary-btn": darken(c, 0.25),
      "--primary-btn-hover": darken(c, 0.35),
    }),
  },
  {
    key: "secondary",
    label: "Gombok és kiemelések",
    probe: "--secondary",
    build: (c) => ({ "--secondary": c, "--secondary-hover": darken(c, 0.2) }),
  },
  {
    key: "page",
    label: "Oldal háttere",
    probe: "--page-bg",
    build: (c) => {
      const alt = isLight(c) ? darken(c, 0.04) : c;
      return { "--page-bg": c, "--bg-light": alt, "--brands-bg": alt, "--brands-edge": alt };
    },
  },
  {
    key: "surface",
    label: "Kártyák háttere",
    probe: "--surface",
    build: (c) => ({ "--surface": c }),
  },
  {
    key: "border",
    label: "Szegélyek",
    probe: "--border-color",
    build: (c) => ({
      "--border-color": c,
      "--border-input": isLight(c) ? darken(c, 0.1) : lighten(c, 0.1),
    }),
  },
  {
    key: "text",
    label: "Szöveg",
    probe: "--text-dark",
    build: (c) => ({
      "--text-dark": c,
      "--text-soft": rgba(c, 0.65),
      "--text-label-soft": rgba(c, 0.6),
      "--brands-label": rgba(c, 0.55),
      "--brands-line": rgba(c, 0.1),
    }),
  },
  {
    key: "muted",
    label: "Halvány szöveg",
    probe: "--text-muted",
    build: (c) => ({ "--text-muted": c, "--text-gray-400": c }),
  },
  {
    key: "header",
    label: "Fejléc",
    probe: "--header-bg",
    build: (c) => ({ "--header-bg": c }),
  },
  {
    key: "footer",
    label: "Lábléc",
    probe: "--footer-bg",
    build: (c) => ({ "--footer-bg": c }),
  },
];

const MANAGED_VARS = [...new Set(GROUPS.flatMap((g) => Object.keys(g.build("#000000"))))];

export function currentMode(): Mode {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

function read<T>(key: string): Record<Mode, T> {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "{}");
  } catch {
    return {} as Record<Mode, T>;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

/** Re-applies the saved colours for the current base theme. Call after switching light / dark. */
export function applyCustomTheme() {
  const root = document.documentElement;
  for (const v of MANAGED_VARS) root.style.removeProperty(v);
  const vars = read<Record<string, string>>(VARS_KEY)[currentMode()];
  if (vars) for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);
}

/** The colour currently in effect for each group, as #rrggbb. */
export function currentColors(): Record<string, string> {
  const style = getComputedStyle(document.documentElement);
  const out: Record<string, string> = {};
  for (const g of GROUPS) {
    const raw = style.getPropertyValue(g.probe).trim();
    out[g.key] = /^#[0-9a-f]{3,6}$/i.test(raw) ? toHex(parseHex(raw)) : "#000000";
  }
  return out;
}

export function setThemeColor(groupKey: string, color: string) {
  const group = GROUPS.find((g) => g.key === groupKey);
  if (!group) return;
  const mode = currentMode();
  const colors = read<Record<string, string>>(COLORS_KEY);
  const vars = read<Record<string, string>>(VARS_KEY);
  colors[mode] = { ...colors[mode], [groupKey]: color };
  vars[mode] = { ...vars[mode], ...group.build(color) };
  write(COLORS_KEY, colors);
  write(VARS_KEY, vars);
  applyCustomTheme();
}

export function resetTheme() {
  const mode = currentMode();
  const colors = read<Record<string, string>>(COLORS_KEY);
  const vars = read<Record<string, string>>(VARS_KEY);
  delete colors[mode];
  delete vars[mode];
  write(COLORS_KEY, colors);
  write(VARS_KEY, vars);
  applyCustomTheme();
}

export function hasCustomColors(): boolean {
  return Object.keys(read<Record<string, string>>(COLORS_KEY)[currentMode()] ?? {}).length > 0;
}