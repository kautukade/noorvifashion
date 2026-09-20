import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useStore } from "../context/store";

export default function Loader() {
  const [done, setDone] = useState(false);
  const reduced = useReducedMotion();
  const { site } = useStore();
  const letters = Array.from(site.storeName.toUpperCase());

  useEffect(() => {
    const t = window.setTimeout(() => setDone(true), reduced ? 500 : 1900);
    return () => window.clearTimeout(t);
  }, [reduced]);

  return (
    <motion.div
      className="fixed inset-0 z-[400] flex flex-col items-center justify-center bg-espresso"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      aria-label={`Loading ${site.storeName}`}
    >
      <div className="flex items-baseline overflow-hidden">
        {letters.map((l, i) => (
          <motion.span
            key={i}
            className="font-display text-6xl font-semibold tracking-[0.08em] text-ivory md:text-8xl"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.12 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
          >
            {l === " " ? "\u00A0" : l}
          </motion.span>
        ))}
      </div>
      <motion.p
        className="mt-4 text-[10px] tracking-[0.5em] text-gold uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        Fashion · Pusad
      </motion.p>
      <div className="mt-10 h-px w-40 overflow-hidden bg-ivory/15 md:w-56">
        <motion.div
          className="h-full bg-gold"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: reduced ? 0.3 : 1.5, ease: "easeInOut" }}
        />
      </div>
      {done && <span className="sr-only">Ready</span>}
    </motion.div>
  );
}
