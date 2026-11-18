import { useEffect, useRef, useState } from "react";
import { GROUPS, applyCustomTheme, currentColors, currentMode, hasCustomColors, resetTheme, setThemeColor } from "../../lib/theme";

export function ThemeCustomizer() {
  const [open, setOpen] = useState(false);
  const [colors, setColors] = useState<Record<string, string>>({});
  const [customized, setCustomized] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const refresh = () => {
    setColors(currentColors());
    setCustomized(hasCustomColors());
  };

  useEffect(() => {
    applyCustomTheme();
  }, []);

  useEffect(() => {
    if (!open) return;
    refresh();
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
        title="Színek testreszabása"
        aria-label="Színek testreszabása"
        className="text-white/80 hover:text-white border border-white/20 hover:border-white/40 p-2 rounded-lg transition-colors cursor-pointer"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3a9 9 0 100 18c1.1 0 1.8-.9 1.5-1.9-.3-1 .4-2.1 1.5-2.1H17a4 4 0 004-4c0-5-4-10-9-10zM7.5 12h.01M10 8h.01M14 8h.01M16.5 12h.01"
          />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Színek testreszabása"
          className="absolute right-0 top-full mt-3 w-72 max-w-[calc(100vw-3rem)] z-50 bg-[var(--surface)] text-[var(--text-dark)] border border-[var(--border-color)] rounded-xl p-4 shadow-[var(--shadow-panel)]"
        >
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-black text-sm">Színek</h2>
            {customized && (
              <button
                type="button"
                onClick={() => {
                  resetTheme();
                  refresh();
                }}
                className="text-xs font-semibold text-[var(--primary)] cursor-pointer"
              >
                Alaphelyzet
              </button>
            )}
          </div>
          <p className="text-xs text-[var(--text-muted)] mb-3">
            A {currentMode() === "light" ? "világos" : "sötét"} téma színei. A világos és a sötét téma külön mentődik.
          </p>
          <ul className="flex flex-col gap-2">
            {GROUPS.map((g) => (
              <li key={g.key}>
                <label className="flex items-center justify-between gap-3 text-sm cursor-pointer">
                  <span>{g.label}</span>
                  <input
                    type="color"
                    value={colors[g.key] ?? "#000000"}
                    onChange={(e) => {
                      setThemeColor(g.key, e.target.value);
                      refresh();
                    }}
                    className="w-9 h-7 p-0 border border-[var(--border-input)] rounded cursor-pointer bg-transparent"
                  />
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}