import { motion, AnimatePresence } from 'framer-motion';

export function InspectorFab({
  active,
  onToggle,
  showTooltip,
}: {
  active: boolean;
  onToggle: () => void;
  showTooltip: boolean;
}) {
  return (
    <>
      <motion.button
        data-se-fab
        onClick={onToggle}
        className={`
          fixed bottom-6 right-6 z-[90] w-12 h-12 rounded-full
          flex items-center justify-center
          shadow-lg transition-all duration-200 cursor-pointer
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6366F1] focus-visible:ring-offset-2
          ${active
            ? 'bg-[#6366F1] text-white shadow-[#6366F1]/30'
            : 'bg-[#1A1F36] text-white/80 hover:bg-[#2D3250] hover:text-white shadow-black/20'
          }
        `}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label={active ? 'Закрыть инспектор элементов' : 'Открыть инспектор элементов'}
        title={active ? 'Закрыть инспектор (Esc)' : 'Инспектор элементов'}
      >
        {active ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m19 19-14-14" />
            <path d="m5 5 14 0" />
            <path d="m5 5 0 14" />
          </svg>
        )}
        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#6366F1] text-white text-[9px] font-bold flex items-center justify-center leading-none select-none">
          3.1
        </span>
      </motion.button>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-20 right-6 z-[90] bg-[#1A1F36] text-white text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none"
          >
            Кликните на элемент для инспекции
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}