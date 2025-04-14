import { motion } from 'framer-motion';

export function ComingSoon() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="text-sm text-[#34495E]/60"
    >
      🏒 Coming soon for the 2024 NHL Playoffs
    </motion.div>
  );
} 