import { useEffect, useState } from "react";
import { PRICE_MIN, PRICE_MAX } from "./carsData";

const numCls =
  "w-full border border-[var(--border-input)] rounded-lg px-3 py-2 text-sm text-[var(--text-dark)] bg-[var(--bg-light)] outline-none focus:border-[var(--primary)] transition-colors";

export function PriceFilter({
  min,
  max,
  onChange,
  compact,
}: {
  min: number;
  max: number;
  onChange: (min: number, max: number) => void;
  compact?: boolean;
}) {
  const [minText, setMinText] = useState(String(min));
  const [maxText, setMaxText] = useState(String(max));
  useEffect(() => setMinText(String(min)), [min]);
  useEffect(() => setMaxText(String(max)), [max]);

  const clamp = (n: number) => Math.min(PRICE_MAX, Math.max(PRICE_MIN, n));
  const commitMin = () => {
    const n = Number(minText.replace(",", "."));
    const v = minText.trim() === "" || Number.isNaN(n) ? PRICE_MIN : clamp(n);
    onChange(Math.min(v, max), max);
    setMinText(String(Math.min(v, max)));
  };
  const commitMax = () => {
    const n = Number(maxText.replace(",", "."));
    const v = maxText.trim() === "" || Number.isNaN(n) ? PRICE_MAX : clamp(n);
    onChange(min, Math.max(v, min));
    setMaxText(String(Math.max(v, min)));
  };

  const span = PRICE_MAX - PRICE_MIN;
  const left = ((min - PRICE_MIN) / span) * 100;
  const right = ((max - PRICE_MIN) / span) * 100;

  return (
    <fieldset className={compact ? "min-w-0" : "mb-6 last:mb-0"}>
      <legend
        className={
          compact
            ? "text-xs font-medium text-[var(--text-muted)] mb-1"
            : "text-[var(--text-dark)] font-bold text-sm mb-3"
        }
      >
        Ár (M Ft)
      </legend>
      <style>{`
        .price-range { position: relative; height: 20px; }
        .price-range input[type=range] {
          position: absolute; inset: 0; width: 100%; margin: 0; height: 20px;
          background: none; pointer-events: none; -webkit-appearance: none; appearance: none;
        }
        .price-range input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; pointer-events: auto; cursor: pointer;
          width: 18px; height: 18px; border-radius: 9999px;
          background: var(--secondary); border: 3px solid var(--surface);
          box-shadow: 0 0 0 1px var(--secondary);
        }
        .price-range input[type=range]::-moz-range-thumb {
          pointer-events: auto; cursor: pointer;
          width: 12px; height: 12px; border-radius: 9999px;
          background: var(--secondary); border: 3px solid var(--surface);
          box-shadow: 0 0 0 1px var(--secondary);
        }
        .price-range input[type=range]::-webkit-slider-runnable-track { background: none; }
        .price-range input[type=range]::-moz-range-track { background: none; }
      `}</style>
      <div className={`price-range ${compact ? "mb-2" : "mb-4"}`}>
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 rounded-full bg-[var(--border-color)]" />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full bg-[var(--primary)]"
          style={{ left: `${left}%`, right: `${100 - right}%` }}
        />
        <input
          type="range"
          aria-label="Minimum ár"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={0.5}
          value={min}
          onChange={(e) => onChange(Math.min(Number(e.target.value), max), max)}
        />
        <input
          type="range"
          aria-label="Maximum ár"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={0.5}
          value={max}
          onChange={(e) => onChange(min, Math.max(Number(e.target.value), min))}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          inputMode="decimal"
          aria-label="Minimum ár"
          className={numCls}
          value={minText}
          onChange={(e) => setMinText(e.target.value)}
          onBlur={commitMin}
          onKeyDown={(e) => e.key === "Enter" && commitMin()}
        />
        <span className="text-[var(--text-muted)]">–</span>
        <input
          type="text"
          inputMode="decimal"
          aria-label="Maximum ár"
          className={numCls}
          value={maxText}
          onChange={(e) => setMaxText(e.target.value)}
          onBlur={commitMax}
          onKeyDown={(e) => e.key === "Enter" && commitMax()}
        />
      </div>
    </fieldset>
  );
}
