import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router";
import { HeroLogo } from "./HeroLogo";
import { BRANDS, FUELS, ALL_BRANDS, ALL_FUELS, PRICE_MIN, PRICE_MAX } from "./carsData";
import { PriceFilter } from "./PriceFilter";

export const selectCls =
  "w-full border border-[var(--border-input)] rounded-lg px-3 py-2.5 text-sm text-[var(--text-dark)] bg-[var(--bg-light)] outline-none focus:border-[var(--primary)] transition-colors";

export function HeroSection() {
  const navigate = useNavigate();
  const [brand, setBrand] = useState(ALL_BRANDS);
  const [fuel, setFuel] = useState(ALL_FUELS);
  const [minPrice, setMinPrice] = useState(PRICE_MIN);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (brand !== ALL_BRANDS) params.set("brand", brand);
    if (fuel !== ALL_FUELS) params.set("fuel", fuel);
    if (minPrice > PRICE_MIN) params.set("minPrice", String(minPrice));
    if (maxPrice < PRICE_MAX) params.set("maxPrice", String(maxPrice));
    const qs = params.toString();
    navigate(qs ? `/cars?${qs}` : "/cars");
  };
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
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
          transition={{ duration: 0.2, ease: "easeIn", delay: 0.05 }}
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
          <form
            id="hero-search"
            onSubmit={submit}
            className="bg-[var(--surface)] rounded-t-2xl p-6 shadow-[var(--shadow-panel)]"
          >
            <p className="text-[var(--text-dark)] font-bold text-sm mb-3">Gyors keresés</p>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1.5fr_auto] gap-3 md:gap-5 items-end">
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Márka</label>
                <select className={selectCls} value={brand} onChange={(e) => setBrand(e.target.value)}>
                  {BRANDS.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Üzemanyag</label>
                <select className={selectCls} value={fuel} onChange={(e) => setFuel(e.target.value)}>
                  {FUELS.map((f) => <option key={f}>{f}</option>)}
                </select>
              </div>
              <PriceFilter
                compact
                min={minPrice}
                max={maxPrice}
                onChange={(min, max) => {
                  setMinPrice(min);
                  setMaxPrice(max);
                }}
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[var(--secondary)] text-white text-sm font-semibold hover:bg-[var(--primary)] transition-colors cursor-pointer"
              >
                Keresés
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
