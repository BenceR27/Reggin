import { motion } from "framer-motion";
import { BRANDS, FUELS, PRICES } from "./carsData";

export interface SearchState {
  brand: string;
  fuel: string;
  price: string;
}

interface HeroSectionProps {
  search: SearchState;
  onChange: (next: Partial<SearchState>) => void;
}

const selectCls =
  "w-full border border-[var(--border-input)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-dark)] bg-[var(--bg-light)] outline-none focus:border-[var(--primary)] transition-colors";

export function HeroSection({ search, onChange }: HeroSectionProps) {
  return (
    <section className="relative min-h-[70vh] flex items-center">
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1692406069831-0bb7ea297645?w=1600&h=900&fit=crop&auto=format"
          alt="Autószalon"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[rgba(0,40,85,0.3)]" />
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="bg-white rounded-t-2xl p-6 shadow-2xl">
            <p className="text-[var(--text-dark)] font-bold text-sm mb-3">Gyors keresés</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Márka</label>
                <select
                  className={selectCls}
                  value={search.brand}
                  onChange={(e) => onChange({ brand: e.target.value })}
                >
                  {BRANDS.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Üzemanyag</label>
                <select
                  className={selectCls}
                  value={search.fuel}
                  onChange={(e) => onChange({ fuel: e.target.value })}
                >
                  {FUELS.map((f) => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Árkategória</label>
                <select
                  className={selectCls}
                  value={search.price}
                  onChange={(e) => onChange({ price: e.target.value })}
                >
                  {PRICES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
