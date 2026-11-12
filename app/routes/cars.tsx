import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { AnimatePresence } from "framer-motion";
import type { Route } from "./+types/cars";
import { Page } from "../components/layout";
import { CarCard } from "../components/sections/FeaturedCarsSection";
import { BrandLogo } from "../components/sections/BrandLogo";
import { PriceFilter } from "../components/sections/PriceFilter";
import {
  CARS,
  BRANDS,
  FUELS,
  ALL_BRANDS,
  ALL_FUELS,
  PRICE_MIN,
  PRICE_MAX,
} from "../components/sections/carsData";

const PAGE_SIZE = 6;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Autóink - Reggin" },
    { name: "description", content: "Böngéssze teljes autókínálatunkat." },
  ];
}

function FilterGroup({
  title,
  options,
  value,
  onChange,
  collapseAfter,
  logos,
  counts,
}: {
  title: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  collapseAfter?: number;
  logos?: boolean;
  counts?: Record<string, number>;
}) {
  const [expanded, setExpanded] = useState(false);
  const collapsible = collapseAfter !== undefined && options.length > collapseAfter;
  const selectedHidden = collapsible && options.indexOf(value) >= collapseAfter;
  const showAll = !collapsible || expanded || selectedHidden;
  const shown = showAll ? options : options.slice(0, collapseAfter);
  return (
    <fieldset className="mb-6 last:mb-0">
      <legend className="text-[var(--text-dark)] font-bold text-sm mb-2">{title}</legend>
      <div className="grid grid-cols-2 gap-1">
        {shown.map((o) => (
          <label
            key={o}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors break-words ${
              value === o
                ? "brand-selected bg-[var(--secondary)] text-white font-semibold"
                : "text-[var(--text-soft)] hover:bg-[var(--bg-light)]"
            }`}
          >
            <input
              type="radio"
              name={title}
              className="sr-only"
              checked={value === o}
              onChange={() => onChange(o)}
            />
            {logos && o !== ALL_BRANDS && <BrandLogo brand={o} size={30} />}
            <span className="min-w-0">{o}</span>
            {counts && (
              <span
                className={`ml-auto text-[11px] font-semibold tabular-nums px-1.5 rounded-full ${
                  value === o ? "bg-white/20 text-white" : "bg-[var(--bg-light)] text-[var(--text-muted)]"
                }`}
              >
                {counts[o] ?? 0}
              </span>
            )}
          </label>
        ))}
      </div>
      {collapsible && !selectedHidden && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="mt-2 px-3 text-xs font-semibold text-[var(--primary)] cursor-pointer"
        >
          {expanded ? "Kevesebb" : `Továbbiak (+${options.length - collapseAfter})`}
        </button>
      )}
    </fieldset>
  );
}

function Pagination({
  page,
  pages,
  onPage,
}: {
  page: number;
  pages: number;
  onPage: (p: number) => void;
}) {
  const btn =
    "min-w-10 h-10 px-3 rounded-lg border text-sm font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-default";
  return (
    <nav aria-label="Oldalszámozás" className="flex flex-wrap justify-center gap-2 mt-10">
      <button
        className={`${btn} bg-[var(--surface)] text-[var(--text-dark)] border-[var(--border-input)] enabled:hover:border-[var(--pill-hover-border)]`}
        disabled={page === 1}
        onClick={() => onPage(page - 1)}
      >
        ‹
      </button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          aria-current={p === page ? "page" : undefined}
          className={`${btn} ${
            p === page
              ? "bg-[var(--secondary)] text-white border-[var(--secondary)]"
              : "bg-[var(--surface)] text-[var(--text-dark)] border-[var(--border-input)] hover:border-[var(--pill-hover-border)]"
          }`}
          onClick={() => onPage(p)}
        >
          {p}
        </button>
      ))}
      <button
        className={`${btn} bg-[var(--surface)] text-[var(--text-dark)] border-[var(--border-input)] enabled:hover:border-[var(--pill-hover-border)]`}
        disabled={page === pages}
        onClick={() => onPage(page + 1)}
      >
        ›
      </button>
    </nav>
  );
}

export default function Cars() {
  const [params, setParams] = useSearchParams();
  const brand = params.get("brand") ?? ALL_BRANDS;
  const fuel = params.get("fuel") ?? ALL_FUELS;
  const parsePrice = (key: string, fallback: number) => {
    const n = Number(params.get(key));
    return params.get(key) === null || Number.isNaN(n) ? fallback : Math.min(PRICE_MAX, Math.max(PRICE_MIN, n));
  };
  const minPrice = parsePrice("minPrice", PRICE_MIN);
  const maxPrice = Math.max(minPrice, parsePrice("maxPrice", PRICE_MAX));

  const filtered = useMemo(
    () =>
      CARS.filter(
        (c) =>
          (brand === ALL_BRANDS || c.brand === brand) &&
          (fuel === ALL_FUELS || c.fuel === fuel) &&
          c.priceM >= minPrice &&
          c.priceM <= maxPrice,
      ),
    [brand, fuel, minPrice, maxPrice],
  );

  const { brandCounts, fuelCounts } = useMemo(() => {
    const inPrice = CARS.filter((c) => c.priceM >= minPrice && c.priceM <= maxPrice);
    const brandPool = inPrice.filter((c) => fuel === ALL_FUELS || c.fuel === fuel);
    const fuelPool = inPrice.filter((c) => brand === ALL_BRANDS || c.brand === brand);
    const tally = (cars: typeof CARS, key: "brand" | "fuel", all: string) => {
      const out: Record<string, number> = { [all]: cars.length };
      for (const c of cars) out[c[key]] = (out[c[key]] ?? 0) + 1;
      return out;
    };
    return {
      brandCounts: tally(brandPool, "brand", ALL_BRANDS),
      fuelCounts: tally(fuelPool, "fuel", ALL_FUELS),
    };
  }, [brand, fuel, minPrice, maxPrice]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(pages, Math.max(1, Number(params.get("page")) || 1));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(changes)) {
      if (v === null) next.delete(k);
      else next.set(k, v);
    }
    setParams(next, { preventScrollReset: true });
  };
  const setFilter = (key: string, value: string, all: string) =>
    update({ [key]: value === all ? null : value, page: null });
  const goToPage = (p: number) => {
    update({ page: p === 1 ? null : String(p) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const setPrice = (min: number, max: number) =>
    update({
      minPrice: min <= PRICE_MIN ? null : String(min),
      maxPrice: max >= PRICE_MAX ? null : String(max),
      page: null,
    });
  const hasFilters =
    brand !== ALL_BRANDS || fuel !== ALL_FUELS || minPrice > PRICE_MIN || maxPrice < PRICE_MAX;

  return (
    <Page>
      <section className="pt-28 pb-20 min-h-screen bg-[var(--bg-light)]">
        <div className="max-w-[1280px] mx-auto px-6">
          <p className="text-[var(--primary)] font-bold text-sm uppercase tracking-wider mb-2">Kínálatunk</p>
          <h1 className="text-4xl font-black text-[var(--text-dark)] mb-8">Összes autó</h1>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <aside className="w-full md:w-80 shrink-0 md:sticky md:top-24 bg-[var(--surface)] rounded-2xl p-5 border border-[var(--border-color)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[var(--text-dark)] font-black">Szűrők</h2>
                {hasFilters && (
                  <button
                    onClick={() => update({ brand: null, fuel: null, minPrice: null, maxPrice: null, page: null })}
                    className="text-xs font-semibold text-[var(--primary)] cursor-pointer"
                  >
                    Törlés
                  </button>
                )}
              </div>
              <FilterGroup title="Márka" options={BRANDS} value={brand} collapseAfter={8} logos counts={brandCounts} onChange={(v) => setFilter("brand", v, ALL_BRANDS)} />
              <FilterGroup title="Üzemanyag" options={FUELS} value={fuel} counts={fuelCounts} onChange={(v) => setFilter("fuel", v, ALL_FUELS)} />
              <PriceFilter min={minPrice} max={maxPrice} onChange={setPrice} />
            </aside>

            <div className="flex-1 min-w-0">
              <p className="text-sm text-[var(--text-muted)] mb-4">{filtered.length} találat</p>

              {filtered.length === 0 ? (
                <p className="text-center py-16 text-[var(--text-muted)]">Nincs találat a megadott szűrőkre.</p>
              ) : (
                <div className="relative grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {visible.map((car) => (
                      <CarCard key={car.id} car={car} />
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {pages > 1 && <Pagination page={page} pages={pages} onPage={goToPage} />}
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}
