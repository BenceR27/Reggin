import { Link } from "react-router";
import { motion, useTransform } from "framer-motion";
import { logoProgress } from "./logoProgress";

export function NavLogo() {
  const opacity = useTransform(logoProgress, (p) => (p >= 0.995 ? 1 : 0));

  return (
    <motion.div id="nav-logo" style={{ opacity }} className="flex-shrink-0">
      <Link to="/" className="block">
        <img
          src="/regginlogo_nobg.webp"
          alt="Reggin logo"
          width={106}
          height={40}
          className="reggin-navy h-10 bg-[var(--nav-logo-bg)] px-2 py-0.5 rounded-lg object-contain block"
        />
      </Link>
    </motion.div>
  );
}
