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
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[#58A6FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D1117]
          ${active
            ? 'bg-[#1F6FEB] text-[#F0F6FC] shadow-[#1F6FEB]/30'
            : 'bg-[#21262D] text-[#E6EDF3]/80 hover:bg-[#30363D] hover:text-[#E6EDF3] shadow-black/40'
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
        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#58A6FF] text-[#0D1117] text-[9px] font-bold flex items-center justify-center leading-none select-none">
          3.5.1
        </span>
      </motion.button>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-20 right-6 z-[90] bg-[#21262D] text-[#E6EDF3] text-xs px-3 py-1.5 rounded-lg shadow-lg border border-[#30363D] whitespace-nowrap pointer-events-none"
          >
            Кликните на элемент для инспекции
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}