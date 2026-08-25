import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

/** Fullscreen editorial lightbox for blog galleries. */
export default function Lightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: { url: string; alt: string }[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const open = index >= 0 && index < items.length;

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex(Math.min(items.length - 1, index + 1));
      if (e.key === "ArrowLeft") onIndex(Math.max(0, index - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, index, items.length, onClose, onIndex]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[260] flex h-[100dvh] flex-col bg-espresso/97 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          onClick={onClose}
        >
          <div className="flex items-center justify-between px-5 py-4 text-ivory">
            <p className="text-[10px] tracking-[0.35em] uppercase">
              <span className="text-gold">{index + 1}</span> / {items.length} ✦ Noorvi Journal
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close viewer"
              className="rounded-full border border-ivory/25 p-3 transition-colors hover:border-gold hover:text-gold"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-14 pb-6 md:px-24" onClick={(e) => e.stopPropagation()}>
            <AnimatePresence mode="wait">
              <motion.img
                key={index}
                src={items[index].url}
                alt={items[index].alt}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="max-h-full max-w-full object-contain shadow-2xl"
              />
            </AnimatePresence>

            {index > 0 && (
              <button
                type="button"
                onClick={() => onIndex(index - 1)}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-ivory/25 bg-espresso/50 p-3.5 text-ivory backdrop-blur transition-all hover:border-gold hover:text-gold md:left-8"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            {index < items.length - 1 && (
              <button
                type="button"
                onClick={() => onIndex(index + 1)}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-ivory/25 bg-espresso/50 p-3.5 text-ivory backdrop-blur transition-all hover:border-gold hover:text-gold md:right-8"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>

          {items[index].alt && (
            <p className="pb-6 text-center text-xs tracking-wide text-ivory/55" onClick={(e) => e.stopPropagation()}>
              {items[index].alt}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
