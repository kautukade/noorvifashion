import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePointerFine } from "./ui";

/**
 * Elegant custom cursor for fine pointers.
 * Elements opt in with data-cursor="view" | "play" | "explore".
 */
export default function CustomCursor() {
  const fine = usePointerFine();
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [pressed, setPressed] = useState(false);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const dotX = useSpring(mx, { stiffness: 900, damping: 60, mass: 0.4 });
  const dotY = useSpring(my, { stiffness: 900, damping: 60, mass: 0.4 });
  const ringX = useSpring(mx, { stiffness: 220, damping: 26, mass: 0.7 });
  const ringY = useSpring(my, { stiffness: 220, damping: 26, mass: 0.7 });

  useEffect(() => {
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add("fine-cursor");

    const move = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      const el = t?.closest?.("[data-cursor]") as HTMLElement | null;
      setLabel(el?.dataset.cursor ?? null);
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => setEnabled(false);
    const enter = () => setEnabled(true);

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);
    return () => {
      document.documentElement.classList.remove("fine-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
    };
  }, [fine, mx, my]);

  if (!fine) return null;

  const active = label !== null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[300] hidden lg:block" aria-hidden>
      {/* dot */}
      <motion.div
        className="absolute top-0 left-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold"
        style={{ x: dotX, y: dotY, opacity: enabled ? 1 : 0 }}
      />
      {/* ring / label */}
      <motion.div
        className="absolute top-0 left-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
        style={{
          x: ringX,
          y: ringY,
          opacity: enabled ? 1 : 0,
          width: active ? 84 : 34,
          height: active ? 84 : 34,
          scale: pressed ? 0.86 : 1,
          backgroundColor: active ? "rgba(38,28,24,0.92)" : "rgba(0,0,0,0)",
          border: active ? "1px solid rgba(185,148,91,0.9)" : "1px solid rgba(38,28,24,0.35)",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <span
          className="font-sans text-[10px] font-medium tracking-[0.28em] text-ivory uppercase"
          style={{ opacity: active ? 1 : 0, transition: "opacity .2s" }}
        >
          {label}
        </span>
      </motion.div>
    </div>
  );
}
