import { useEffect, useState, type RefObject } from "react";
import { motion, type MotionStyle, useScroll, useSpring, useTransform } from "framer-motion";
import { logoProgress } from "../nav/logoProgress";

interface Geo {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startScale: number;
  width: number;
  height: number;
  distance: number;
}

const ZERO: Geo = { startX: 0, startY: 0, endX: 0, endY: 0, startScale: 1, width: 0, height: 0, distance: 400 };

const smooth = (p: number) => p * p * (3 - 2 * p);
const easeY = (p: number) => 0.5 * p + 0.5 * smooth(p);
const easeX = (p: number) => 0.4 * p + 0.6 * Math.pow(smooth(p), 1.25);

// the logo is ~800px wide; the mark ends around x=250 and the wordmark starts after it
const SPLIT = "31.25%";
const LOGO_SRC = "/regginlogo_nobg.png";

// two clipped copies of the same image: the mark pops in first, then the wordmark slides out from behind it
// laid out at the hero size (`k` = hero size / navbar size) so the browser paints it sharp, then scaled down on scroll
function SplitLogo({ k, filter, style }: { k: number; filter?: string; style?: MotionStyle }) {
  return (
    <motion.div
      className="absolute"
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
  const [geo, setGeo] = useState<Geo>(ZERO);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    logoProgress.set(0);
    return () => logoProgress.set(1);
  }, []);

  useEffect(() => {
    const measure = () => {
      const nav = document.getElementById("nav-logo");
      const hero = anchorRef.current;
      if (!nav || !hero) return;
      const n = nav.getBoundingClientRect();
      // image not loaded yet: only the padding has width
      if (n.width < 40) return;
      // the navbar drops in on load, so on the first measure it is still translated off-screen; undo that offset
      const headerTop = nav.closest("header")?.getBoundingClientRect().top ?? 0;
      const h = hero.getBoundingClientRect();
      const vw = window.innerWidth;
      const startScale = Math.min(540 / n.width, (vw * 0.85) / n.width);
      const scrollY = window.scrollY;
      const cx = vw / 2;
      const visibleH = Math.min(h.height, window.innerHeight - (h.top + scrollY));
      const searchBoxH = (document.getElementById("hero-search")?.offsetHeight ?? 130);
      // the navbar (64px) now overlays the top of the image, so centre in the free space between it and the search panel
      const navH = 64;
      const cy = h.top + scrollY + navH + (visibleH - navH - searchBoxH) / 2;
      const startX = cx - (n.width * startScale) / 2;
      const startY = cy - (n.height * startScale) / 2;
      setGeo({
        startX,
        startY,
        endX: n.left,
        endY: n.top - headerTop,
        startScale,
        width: n.width * startScale,
        height: n.height * startScale,
        distance: Math.max(380, (startY - (n.top - headerTop)) * 1.3),
      });
      setReady(true);
    };
    measure();
    window.addEventListener("resize", measure);
    // the navbar logo has no width until its image loads, so re-measure once it does
    const nav = document.getElementById("nav-logo");
    const observer = nav ? new ResizeObserver(measure) : null;
    if (nav) observer?.observe(nav);
    return () => {
      window.removeEventListener("resize", measure);
      observer?.disconnect();
    };
  }, [anchorRef]);

  const { scrollY } = useScroll();
  const rawProgress = useTransform(scrollY, (v) => Math.min(1, Math.max(0, v / geo.distance)));
  const progress = useSpring(rawProgress, { stiffness: 45, damping: 15, mass: 1, restDelta: 0.0005 });

  useEffect(() => progress.on("change", (v) => logoProgress.set(Math.min(1, Math.max(0, v)))), [progress]);

  const x = useTransform(progress, (p) => {
    const e = easeX(p);
    return geo.startX + (geo.endX - geo.startX) * e;
  });
  const y = useTransform(progress, (p) => {
    const e = easeY(p);
    return geo.startY + (geo.endY - geo.startY) * e;
  });
  const scale = useTransform(progress, (p) => {
    const e = easeY(p);
    return 1 + (1 / geo.startScale - 1) * e;
  });
  const background = useTransform(progress, [0.55, 0.95], ["rgba(255,255,255,0)", "rgba(255,255,255,1)"]);
  const whiteOpacity = useTransform(progress, [0.45, 0.9], [1, 0]);
  const navyOpacity = useTransform(progress, [0.45, 0.9], [0, 1]);
  const opacity = useTransform(progress, (p) => (p >= 0.995 ? 0 : 1));

  if (!ready) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[60] pointer-events-none"
      style={{
        x,
        y,
        scale,
        background,
        opacity,
        transformOrigin: "0 0",
        width: geo.width,
        height: geo.height,
        borderRadius: 8 * geo.startScale,
      }}
    >
      <div className="relative w-full h-full" role="img" aria-label="Reggin">
        <SplitLogo k={geo.startScale} style={{ opacity: navyOpacity }} />
        <SplitLogo
          k={geo.startScale}
          filter={`brightness(0) invert(1) drop-shadow(0 ${2 * geo.startScale}px ${12 * geo.startScale}px rgba(0,0,0,0.55))`}
          style={{ opacity: whiteOpacity }}
        />
      </div>
    </motion.div>
  );
}
