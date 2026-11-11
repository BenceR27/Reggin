import { motion, AnimatePresence, type Variants } from "framer-motion";
import type { Car, BadgeColor } from "./carsData";

export const PILL_FILTERS = ["Összes", "Dízel", "Benzin", "Hibrid", "Elektromos"] as const;
export type PillFilter = (typeof PILL_FILTERS)[number];

interface FeaturedCarsSectionProps {
  cars: Car[];
  pillFilter: PillFilter;
  onPillFilter: (f: PillFilter) => void;
}

const BADGE_COLORS: Record<BadgeColor, string> = {
  green: "bg-[var(--primary)]",
  navy: "bg-[var(--secondary)]",
  orange: "bg-[var(--badge-orange)]",
};

function IconCalendar() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function IconMap() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  );
}

function IconFuel() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h2l2-7h10l2 7h2v8a1 1 0 01-1 1H4a1 1 0 01-1-1v-8z" />
    </svg>
  );
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

function CarCard({ car }: { car: Car }) {
  return (
    <motion.div
      layout
      key={car.id}
      variants={cardVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      className="bg-white rounded-2xl overflow-hidden border border-[var(--border-color)] hover:-translate-y-1 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative h-48 bg-[var(--border-color)] overflow-hidden">
        <img
          src={car.image}
          alt={car.brand}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {car.badge && (
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white ${BADGE_COLORS[car.badge.color]}`}>
            {car.badge.text}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="mb-3">
          <p className="text-[var(--primary)] text-xs font-bold uppercase tracking-wide">{car.brand}</p>
          <h3 className="text-[var(--text-dark)] text-lg font-black leading-tight">{car.model}</h3>
        </div>
        <div className="flex gap-3 mb-4">
          <span className="flex items-center gap-1 text-xs text-[var(--text-muted)] bg-[var(--bg-light)] px-2 py-1 rounded-md font-medium">
            <IconCalendar /> {car.year}
          </span>
          <span className="flex items-center gap-1 text-xs text-[var(--text-muted)] bg-[var(--bg-light)] px-2 py-1 rounded-md font-medium">
            <IconMap /> {car.km}
          </span>
          <span className="flex items-center gap-1 text-xs text-[var(--text-muted)] bg-[var(--bg-light)] px-2 py-1 rounded-md font-medium">
            <IconFuel /> {car.fuel}
          </span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-[var(--border-color)]">
          <div>
            <p className="text-xs text-[var(--text-gray-400)] font-medium">Vételár</p>
            <p className="text-[var(--text-dark)] text-xl font-black">{car.priceLabel}</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-[var(--secondary)] text-white text-sm font-semibold hover:bg-[var(--primary)] transition-colors cursor-pointer">
            Részletek
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function FeaturedCarsSection({ cars, pillFilter, onPillFilter }: FeaturedCarsSectionProps) {
  return (
    <section id="autok" className="py-20 bg-[var(--bg-light)]">
      <div className="max-w-[1280px] mx-auto px-6">
        <motion.div
          className="flex flex-wrap justify-between items-end gap-4 mb-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="text-[var(--primary)] font-bold text-sm uppercase tracking-wider mb-2">Kínálatunk</p>
            <h2 className="text-4xl font-black text-[var(--text-dark)]">Kiemelt ajánlataink</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {PILL_FILTERS.map((filter) => (
              <button
                key={filter}
                onClick={() => onPillFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all cursor-pointer ${
                  pillFilter === filter
                    ? "bg-[var(--secondary)] text-white border-[var(--secondary)]"
                    : "bg-white text-[rgba(0,40,85,0.6)] border-[var(--border-input)] hover:border-[rgba(0,40,85,0.4)]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </motion.div>

        {cars.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-[var(--text-muted)]"
          >
            Nincs találat a megadott szűrőkre.
          </motion.p>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <button className="px-8 py-3 border-2 border-[var(--secondary)] text-[var(--secondary)] rounded-xl font-semibold text-sm hover:bg-[var(--secondary)] hover:text-white transition-all cursor-pointer">
            Összes autó megtekintése
          </button>
        </motion.div>
      </div>
    </section>
  );
}
