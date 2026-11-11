import { motion } from "framer-motion";

function IconLocation() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconEmail() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

const inputCls =
  "w-full border border-[var(--border-input)] rounded-xl px-4 py-3 text-sm text-[var(--text-dark)] font-[inherit] outline-none transition-all focus:border-[var(--primary)] focus:shadow-[0_0_0_2px_rgba(0,166,81,0.15)] bg-[var(--surface)] placeholder:text-[var(--text-gray-400)]";

export function ContactSection() {
  return (
    <section id="kapcsolat" className="py-20 bg-[var(--bg-light)]">
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <p className="text-[var(--primary)] font-bold text-sm uppercase tracking-wider mb-2">Kapcsolat</p>
          <h2 className="text-4xl font-black text-[var(--text-dark)] mb-6">Látogass el hozzánk!</h2>
          <p className="text-[var(--text-soft)] mb-10">
            Szakértő munkatársaink készséggel várnak, segítenek megtalálni az igényeidnek megfelelő járművet és elintéznek minden adminisztrációt.
          </p>

          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--icon-bg)] text-[var(--icon-fg)] flex items-center justify-center shrink-0">
                <IconLocation />
              </div>
              <div>
                <p className="text-xs text-[var(--text-gray-400)] font-medium">Cím</p>
                <p className="text-[var(--text-dark)] text-sm font-semibold">3525 Miskolc, Palóczy László utca 3.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--icon-bg)] text-[var(--icon-fg)] flex items-center justify-center shrink-0">
                <IconEmail />
              </div>
              <div>
                <p className="text-xs text-[var(--text-gray-400)] font-medium">E-mail</p>
                <p className="text-[var(--text-dark)] text-sm font-semibold">fodorr@kkszki.hu · witmannz@kkszki.hu · rizb@kkszki.hu</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--icon-bg)] text-[var(--icon-fg)] flex items-center justify-center shrink-0">
                <IconClock />
              </div>
              <div>
                <p className="text-xs text-[var(--text-gray-400)] font-medium">Nyitvatartás</p>
                <p className="text-[var(--text-dark)] text-sm font-semibold">H–P: 9:00–18:00 · Szo: 9:00–14:00</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          className="bg-[var(--surface)] border border-[var(--border-color)] rounded-2xl p-8 shadow-[var(--shadow-soft)]"
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
        >
          <h3 className="text-xl font-black text-[var(--text-dark)] mb-6">Küldj üzenetet</h3>
          <form>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-[var(--text-label-soft)] mb-1.5">Teljes név</label>
                <input type="text" className={inputCls} placeholder="Kovács Péter" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-[var(--text-label-soft)] mb-1.5">Telefonszám</label>
                <input type="tel" className={inputCls} placeholder="+36 30 123 4567" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-bold text-[var(--text-label-soft)] mb-1.5">E-mail cím</label>
              <input type="email" className={inputCls} placeholder="kovacs.peter@email.hu" />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-bold text-[var(--text-label-soft)] mb-1.5">Üzenet</label>
              <textarea className={`${inputCls} resize-y`} rows={4} placeholder="Milyen autó iránt érdeklődsz?" />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[var(--secondary)] text-white font-black text-sm hover:bg-[var(--primary)] transition-colors cursor-pointer"
            >
              Üzenet küldése
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
