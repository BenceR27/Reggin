import { useEffect, useRef, useState } from "react";
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

const selectCls =
  "w-full border border-[var(--border-input)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-dark)] bg-[var(--bg-light)] outline-none focus:border-[var(--primary)] transition-colors";

export function HeroSection({ search, onChange }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  // hold the fade until the image is actually decoded, so it never plays on an empty dark box
  const [imgReady, setImgReady] = useState(false);
  useEffect(() => {
    if (imgRef.current?.complete) setImgReady(true);
  }, []);
  const { scrollY } = useScroll();
  const overlayRaw = useTransform(scrollY, [0, 250, 700], [1, 0.82, 0.25]);
  const overlayOpacity = useSpring(overlayRaw, { stiffness: 40, damping: 18, mass: 1 });
  return (
    <section ref={sectionRef} className="relative -mt-16 min-h-screen flex items-center bg-[#0b1424]">
      <HeroLogo anchorRef={sectionRef} />
      <div className="absolute inset-0">
        <motion.img
          ref={imgRef}
          onLoad={() => setImgReady(true)}
          fetchPriority="high"
          src="/hero.jpg"
          alt="Autószalon"
          className="w-full h-full object-cover"
          initial={{ opacity: 0.45 }}
          animate={{ opacity: imgReady ? 1 : 0.45 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        />
        <motion.div className="absolute inset-0 bg-[rgba(0,24,53,0.7)]" style={{ opacity: overlayOpacity }} />
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 z-10"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 1.2 }}
      >
        <div className="max-w-[1280px] mx-auto px-6">
          <div id="hero-search" className="bg-[var(--surface)] rounded-t-2xl p-6 shadow-[var(--shadow-panel)]">
            <p className="text-[var(--text-dark)] font-bold text-sm mb-3">
              Gyors keresés
            </p>
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
