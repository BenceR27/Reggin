import { useEffect, useState, type RefObject } from "react";
import { animate, motion, type MotionStyle, useMotionValue, useScroll, useTransform } from "framer-motion";
import { logoProgress } from "../nav/logoProgress";

const LOGO_SRC = "/regginlogo_nobg.webp";
const SPLIT = "31.25%";
const NAV_HEIGHT = 64;
const SCROLL_THRESHOLD = 40;
const INTRO_DURATION = 1500;

const smooth = (p: number) => p * p * (3 - 2 * p);
const easeY = (p: number) => 0.5 * p + 0.5 * smooth(p);
const easeX = (p: number) => 0.4 * p + 0.6 * Math.pow(smooth(p), 1.25);

interface Geo {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startScale: number;
  width: number;
  height: number;
}

const EMPTY_GEO: Geo = { startX: 0, startY: 0, endX: 0, endY: 0, startScale: 1, width: 0, height: 0 };

function SplitLogo({
  k,
  filter,
  className,
  style,
}: {
  k: number;
  filter?: string;
  className?: string;
  style?: MotionStyle;
}) {
  return (
    <motion.div
      className={`absolute ${className ?? ""}`}
      style={{ top: 2 * k, bottom: 2 * k, left: 8 * k, right: 8 * k, filter, ...style }}
    >
      <motion.img
        src={LOGO_SRC}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-contain"
        style={{ clipPath: `inset(0 calc(100% - ${SPLIT}) 0 0)`, transformOrigin: "15% 50%" }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${SPLIT})` }}>
        <motion.img
          src={LOGO_SRC}
          alt=""
          aria-hidden
          className="w-full h-full object-contain"
          initial={{ x: "-34%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
        />
      </div>
    </motion.div>
  );
}

export function HeroLogo({ anchorRef }: { anchorRef: RefObject<HTMLElement | null> }) {
  const [geo, setGeo] = useState<Geo>(EMPTY_GEO);
  const { scrollY } = useScroll();
  const progress = useMotionValue(0);

  useEffect(() => {
    logoProgress.set(0);
    return () => logoProgress.set(1);
  }, []);

  useEffect(() => {
    const navLogo = document.getElementById("nav-logo");

    const measure = () => {
      const hero = anchorRef.current;
      if (!navLogo || !hero) return;

      const nav = navLogo.getBoundingClientRect();
      if (nav.width < 40) return;

      const headerTop = navLogo.closest("header")?.getBoundingClientRect().top ?? 0;
      const heroRect = hero.getBoundingClientRect();
      const heroTop = heroRect.top + window.scrollY;
      const searchHeight = document.getElementById("hero-search")?.offsetHeight ?? 130;
      const visibleHeight = Math.min(heroRect.height, window.innerHeight - heroTop);

      const startScale = Math.min(540, window.innerWidth * 0.85) / nav.width;
      const width = nav.width * startScale;
      const height = nav.height * startScale;
      const centerY = heroTop + NAV_HEIGHT + (visibleHeight - NAV_HEIGHT - searchHeight) / 2;

      setGeo({
        startX: (window.innerWidth - width) / 2,
        startY: centerY - height / 2,
        endX: nav.left,
        endY: nav.top - headerTop,
        startScale,
        width,
        height,
      });
    };

    measure();
    window.addEventListener("resize", measure);
    const observer = new ResizeObserver(measure);
    if (navLogo) observer.observe(navLogo);

    return () => {
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, [anchorRef]);

  useEffect(() => {
    let target = scrollY.get() > SCROLL_THRESHOLD ? 1 : 0;
    let introDone = target === 1;
    let animation: ReturnType<typeof animate> | undefined;

    progress.set(target);

    const update = (y: number) => {
      const next = y > SCROLL_THRESHOLD ? 1 : 0;
      if (next === target) return;

      if (next === 1 && y > window.innerHeight * 0.25) {
        introDone = true;
        target = 1;
        animation?.stop();
        progress.set(1);
        return;
      }

      if (!introDone) return;
      target = next;
      animation?.stop();
      animation = animate(progress, next, { duration: 0.9, ease: [0.45, 0, 0.2, 1] });
    };

    const timer = setTimeout(() => {
      introDone = true;
      update(scrollY.get());
    }, INTRO_DURATION);
    const unsubscribe = scrollY.on("change", update);

    return () => {
      clearTimeout(timer);
      unsubscribe();
      animation?.stop();
    };
  }, [scrollY, progress]);

  useEffect(() => progress.on("change", (v) => logoProgress.set(Math.min(1, Math.max(0, v)))), [progress]);

  const x = useTransform(progress, (p) => geo.startX + (geo.endX - geo.startX) * easeX(p));
  const y = useTransform(progress, (p) => geo.startY + (geo.endY - geo.startY) * easeY(p));
  const scale = useTransform(progress, (p) => 1 + (1 / geo.startScale - 1) * easeY(p));
  const opacity = useTransform(progress, (p) => (p >= 0.995 ? 0 : 1));
  const backdropOpacity = useTransform(progress, [0.55, 0.95], [0, 1]);
  const whiteOpacity = useTransform(progress, [0.45, 0.9], [1, 0]);
  const navyOpacity = useTransform(progress, [0.45, 0.9], [0, 1]);

  if (!geo.width) return null;

  const k = geo.startScale;
  const whiteFilter = `brightness(0) invert(1) drop-shadow(0 ${2 * k}px ${12 * k}px rgba(0,0,0,0.55))`;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[60] pointer-events-none"
      style={{ x, y, scale, opacity, transformOrigin: "0 0", width: geo.width, height: geo.height }}
    >
      <motion.div
        className="absolute inset-0 bg-[var(--nav-logo-bg)]"
        style={{ opacity: backdropOpacity, borderRadius: 8 * k }}
      />
      <div className="relative w-full h-full" role="img" aria-label="Reggin">
        <SplitLogo k={k} className="reggin-navy" style={{ opacity: navyOpacity }} />
        <SplitLogo k={k} filter={whiteFilter} style={{ opacity: whiteOpacity }} />
      </div>
    </motion.div>
  );
}
