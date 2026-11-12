import type { Ref } from "react";
import { Link } from "react-router";
import { motion, type Variants } from "framer-motion";
import type { Car } from "./carsData";
import { BrandLogo } from "./BrandLogo";

interface FeaturedCarsSectionProps {
  cars: Car[];
}

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
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.12, ease: "easeOut" } },
};

export function CarCard({
  car,
  reveal = false,
  ref,
}: {
  car: Car;
  reveal?: boolean;
  ref?: Ref<HTMLDivElement>;
}) {
  const motionProps = reveal
    ? {
        variants: cardVariants,
        initial: "hidden",
        whileInView: "show",
        viewport: { once: true, margin: "0px 0px -60px 0px" },
      }
    : {
        layout: "position" as const,
        transition: { layout: { duration: 0.2, ease: "easeOut" as const } },
        variants: cardVariants,
        initial: "hidden",
        animate: "show",
        exit: "exit",
      };
  return (
    <motion.div
      ref={ref}
      key={car.id}
      {...motionProps}
      className="group bg-[var(--surface)] rounded-2xl overflow-hidden border border-[var(--border-color)] transition-shadow duration-500 ease-out hover:shadow-[0_24px_56px_-12px_var(--shadow-hover)]"
    >
      <div className="relative h-48 bg-[var(--border-color)] overflow-hidden">
        <img
          src={car.image}
          alt={car.brand}
          className="w-full h-full object-cover blur-[0.6px] transition-[filter] duration-500 ease-out group-hover:blur-[0px]"
        />
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[var(--primary)] text-xs font-bold uppercase tracking-wide">{car.brand}</p>
            <h3 className="text-[var(--text-dark)] text-lg font-black leading-tight">{car.model}</h3>
          </div>
          <BrandLogo brand={car.brand} size={56} />
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

export function FeaturedCarsSection({ cars }: FeaturedCarsSectionProps) {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} reveal />
            ))}
          </div>
        )}

        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Link
            to="/cars"
            className="inline-block px-8 py-3 border-2 border-[var(--text-dark)] text-[var(--text-dark)] rounded-xl font-semibold text-sm no-underline hover:bg-[var(--secondary)] hover:border-[var(--secondary)] hover:text-white transition-all"
          >
            Összes autó megtekintése
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
