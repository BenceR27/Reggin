import { motionValue } from "framer-motion";

// 0 = hero logo still travelling, 1 = docked in the navbar (also the default on pages without a hero logo)
export const logoProgress = motionValue(1);
