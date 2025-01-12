import { motion } from 'framer-motion';

interface BgOverlayProps {
  onClick: () => void;
}
export function BgOverlay({ onClick }: BgOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed inset-0 z-40 bg-black sm:hidden"
      onClick={onClick}
    />
  );
}
