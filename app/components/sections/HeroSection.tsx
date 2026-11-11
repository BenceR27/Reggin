import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { HeroLogo } from "./HeroLogo";
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

const field = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const, delay: 1.1 + i * 0.1 },
});

const selectCls =
  "w-full border border-[var(--border-input)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-dark)] bg-[var(--bg-light)] outline-none focus:border-[var(--primary)] transition-colors";

export function HeroSection({ search, onChange }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const overlayRaw = useTransform(scrollY, [0, 250, 700], [1, 0.82, 0.25]);
  const overlayOpacity = useSpring(overlayRaw, { stiffness: 40, damping: 18, mass: 1 });
  return (
    <section ref={sectionRef} className="relative min-h-[95vh] flex items-center">
      <HeroLogo anchorRef={sectionRef} />
      <div className="absolute inset-0">
        <img
          src="/hero.jpg"
          alt="Autószalon"
          className="w-full h-full object-cover"
        />
        <motion.div className="absolute inset-0 bg-[rgba(0,24,53,0.7)]" style={{ opacity: overlayOpacity }} />
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 z-10"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
      >
        <div className="max-w-[1280px] mx-auto px-6">
          <div id="hero-search" className="bg-white rounded-t-2xl p-6 shadow-2xl">
            <motion.p
              className="text-[var(--text-dark)] font-bold text-sm mb-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 1.0 }}
            >
              Gyors keresés
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <motion.div {...field(0)}>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Márka</label>
                <select
                  className={selectCls}
                  value={search.brand}
                  onChange={(e) => onChange({ brand: e.target.value })}
                >
                  {BRANDS.map((b) => <option key={b}>{b}</option>)}
                </select>
              </motion.div>
              <motion.div {...field(1)}>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Üzemanyag</label>
                <select
                  className={selectCls}
                  value={search.fuel}
                  onChange={(e) => onChange({ fuel: e.target.value })}
                >
                  {FUELS.map((f) => <option key={f}>{f}</option>)}
                </select>
              </motion.div>
              <motion.div {...field(2)}>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Árkategória</label>
                <select
                  className={selectCls}
                  value={search.price}
                  onChange={(e) => onChange({ price: e.target.value })}
                >
                  {PRICES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
